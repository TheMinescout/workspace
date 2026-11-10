// MCP server for Minescout Life, mounted at /api/mcp by the Vite api plugin.
//
// Lets an AI agent (Claude Desktop, Cursor, etc.) read and write blog posts on
// life.minescout.net. Auth is a bearer token (MCP_TOKEN); every request is
// rejected without it, because these tools can publish to the live site.
//
// The transport runs stateless (sessionIdGenerator: undefined) so each POST is
// self-contained. A long-lived session map would leak memory across restarts
// and buys nothing here, since every tool call reads and writes a file.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { marked } from "marked";
import {
  postsDir, slugify, readManifest, readPost, savePost, removePost,
  normalizePost, postExists,
} from "./posts-store.js";
import { isPostId, cleanText, safeEqual } from "./security.js";

const SERVER_INFO = { name: "minescout-life", version: "1.0.0" };

// Agents write Markdown far more naturally than hand-rolled HTML. Accept either:
// if the body already looks like HTML, pass it through; otherwise render it.
export function contentToHtml(input) {
  const text = String(input || "").trim();
  if (!text) return "";
  const looksLikeHtml = /<(p|div|h[1-6]|ul|ol|li|blockquote|table|img|figure|section|br)\b[^>]*>/i.test(text);
  if (looksLikeHtml) return text;
  return marked.parse(text, { async: false, gfm: true, breaks: false });
}

function textResult(text) {
  return { content: [{ type: "text", text }] };
}

function errorResult(text) {
  return { content: [{ type: "text", text }], isError: true };
}

// Trimmed view for listings — full post bodies are large and rarely wanted.
function summarize(post) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    summary: post.summary,
    date: post.date,
    publishDate: post.publishDate || null,
    scheduled: !!(post.publishDate && new Date(post.publishDate) > new Date()),
  };
}

