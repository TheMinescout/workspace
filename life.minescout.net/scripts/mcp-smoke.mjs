#!/usr/bin/env node
/**
 * MCP server integration test.
 *
 * Starts the app server against a scratch posts directory, then drives
 * /api/mcp with a real MCP client: checks auth, every tool, the on-disk
 * result, and that content is sanitized. It never touches public/posts.
 *
 * Usage: node scripts/mcp-smoke.mjs [--port 8095]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const PORT = Number(argOf("--port", "8095"));
const BASE = `http://127.0.0.1:${PORT}`;
const TOKEN = "test-token-0123456789abcdef";

let failures = 0;
const check = (name, ok, extra = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${name}${extra ? `  ${extra}` : ""}`);
};

// Scratch store, pre-seeded with an empty manifest so we can assert counts.
const postsDir = mkdtempSync(path.join(tmpdir(), "mcp-smoke-"));
mkdirSync(postsDir, { recursive: true });
writeFileSync(path.join(postsDir, "manifest.json"), "[]");

// Title cards are rendered into a scratch images dir, never public/assests.
const imagesDir = mkdtempSync(path.join(tmpdir(), "mcp-smoke-img-"));

// detached puts the server in its own process group, so killing the group
// also stops the vite child that npx spawns (killing npx alone orphans it).
const server = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
  detached: true,
  env: {
    ...process.env,
    MCP_TOKEN: TOKEN,
    SESSION_SECRET: "smoke-secret",
    ADMIN_PASSWORD: "smoke-pass",
    POSTS_DIR: postsDir,
    IMAGES_DIR: imagesDir,
    DEV_HOST: "127.0.0.1",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", d => { serverLog += d; });
server.stderr.on("data", d => { serverLog += d; });

async function waitForServer(timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE + "/");
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

function connect(token) {
  const transport = new StreamableHTTPClientTransport(new URL(`${BASE}/api/mcp`), {
    requestInit: token === null ? {} : { headers: { Authorization: `Bearer ${token}` } },
  });
  return { transport, client: new Client({ name: "mcp-smoke", version: "0.0.0" }) };
}

async function main() {
  if (!await waitForServer()) {
    console.error("✗ app server did not start\n" + serverLog.slice(-2000));
    process.exit(1);
  }

  // Auth is the gate on everything else, so check it first.
  for (const [label, token] of [["no token", null], ["wrong token", "nope"]]) {
    const { client, transport } = connect(token);
    try {
      await client.connect(transport);
      check(`rejects ${label}`, false, "connected!");
      await client.close();
    } catch {
      check(`rejects ${label}`, true);
    }
  }

  const { client, transport } = connect(TOKEN);
  await client.connect(transport);

  const { tools } = await client.listTools();
  const names = tools.map(t => t.name).sort();
  check("exposes the 6 post tools",
    names.join(",") === "create_post,create_title_image,delete_post,get_post,list_posts,update_post",
    names.join(", "));

  // The title-card recipe ships as a resource and a prompt, so a client can read
  // the same instructions the human method documents.
  const { resources } = await client.listResources();
  check("exposes the title-image guide resource",
    resources.some(r => r.uri === "minescout-life://guides/how-to-make-a-title"),
    resources.map(r => r.uri).join(", "));

  const guide = await client.readResource({ uri: "minescout-life://guides/how-to-make-a-title" });
  check("the guide explains the method",
    guide.contents[0].text.includes("headless browser") &&
    guide.contents[0].text.includes("assests"));

  const { prompts } = await client.listPrompts();
  check("exposes the make_title_image prompt",
    prompts.some(p => p.name === "make_title_image"),
    prompts.map(p => p.name).join(", "));

  check("list_posts starts empty",
    (await client.callTool({ name: "list_posts", arguments: {} })).content[0].text.includes("No posts"));

  // Markdown in, HTML out.
  const created = await client.callTool({
    name: "create_post",
    arguments: {
      title: "Smoke Test Post",
      summary: "Written by the MCP smoke test.",
      content: "## Heading\n\nBody with **bold** text.",
    },
  });
  check("create_post succeeds", !created.isError, created.content[0].text.split("\n")[0]);
  const id = (created.content[0].text.match(/id: ([a-z0-9-]+)/) || [])[1];
  check("derives a slug id", id === "smoke-test-post", String(id));

  const file = path.join(postsDir, `${id}.json`);
  check("writes the post file", existsSync(file));
  const post = JSON.parse(readFileSync(file, "utf8"));
  check("renders Markdown to HTML", post.content.includes("<h2>") && post.content.includes("<strong>"));
  check("sets linkUrl", post.linkUrl === `/post/${id}`);

  const manifest = JSON.parse(readFileSync(path.join(postsDir, "manifest.json"), "utf8"));
  check("updates the manifest", manifest.length === 1 && manifest[0].id === id);

  const dup = await client.callTool({
    name: "create_post",
    arguments: { title: "Smoke Test Post", summary: "dup", content: "x" },
  });
  check("refuses a duplicate id", dup.isError === true);

  check("get_post returns the post",
    JSON.parse((await client.callTool({ name: "get_post", arguments: { id } })).content[0].text).title === "Smoke Test Post");

  // A partial update must not wipe the fields it omits.
  await client.callTool({ name: "update_post", arguments: { id, summary: "Only the summary changed." } });
  const updated = JSON.parse(readFileSync(file, "utf8"));
  check("update_post changes only what was passed",
    updated.summary === "Only the summary changed." &&
    updated.title === "Smoke Test Post" &&
    updated.content.includes("<h2>"));

  const xss = await client.callTool({
    name: "create_post",
    arguments: {
      title: "Sanitize Check",
      summary: "x",
      content: '<p>ok</p><script>alert(1)</script><img src=x onerror="alert(2)">',
    },
  });
  const xssId = (xss.content[0].text.match(/id: ([a-z0-9-]+)/) || [])[1];
  const xssPost = JSON.parse(readFileSync(path.join(postsDir, `${xssId}.json`), "utf8"));
  check("strips scripts and event handlers",
    !xssPost.content.includes("<script") && !/onerror/i.test(xssPost.content));

  check("rejects an invalid id",
    (await client.callTool({ name: "get_post", arguments: { id: "Not Valid!" } })).isError === true);

  // ── title image ───────────────────────────────────────────────────────────
  // A real render: chromium is expected to be present in CI (playwright
  // install) and locally. Skip with a clear message rather than a false fail.
  const titleImg = await client.callTool({
    name: "create_title_image",
    arguments: {
      title: "Argon and Carbon",
      accentWord: "Carbon",
      subtitle: "The periodic table inside Gemini 4",
      category: "Tech",
      date: "November 2026",
      models: [
        { name: "Gemini 4 Argon", meta: "1M tokens", color: "accent" },
        { name: "Gemini 4 Carbon", meta: "AA 59", color: "blue" },
      ],
    },
  });
  const imgText = titleImg.content[0].text;
  if (/Playwright is not installed|Could not create the title image/.test(imgText) && !existsSync("/usr/bin/chromium")) {
    check("create_title_image renders a card", true, "skipped — no chromium in this environment");
  } else {
    check("create_title_image renders a card", !titleImg.isError, imgText.split("\n")[0]);
    const rel = (imgText.match(/Hero image path: (\S+)/) || [])[1];
    check("returns an /assests path", !!rel && rel.startsWith("/assests/images/"), String(rel));
    const abs = rel ? path.join(imagesDir, rel.replace(/^\/assests\/images\//, "")) : "";
    check("writes the PNG", !!abs && existsSync(abs));
    check("writes the source HTML beside it", !!abs && existsSync(abs.replace(/\.png$/, ".html")));
    check("keeps the PNG non-trivial", !!abs && existsSync(abs) && readFileSync(abs).length > 5000);
    check("warns when the fonts did not load", /Fonts \(Lora, Inter\) loaded|fonts did not load/.test(imgText));
  }

  // create_post can render the card in the same call and set it as the hero.
  const withImage = await client.callTool({
    name: "create_post",
    arguments: {
      title: "Post With A Rendered Card",
      summary: "Exercises the titleImage option.",
      content: "Body.",
      titleImage: { title: "Post With A Card", subtitle: "And a subtitle", category: "Tech" },
    },
  });
  check("create_post accepts titleImage", !withImage.isError, withImage.content[0].text.split("\n")[0]);
  if (!withImage.isError) {
    const imgId = (withImage.content[0].text.match(/id: ([a-z0-9-]+)/) || [])[1];
    const stored = JSON.parse(readFileSync(path.join(postsDir, `${imgId}.json`), "utf8"));
    check("titleImage becomes the heroImage",
      typeof stored.heroImage === "string" && stored.heroImage.startsWith("/assests/images/"),
      String(stored.heroImage));
    await client.callTool({ name: "delete_post", arguments: { id: imgId } });
  }

  await client.callTool({ name: "delete_post", arguments: { id } });
  check("delete_post removes the file", !existsSync(file));
  check("delete_post cleans the manifest",
    JSON.parse(readFileSync(path.join(postsDir, "manifest.json"), "utf8")).length === 1);

  await client.close();
}

try {
  await main();
} catch (e) {
  console.error("✗ " + (e && e.message ? e.message : e));
  failures++;
} finally {
  try { process.kill(-server.pid, "SIGTERM"); }
  catch { server.kill("SIGTERM"); }
  rmSync(postsDir, { recursive: true, force: true });
  rmSync(imagesDir, { recursive: true, force: true });
}

console.log(failures === 0 ? "\n✓ MCP smoke passed" : `\n✗ MCP smoke failed: ${failures} problem(s)`);
process.exit(failures === 0 ? 0 : 1);
