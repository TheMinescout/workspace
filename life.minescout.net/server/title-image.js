// Title-image renderer for Minescout Life.
//
// There is no image generator in this environment, so a title card is DESIGNED
// as a web page and photographed with a headless browser. That is deliberate:
// the card reuses the site's real fonts and colors, the text is crisp and
// correctly spelled, and every card is reproducible from source.
//
// The recipe is documented in title-image-guide.js and served over MCP, so an
// agent can produce a card that sits in the same family as the hand-made ones.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { slugify } from "./posts-store.js";
import { cleanText } from "./security.js";

export const CARD_WIDTH = 1600;
export const CARD_HEIGHT = 900;

// Copied from src/index.css so a generated card matches the site. The tool
// takes token names, so an agent never has to invent a hex value.
const COLOR_TOKENS = {
  ink: "#1a1814",
  "ink-2": "#3d3830",
  "ink-3": "#6b6158",
  "ink-4": "#9e9188",
  paper: "#faf8f5",
  "paper-2": "#f2efe9",
  "paper-3": "#e8e4dc",
  rule: "#ddd9d0",
  accent: "#2d6a4f",
  "accent-2": "#40916c",
  "accent-3": "#b7e4c7",
  blue: "#1d4ed8",
  amber: "#d97706",
  red: "#c0392b",
};

// Used for the comparison dots when the caller does not name a colour.
const DOT_COLORS = ["#2d6a4f", "#1d4ed8", "#d97706", "#c0392b"];

// The card used to pull Lora/Inter/JetBrains Mono from Google Fonts with a
// <link>. That made rendering depend on outbound network access: on a host with
// no route to fonts.googleapis.com the stylesheet request hangs, the
// `networkidle` wait never fires, and the whole render times out with an empty
// hero image. The fonts are now bundled under server/fonts and inlined as
// base64 @font-face rules, so a card renders identically with no network at
// all. They are variable fonts (one file covers every weight we use) under the
// SIL Open Font License; see server/fonts/OFL.txt.
const FONT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "fonts");

const FONT_FACES = [
  { family: "Lora", file: "Lora-normal.woff2", weight: "400 700", style: "normal" },
  { family: "Lora", file: "Lora-italic.woff2", weight: "400 700", style: "italic" },
  { family: "Inter", file: "Inter-normal.woff2", weight: "100 900", style: "normal" },
  { family: "JetBrains Mono", file: "JetBrains-Mono-normal.woff2", weight: "400 800", style: "normal" },
];

