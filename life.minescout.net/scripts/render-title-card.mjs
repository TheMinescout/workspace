#!/usr/bin/env node
/**
 * Client-side title-card renderer.
 *
 * The MCP server renders cards with a headless browser, which fails on a host
 * that is missing the browser's system libraries and has no root to install
 * them. This script moves the render to the client (any machine with a working
 * Chromium), then uploads the PNG to the server through the MCP tool
 * `upload_title_image`, so the server still owns storage and the post.
 *
 * It reuses the server's own buildCardHtml, so the card is byte-identical to a
 * server-side render; it never re-implements the design.
 *
 * Usage:
 *   node scripts/render-title-card.mjs --title "Argon and Carbon" \
 *     --accentWord Carbon --subtitle "The periodic table inside Gemini 4" \
 *     --category Tech --date "November 2026" \
 *     --model "Gemini 4 Argon:1M tokens:accent" --model "Gemini 4 Carbon:AA 59:blue"
 *
 * The server is taken from --url/--token, else $MCP_URL/$MCP_TOKEN. Without
 * them the card is only rendered locally (useful for a dry run or when run on
 * the server host itself, where it writes straight into public/assests/images).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { buildCardHtml, CARD_WIDTH, CARD_HEIGHT, imagesDir, folderFor, headlineSize } from "../server/title-image.js";

const args = process.argv.slice(2);
const argOf = (name, fallback = "") => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const allOf = name => args.reduce((out, a, i) => (a === name && args[i + 1] ? [...out, args[i + 1]] : out), []);

const title = argOf("--title").trim();
if (!title) {
  console.error('✗ --title is required. See the usage comment at the top of this file.');
  process.exit(2);
}

const scale = Number(argOf("--scale", "1")) === 2 ? 2 : 1;
const card = {
  title,
  accentWord: argOf("--accentWord"),
  subtitle: argOf("--subtitle"),
  category: argOf("--category") || "Tech",
  date: argOf("--date"),
  caption: argOf("--caption"),
  models: allOf("--model").map(spec => {
    const [name, meta = "", color = ""] = String(spec).split(":");
    return { name: name.trim(), meta: meta.trim(), color: color.trim() };
  }).filter(m => m.name),
  headlineSize: Number(argOf("--headlineSize")) || undefined,
};
const folder = argOf("--folder");
const filename = argOf("--filename");
const out = argOf("--out");

const url = argOf("--url", process.env.MCP_URL || "");
const token = argOf("--token", process.env.MCP_TOKEN || "");

// Prefer an explicit CHROMIUM_PATH, then the usual system locations, then
// Playwright's bundled build — same order as the server.
async function launchBrowser() {
  const { chromium } = await import("playwright");
  const candidates = [
    process.env.CHROMIUM_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ].filter(Boolean);
  for (const exe of candidates) {
    if (!fs.existsSync(exe)) continue;
    try { return await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] }); }
    catch { /* try the next candidate */ }
  }
  return chromium.launch({ args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] });
}

const html = buildCardHtml(card);
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
const base = filename.replace(/\.png$/i, "") || `${slug || "title"}-title`;
const localPng = path.resolve(out || path.join("/tmp", `${base}.png`));

let browser;
try {
  browser = await launchBrowser();
  const page = await browser.newPage({
    viewport: { width: CARD_WIDTH, height: CARD_HEIGHT },
    deviceScaleFactor: scale,
  });
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 5000))]));
  const fontsLoaded = await page.evaluate(() =>
    document.fonts.check("700 114px Lora") && document.fonts.check("400 16px Inter"));
  await page.screenshot({ path: localPng, type: "png" });
  console.log(`✓ Rendered ${CARD_WIDTH * scale}x${CARD_HEIGHT * scale} card -> ${localPng}` +
    (fontsLoaded ? "" : "  (WARNING: site fonts did not load)"));
} catch (e) {
  console.error(`✗ Could not render locally: ${e && e.message ? e.message : e}`);
  console.error("  This machine needs a working Chromium (CHROMIUM_PATH, /usr/bin/chromium, or `npx playwright install chromium`).");
  process.exit(1);
} finally {
  if (browser) { try { await browser.close(); } catch { /* already gone */ } }
}

const pngBase64 = fs.readFileSync(localPng).toString("base64");

// Without an endpoint, drop the card straight into the site's images folder.
// That only makes sense when this script runs on the server host itself.
if (!url) {
  const dir = path.join(imagesDir(), folderFor(card.category, folder));
  const dest = path.join(dir, `${base}.png`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, Buffer.from(pngBase64, "base64"));
  fs.writeFileSync(path.join(dir, `${base}.html`), html);
  console.log(`✓ Wrote the card locally (no --url/MCP_URL given) -> ${dest}`);
  console.log(`  Hero image path: /assests/images/${folderFor(card.category, folder)}/${base}.png`);
  process.exit(0);
}

const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
const { StreamableHTTPClientTransport } = await import("@modelcontextprotocol/sdk/client/streamableHttp.js");

const transport = new StreamableHTTPClientTransport(new URL(url), {
  requestInit: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});
const client = new Client({ name: "render-title-card", version: "1.0.0" });

try {
  await client.connect(transport);
  const res = await client.callTool({
    name: "upload_title_image",
    arguments: {
      ...card,
      folder: folder || undefined,
      filename: filename || undefined,
      headlineSize: card.headlineSize,
      pngBase64,
    },
  });
  const text = res.content[0].text;
  if (res.isError) {
    console.error(`✗ Upload failed: ${text}`);
    process.exit(1);
  }
  console.log(text);
  console.log(`  (headline sized at ${headlineSize(card.title, card.headlineSize)}px)`);
} catch (e) {
  console.error(`✗ Could not reach the MCP server at ${url}: ${e && e.message ? e.message : e}`);
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
