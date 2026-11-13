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
import { renderTitleCard } from "./title-image.js";
import { TITLE_IMAGE_GUIDE, GUIDE_URI } from "./title-image-guide.js";
import { isScheduled, publishTime } from "../src/lib/scheduling.js";

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
// `scheduled` mirrors the site's rule: a post is scheduled while either its
// publishDate or its show date is in the future.
function summarize(post) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    summary: post.summary,
    date: post.date,
    publishDate: post.publishDate || null,
    scheduled: isScheduled(post),
  };
}

// Shared shape for the title-card fields, so create_post, update_post and
// create_title_image all accept the same thing.
const titleImageShape = z.object({
  title: z.string().optional().describe("Headline. Defaults to the post title."),
  subtitle: z.string().optional().describe("Italic line under the headline."),
  accentWord: z.string().optional().describe("One word inside the title to colour green."),
  category: z.string().optional().describe("Topbar category. Defaults to the post category."),
  date: z.string().optional().describe("Topbar date. Defaults to the post date."),
  models: z.array(z.object({
    name: z.string(),
    meta: z.string().optional(),
    color: z.string().optional(),
  })).max(4).optional().describe("Up to four blocks for a comparison footer."),
  caption: z.string().optional().describe("Single caption line, used when there are no models."),
  folder: z.string().optional().describe("Subfolder under public/assests/images."),
  filename: z.string().optional().describe("File base name."),
  scale: z.number().optional().describe("1 for 1600x900, 2 for 3200x1800."),
  headlineSize: z.number().optional().describe("Force the headline size in px."),
});