let cachedFontCss = null;
function fontFaceCss() {
  if (cachedFontCss !== null) return cachedFontCss;
  cachedFontCss = FONT_FACES.flatMap(({ family, file, weight, style }) => {
    let b64;
    try {
      b64 = fs.readFileSync(path.join(FONT_DIR, file)).toString("base64");
    } catch {
      // A missing font must not fail the whole render — fall back to the
      // system font for that face and let `fontsLoaded` report it.
      return [];
    }
    return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
      `font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  }).join("\n");
  return cachedFontCss;
}

// Images live beside the posts under the site's long-standing "assests"
// spelling. IMAGES_DIR lets tests point at a scratch directory.
export function imagesDir() {
  return process.env.IMAGES_DIR
    ? path.resolve(process.env.IMAGES_DIR)
    : path.resolve("public/assests/images");
}

const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]{0,63}$/;

const CATEGORY_FOLDERS = { tech: "tech", updates: "updates", life: "updates", beta: "beta" };

export function folderFor(category, override) {
  const o = String(override || "").trim().toLowerCase();
  if (o && SAFE_SEGMENT.test(o)) return o;
  const c = String(category || "").trim().toLowerCase();
  return CATEGORY_FOLDERS[c] || slugify(c) || "tech";
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function resolveColor(value, fallback) {
  const v = String(value || "").trim().toLowerCase();
  if (COLOR_TOKENS[v]) return COLOR_TOKENS[v];
  return /^#[0-9a-f]{3,8}$/.test(v) ? v : fallback;
}

// A 114px headline fits 1392px of usable width. Longer titles wrap into the
// subtitle, so step the size down rather than shipping a collided card.
export function headlineSize(text, override) {
  const forced = Number(override);
  if (Number.isFinite(forced) && forced >= 40 && forced <= 200) return forced;
  const n = String(text || "").length;
  if (n <= 24) return 114;
  if (n <= 34) return 96;
  if (n <= 44) return 80;
  return 68;
}

function headlineHtml(title, accentWord) {
  const text = String(title || "");
  const word = String(accentWord || "").trim();
  if (!word) return esc(text);
  const idx = text.toLowerCase().indexOf(word.toLowerCase());
  if (idx < 0) return esc(text);
  return esc(text.slice(0, idx)) + "<em>" + esc(text.slice(idx, idx + word.length)) + "</em>" +
    esc(text.slice(idx + word.length));
}

export function buildCardHtml(card) {
  const size = headlineSize(card.title, card.headlineSize);
  const models = Array.isArray(card.models) ? card.models.filter(m => m && m.name).slice(0, 4) : [];
  const modelsHtml = models.map((m, i) => `
      <div class="model">
        <div class="dot" style="background:${resolveColor(m.color, DOT_COLORS[i % DOT_COLORS.length])}"></div>
        <div class="mname">${esc(m.name)}</div>
        <div class="mmeta">${esc(m.meta || "")}</div>
      </div>`).join("");
  const footHtml = models.length
    ? `<div class="models">${modelsHtml}\n    </div>`
    : (card.caption ? `<div class="caption">${esc(card.caption)}</div>` : "");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
${fontFaceCss()}
  :root{
    --ink:#1a1814; --ink-2:#3d3830; --ink-3:#6b6158; --ink-4:#9e9188;
    --paper:#faf8f5; --paper-2:#f2efe9; --paper-3:#e8e4dc; --rule:#ddd9d0;
    --accent:#2d6a4f; --accent-2:#40916c;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${CARD_WIDTH}px;height:${CARD_HEIGHT}px;overflow:hidden}
  body{
    background:var(--paper); color:var(--ink);
    font-family:'Inter',sans-serif; position:relative;
    display:flex; flex-direction:column; justify-content:space-between;
    padding:88px 104px 80px;
  }
  body::before{
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:radial-gradient(rgba(26,24,20,.05) 1px, transparent 1px);
    background-size:24px 24px;
  }
  .topbar{
    position:relative; z-index:2;
    display:flex; justify-content:space-between; align-items:center;
    font-size:16px; font-weight:600; letter-spacing:.22em; text-transform:uppercase;
    color:var(--accent);
  }
  .topbar .date{ color:var(--ink-4); font-weight:500; letter-spacing:.16em; }
  .head{ position:relative; z-index:2; }
  h1{
    font-family:'Lora',serif; font-weight:700;
    font-size:${size}px; line-height:1.02; letter-spacing:-.022em;
  }
  h1 em{ font-style:normal; color:var(--accent); }
  .sub{
    font-family:'Lora',serif; font-style:italic; font-weight:400;
    font-size:56px; color:var(--ink-3); margin-top:16px;
  }
  .foot{ position:relative; z-index:2; }
  .rule{ height:1px; background:var(--rule); }
  .models{ display:flex; align-items:stretch; padding:26px 0 6px; }
  .model{ flex:1; padding-right:26px; }
  .model + .model{ padding-left:26px; border-left:1px solid var(--rule); }
  .dot{ width:13px; height:13px; border-radius:50%; margin-bottom:14px; }
  .mname{ font-size:25px; font-weight:600; letter-spacing:-.01em; line-height:1.2; }
  .mmeta{ font-family:'JetBrains Mono',monospace; font-size:16px; color:var(--ink-4); margin-top:7px; }
  .caption{
    padding-top:22px; font-size:15px; font-weight:600; letter-spacing:.2em;
    text-transform:uppercase; color:var(--ink-4);
  }
</style></head>
<body>

  <div class="topbar">
    <span>Minescout &nbsp;&middot;&nbsp; ${esc(card.category || "Tech")}</span>
    <span class="date">${esc(card.date || "")}</span>
  </div>

  <div class="head">
    <h1>${headlineHtml(card.title, card.accentWord)}</h1>
${card.subtitle ? `    <div class="sub">${esc(card.subtitle)}</div>\n` : ""}  </div>

  <div class="foot">
    <div class="rule"></div>
    ${footHtml}
  </div>

</body></html>`;
}

const LAUNCH_ARGS = ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb"];

// Prefer an explicit CHROMIUM_PATH, then the usual system locations, then
// Playwright's bundled build.
async function launchBrowser() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  }
  const candidates = [
    process.env.CHROMIUM_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ].filter(Boolean);
  for (const exe of candidates) {
    if (!fs.existsSync(exe)) continue;
    try { return await chromium.launch({ executablePath: exe, args: LAUNCH_ARGS }); }
    catch { /* fall through to the next candidate */ }
  }
  return chromium.launch({ args: LAUNCH_ARGS });
}

