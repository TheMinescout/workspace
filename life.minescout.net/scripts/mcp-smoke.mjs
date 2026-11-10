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
  check("exposes the 5 post tools",
    names.join(",") === "create_post,delete_post,get_post,list_posts,update_post",
    names.join(", "));

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
}

console.log(failures === 0 ? "\n✓ MCP smoke passed" : `\n✗ MCP smoke failed: ${failures} problem(s)`);
process.exit(failures === 0 ? 0 : 1);