function buildServer() {
  const server = new McpServer(SERVER_INFO);

  // The full title-card recipe, so a client can read it on demand instead of
  // it living only in the tool description.
  server.registerResource(
    "how-to-make-a-title",
    GUIDE_URI,
    {
      title: "How to make a title image",
      description: "The method behind create_title_image: the site's design tokens, the render step and the gotchas.",
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [{
        uri: GUIDE_URI,
        mimeType: "text/markdown",
        text: TITLE_IMAGE_GUIDE,
      }],
    })
  );

  // Surfaces the same guide as a prompt, so a client can inject it into a
  // conversation in one step.
  server.registerPrompt(
    "make_title_image",
    {
      title: "Make a title image",
      description: "Instructions for designing a title card for a Minescout Life post.",
      argsSchema: {
        topic: z.string().optional().describe("The post topic, so the card can be drafted for it."),
      },
    },
    ({ topic }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text:
            `${TITLE_IMAGE_GUIDE}\n\n` +
            `---\n\nNow design a title card${topic ? ` for: ${topic}` : ""} by calling ` +
            `create_title_image, then pass the returned path as the post's heroImage ` +
            `(or let create_post do it with its titleImage option).`,
        },
      }],
    })
  );

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
        const when = isScheduled(p)
          ? `scheduled until ${new Date(publishTime(p)).toISOString()}`
          : (p.date || "no date");
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
        "Fails if the id already exists — use update_post to change an existing post. " +
        "Pass titleImage to render a matching title card in the same call and set it as the hero image.",
      inputSchema: {
        title: z.string().describe("Post title."),
        summary: z.string().describe("One-sentence teaser shown on cards and in the list."),
        content: z.string().describe("Post body, as Markdown or HTML."),
        id: z.string().optional().describe("URL slug. Derived from the title when omitted."),
        category: z.string().optional().describe("Category, e.g. Tech, App, Updates. Use 'AI Posts' for the weekly AI column — it is kept off the home timeline and shown only on its own tab. Defaults to Tech."),
        date: z.string().optional().describe("Display date, e.g. 'November 6, 2026'. Defaults to today."),
        heroImage: z.string().optional().describe("Hero image URL, or a path beginning with /."),
        linkText: z.string().optional().describe("Card link label. Defaults to 'Read Entry'."),
        publishDate: z.string().optional().describe("ISO datetime to schedule for. Omit to publish now."),
        titleImage: titleImageShape.optional()
          .describe("Render a title card and use it as the hero image. The post title is the headline unless you override it."),
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

      const date = args.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

      // Render the title card before writing, so a render failure never leaves
      // a half-finished post behind.
      let heroImage = args.heroImage;
      let imageNote = "";
      if (args.titleImage) {
        const rendered = await renderTitleCard({
          ...args.titleImage,
          title: args.titleImage.title || title,
          category: args.titleImage.category || args.category,
          date: args.titleImage.date || date,
        });
        if (!rendered.ok) return errorResult(`Could not create the title image: ${rendered.error}`);
        heroImage = rendered.path;
        imageNote = `\nTitle image: ${rendered.path}` +
          (rendered.fontsLoaded ? "" : " (WARNING: site fonts did not load — re-render)");
      }

      const post = normalizePost(
        {
          ...args,
          title,
          summary,
          heroImage,
          content: contentToHtml(args.content),
          date,
        },
        id
      );

      try {
        savePost(post);
      } catch (e) {
        return errorResult(`Could not write the post: ${e.message}`);
      }

      const state = post.publishDate ? `scheduled for ${post.publishDate}` : "published now";
      return textResult(`Created "${post.title}" (id: ${post.id}), ${state}.\nView it at /post/${post.id}${imageNote}`);
    }
  );

  server.registerTool(
    "update_post",
    {
      title: "Update post",
      description:
        "Edit an existing post. Only the fields you pass are changed; everything else is kept. " +
        "Passing publishDate: '' clears a schedule so the post is live. " +
        "Pass titleImage to render a new title card and set it as the hero image.",
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
        titleImage: titleImageShape.optional()
          .describe("Render a title card and use it as the hero image."),
      },
    },
    async (args) => {
      const id = cleanText(args.id, 120).trim();
      if (!isPostId(id)) return errorResult(`Invalid post id: "${args.id}".`);
      const existing = readPost(id);
      if (!existing) return errorResult(`No post with id "${id}".`);

      // Render before merging so a render failure leaves the post untouched.
      let heroImage = args.heroImage;
      let imageNote = "";
      if (args.titleImage) {
        const rendered = await renderTitleCard({
          ...args.titleImage,
          title: args.titleImage.title || args.title || existing.title,
          category: args.titleImage.category || args.category || existing.category,
          date: args.titleImage.date || args.date || existing.date,
        });
        if (!rendered.ok) return errorResult(`Could not create the title image: ${rendered.error}`);
        heroImage = rendered.path;
        imageNote = `\nTitle image: ${rendered.path}` +
          (rendered.fontsLoaded ? "" : " (WARNING: site fonts did not load — re-render)");
      }

      // Start from the stored post so untouched fields survive, then overlay.
      const merged = { ...existing };
      for (const key of ["title", "summary", "category", "date", "linkText"]) {
        if (args[key] !== undefined) merged[key] = args[key];
      }
      if (heroImage !== undefined) merged.heroImage = heroImage;
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
      return textResult(`Updated "${post.title}" (id: ${post.id}).${imageNote}`);
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

  server.registerTool(
    "create_title_image",
    {
      title: "Create title image",
      description:
        "Render a title card (hero image) for a post and save it to the site. The card is designed as a " +
        "web page and photographed with a headless browser, so it uses the site's real fonts and colors. " +
        "Returns the public path to pass as heroImage. Read the 'how-to-make-a-title' resource for the " +
        "full method. Use short, punchy titles — long ones wrap and collide with the subtitle.\n\n" +
        "Example: title 'Argon and Carbon', accentWord 'Carbon', subtitle 'The periodic table inside " +
        "Gemini 4', category 'Tech', date 'November 2026', and four models for a comparison footer.",
      inputSchema: titleImageShape.extend({
        title: z.string().describe("Headline text. Short is better — 24 characters or fewer fits one line."),
      }),
    },
    async (args) => {
      const result = await renderTitleCard(args);
      if (!result.ok) return errorResult(`Could not create the title image: ${result.error}`);
      const notes = [
        `Created the title image (${result.width}x${result.height}, ${Math.round(result.bytes / 1024)} KB).`,
        `Hero image path: ${result.path}`,
        `Source HTML kept at ${result.path.replace(/\.png$/, ".html")} — edit and re-render, never edit the PNG.`,
        result.fontsLoaded
          ? "Fonts (Lora, Inter) loaded."
          : "WARNING: the site fonts did not load — the card rendered in a fallback font. Check internet access and try again.",
      ];
      return textResult(notes.join("\n"));
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