export async function renderTitleCard(opts = {}) {
  const title = cleanText(opts.title, 160).trim();
  if (!title) return { ok: false, error: "A title is required." };

  const folder = folderFor(opts.category, opts.folder);
  const requested = slugify(String(opts.filename || "").replace(/\.png$/i, ""));
  const base = requested || `${slugify(title) || "title"}-title`;
  if (!SAFE_SEGMENT.test(base)) return { ok: false, error: `Unsafe file name: "${base}".` };

  const root = imagesDir();
  const dir = path.join(root, folder);
  const png = path.join(dir, `${base}.png`);
  const htmlFile = path.join(dir, `${base}.html`);
  if (!png.startsWith(root + path.sep)) {
    return { ok: false, error: "Refusing to write outside the images directory." };
  }

  const scale = Number(opts.scale) === 2 ? 2 : 1;
  const card = {
    title,
    accentWord: cleanText(opts.accentWord, 40).trim(),
    subtitle: cleanText(opts.subtitle, 160).trim(),
    category: cleanText(opts.category, 40).trim() || "Tech",
    date: cleanText(opts.date, 60).trim(),
    caption: cleanText(opts.caption, 120).trim(),
    models: Array.isArray(opts.models) ? opts.models.map(m => ({
      name: cleanText(m && m.name, 60).trim(),
      meta: cleanText(m && m.meta, 60).trim(),
      color: m && m.color,
    })) : [],
    headlineSize: opts.headlineSize,
  };

  const html = buildCardHtml(card);
  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({
      viewport: { width: CARD_WIDTH, height: CARD_HEIGHT },
      deviceScaleFactor: scale,
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 20000 });
    // Fonts are inlined data URIs, so this resolves almost instantly; the race
    // is a belt-and-braces guard so a stalled font can never hang the render.
    const fontsLoaded = await page.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 5000)),
      ]);
      return document.fonts.check("700 114px Lora") && document.fonts.check("400 16px Inter");
    });
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: png, type: "png" });
    fs.writeFileSync(htmlFile, html);
    const bytes = fs.statSync(png).size;
    await context.close();
    return {
      ok: true,
      path: `/assests/images/${folder}/${base}.png`,
      file: png,
      htmlFile,
      width: CARD_WIDTH * scale,
      height: CARD_HEIGHT * scale,
      bytes,
      fontsLoaded,
      headlineSize: headlineSize(title, opts.headlineSize),
    };
  } catch (e) {
    return { ok: false, error: e && e.message ? e.message : String(e) };
  } finally {
    if (browser) { try { await browser.close(); } catch { /* already gone */ } }
  }
}