function buildServer() {
  const server = new McpServer(SERVER_INFO);

  server.registerTool(
    "list_posts",
    {
      title: "List posts",
      description: "List every post on Minescout Life, newest first. Returns id, title, category, summary and publish state.",
      inputSchema: {
        category: z.string().optional().describe("Only return posts in this category (case-insensitive)."),
      },
    },
    async ({ category }) => {
      let posts = readManifest();
      if (category) {
        const want = category.trim().toLowerCase();
        posts = posts.filter(p => String(p.category || "").toLowerCase() === want);
      }
      if (!posts.length) return textResult("No posts found.");
      const lines = posts.map(p => {
        const when = p.publishDate ? `scheduled ${p.publishDate}` : (p.date || "no date");
        return `- ${p.id}\n  ${p.title} [${p.category || "Tech"}] — ${when}\n  ${p.summary || ""}`;
      });
      return textResult(`${posts.length} post(s):\n\n${lines.join("\n")}`);
    }
  );

  server.registerTool(
    "get_post",
    {
      title: "Get post",
      description: "Fetch one post in full, including its content field.",
      inputSchema: {
        id: z.string().describe("The post id (slug), e.g. my-new-post."),
      },
    },
    async ({ id }) => {
      const clean = cleanText(id, 120).trim();
      if (!isPostId(clean)) return errorResult(`Invalid post id: "${id}". Use lowercase letters, numbers and hyphens.`);
      const post = readPost(clean);
      if (!post) return errorResult(`No post with id "${clean}".`);
      return textResult(JSON.stringify(post, null, 2));
    }
  );

  server.registerTool(
    "create_post",
    {
      title: "Create post",
      description:
        "Publish a new post to Minescout Life. The body may be Markdown or HTML. " +
        "The post goes live immediately unless publishDate is set to a future time. " +
        "Fails if the id already exists — use update_post to change an existing post.",
      inputSchema: {
        title: z.string().describe("Post title."),
        summary: z.string().describe("One-sentence teaser shown on cards and in the list."),
        content: z.string().describe("Post body, as Markdown or HTML."),
        id: z.string().optional().describe("URL slug. Derived from the title when omitted."),
        category: z.string().optional().describe("Category, e.g. Tech, Life, Updates. Defaults to Tech."),
        date: z.string().optional().describe("Display date, e.g. 'November 6, 2026'. Defaults to today."),
        heroImage: z.string().optional().describe("Hero image URL, or a path beginning with /."),
        linkText: z.string().optional().describe("Card link label. Defaults to 'Read Entry'."),
        publishDate: z.string().optional().describe("ISO datetime to schedule for. Omit to publish now."),
      },
    },
    async (args) => {
      const title = cleanText(args.title, 200).trim();
      const summary = cleanText(args.summary, 400).trim();
      if (!title) return errorResult("A title is required.");
      if (!summary) return errorResult("A summary is required.");

      const id = args.id ? cleanText(args.id, 120).trim() : slugify(title);
      if (!isPostId(id)) {
        return errorResult(
          `Could not derive a valid id from "${args.id || title}". ` +
          `Ids must be lowercase letters, numbers and hyphens, starting with a letter or number. Pass an explicit id.`
        );
      }
      if (postExists(id)) {
        return errorResult(`A post with id "${id}" already exists. Use update_post to change it, or pass a different id.`);
      }

      const post = normalizePost(
        {
          ...args,
          title,
          summary,
          content: contentToHtml(args.content),
          date: args.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        },
        id
      );

      try {
        savePost(post);
      } catch (e) {
        return errorResult(`Could not write the post: ${e.message}`);
      }

      const state = post.publishDate ? `scheduled for ${post.publishDate}` : "published now";
      return textResult(`Created "${post.title}" (id: ${post.id}), ${state}.\nView it at /post/${post.id}`);
    }
  );

  server.registerTool(
    "update_post",
    {
      title: "Update post",
      description:
        "Edit an existing post. Only the fields you pass are changed; everything else is kept. " +
        "Passing publishDate: '' clears a schedule so the post is live.",
      inputSchema: {
        id: z.string().describe("The id of the post to update."),
        title: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional().describe("New body, as Markdown or HTML."),
        category: z.string().optional(),
        date: z.string().optional(),
        heroImage: z.string().optional(),
        linkText: z.string().optional(),
        publishDate: z.string().optional().describe("ISO datetime to schedule for, or '' to publish now."),
      },
    },
    async (args) => {
      const id = cleanText(args.id, 120).trim();
      if (!isPostId(id)) return errorResult(`Invalid post id: "${args.id}".`);
      const existing = readPost(id);
      if (!existing) return errorResult(`No post with id "${id}".`);

      // Start from the stored post so untouched fields survive, then overlay.
      const merged = { ...existing };
      for (const key of ["title", "summary", "category", "date", "heroImage", "linkText"]) {
        if (args[key] !== undefined) merged[key] = args[key];
      }
      if (args.content !== undefined) merged.content = contentToHtml(args.content);
      if (args.publishDate !== undefined) merged.publishDate = args.publishDate || null;
      // Keep the original timestamp so the post does not jump to the top of the timeline.
      merged.timestamp = existing.timestamp;

      const post = normalizePost(merged, id);
      if (!post.title) return errorResult("A title is required.");
      if (!post.summary) return errorResult("A summary is required.");

      try {
        savePost(post);
      } catch (e) {
        return errorResult(`Could not update the post: ${e.message}`);
      }
      return textResult(`Updated "${post.title}" (id: ${post.id}).`);
    }
  );

  server.registerTool(
    "delete_post",
    {
      title: "Delete post",
      description: "Permanently delete a post and remove it from the timeline. This cannot be undone.",
      inputSchema: {
        id: z.string().describe("The id of the post to delete."),
      },
    },
    async ({ id }) => {
      const clean = cleanText(id, 120).trim();
      if (!isPostId(clean)) return errorResult(`Invalid post id: "${id}".`);
      const existing = readPost(clean);
      if (!existing) return errorResult(`No post with id "${clean}".`);
      try {
        removePost(clean);
      } catch (e) {
        return errorResult(`Could not delete the post: ${e.message}`);
      }
      return textResult(`Deleted "${existing.title}" (id: ${clean}).`);
    }
  );

  return server;
}

// Exposed for tests: the tool set without the HTTP plumbing.
export { buildServer, summarize, postsDir };

// ── HTTP mounting ───────────────────────────────────────────────────────────

export function constantTimeTokenMatch(provided, expected) {
  if (!expected || typeof provided !== "string" || !provided) return false;
  return safeEqual(provided, expected);
}

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  // Convenience for clients that cannot set an Authorization header.
  return String(req.headers["x-mcp-token"] || "").trim();
}

// Express-style middleware: authenticates, then hands the request to a
// per-request MCP server instance.
export function mcpMiddleware(getToken) {
  return async function handleMcp(req, res, next) {
    if (req.method === "OPTIONS") return next();
    if ((req.url || "").split("?")[0] !== "/") return next();

    const expected = getToken();
    if (!expected) {
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "MCP is not configured: set MCP_TOKEN." },
        id: null,
      }));
    }

    if (!constantTimeTokenMatch(bearerToken(req), expected)) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", "Bearer");
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized." },
        id: null,
      }));
    }

    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => { transport.close(); server.close(); });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (e) {
      console.error("[mcp]", e.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal error." },
          id: null,
        }));
      }
    }
  };
}
