#!/usr/bin/env node
/**
 * Render smoke test.
 *
 * Serves the production build and asserts that every key route paints real
 * content into #root with a clean console. This is the guard that a blank
 * white screen can never ship again: it fails if #root is empty, if the boot
 * fallback panel appears, or if any uncaught error reaches the browser.
 *
 * Usage: node scripts/smoke.mjs [--port 8090] [--dist dist]
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const PORT = Number(argOf("--port", "8090"));
const DIST = path.resolve(argOf("--dist", "dist"));
const BASE = `http://127.0.0.1:${PORT}`;

if (!existsSync(path.join(DIST, "index.html"))) {
  console.error(`✗ No build found at ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

// Build the route list: fixed pages plus a real post pulled from the manifest.
function routes() {
  // The unknown id must degrade to "Post not found." — a 200 SPA fallback that
  // is not JSON once made res.json() reject and left the page on "Loading…".
      const fixed = ["/", "/about", "/pages/tech-tips", "/pages/coding-projects", "/pages/updates", "/pages/ai-posts", "/post/this-post-does-not-exist"];
  try {
    const manifest = JSON.parse(readFileSync(path.join(DIST, "posts/manifest.json"), "utf8"));
    const ids = (Array.isArray(manifest) ? manifest : []).map(p => p.id).filter(Boolean).slice(0, 2);
    return [...fixed, ...ids.map(id => `/post/${id}`)];
  } catch {
    return fixed;
  }
}

const server = spawn(
  process.execPath,
  [path.resolve("node_modules/vite/bin/vite.js"), "preview", "--port", String(PORT), "--host", "127.0.0.1", "--strictPort"],
  { stdio: "ignore", cwd: process.cwd() }
);

const stopServer = () => { try { server.kill("SIGTERM"); } catch {} };
process.on("exit", stopServer);

async function waitForServer(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE + "/");
      if (res.ok) return true;
    } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  return false;
}

const IGNORABLE = [
  // The API lives in a dev-server-only Vite plugin; `vite preview` has no
  // backend, so /api/* requests fall through to index.html. The route stubs
  // below answer them; anything that still leaks through is noise, not a bug.
  /\/api\//,
  /Failed to load resource.*api/i,
];

const API_STUBS = {
  "/api/me": { ok: false },
  "/api/admin/session": { ok: true, isAdmin: false },
  "/api/sidebar-config": {},
  "/api/comments": [],
  "/api/comments/all": [],
  "/api/ratings": { up: 0, down: 0, userVote: null },
};

const results = [];
let failed = false;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});

async function stubApi(context) {
  await context.route("**/api/**", route => {
    const url = new URL(route.request().url());
    const body = API_STUBS[url.pathname];
    if (body === undefined) return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

try {
  if (!(await waitForServer())) throw new Error(`preview server did not start on ${BASE}`);

  for (const route of routes()) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await stubApi(context);
    const page = await context.newPage();
    const errors = [];

    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });

    let status = 0;
    try {
      const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
      status = resp ? resp.status() : 0;
    } catch (e) {
      errors.push("navigation: " + e.message);
    }

    const rootText = ((await page.locator("#root").innerText().catch(() => "")) || "").trim();
    const bootFailed = await page.locator("#root[data-boot-failed='1']").count();
    const bootPanel = await page.locator("#root .boot-panel").count();
    const relevantErrors = errors.filter(e => !IGNORABLE.some(re => re.test(e)));

    const ok = status === 200 && rootText.length > 0 && bootFailed === 0 && bootPanel === 0 && relevantErrors.length === 0;
    if (!ok) failed = true;
    results.push({ route, ok, status, chars: rootText.length, bootFailed, bootPanel, errors: relevantErrors });

    await context.close();
  }

  // Regression test for the original outage: a bundle that fails to load must
  // render the branded fallback, never a blank white page.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.route("**/assets/*.js", route => route.abort("failed"));
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(5000);
    const fallbackVisible = await page.locator("#root[data-boot-failed='1'] .boot-panel").count();
    const blank = ((await page.locator("#root").innerText().catch(() => "")) || "").trim().length === 0;
    const ok = fallbackVisible > 0 && !blank;
    if (!ok) failed = true;
    results.push({
      route: "[bundle-failure fallback]",
      ok, status: 200, chars: fallbackVisible ? 1 : 0,
      bootFailed: 0, bootPanel: 0,
      errors: ok ? [] : ["broken bundle did not render the boot fallback (blank page)"],
    });
    await context.close();
  }

  // Regression test: a background request rejecting after the app has painted
  // must not tear the rendered page down. The boot guard once fired on any
  // unhandled rejection, replacing a working app with the fallback panel.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await stubApi(context);
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
    const painted = await page.locator("#root").innerHTML().then(h => h.length > 0).catch(() => false);
    await page.evaluate(() => { Promise.reject(new Error("simulated background request failure")); });
    await page.waitForTimeout(1500);
    const stillPainted = await page.locator("#root").innerHTML().then(h => h.length > 0).catch(() => false);
    const panelAfter = await page.locator("#root .boot-panel").count();
    const ok = painted && stillPainted && panelAfter === 0;
    if (!ok) failed = true;
    results.push({
      route: "[stray rejection keeps the app]",
      ok, status: 200, chars: stillPainted ? 1 : 0,
      bootFailed: 0, bootPanel: panelAfter,
      errors: ok ? [] : ["a stray promise rejection replaced the rendered app with the boot fallback"],
    });
    await context.close();
  }
} finally {
  await browser.close();
  stopServer();
}

for (const r of results) {
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.route.padEnd(46)} status=${r.status} chars=${r.chars}`);
  for (const e of r.errors) console.log(`    error: ${e.slice(0, 200)}`);
  if (r.bootFailed) console.log("    error: boot fallback panel rendered (#root[data-boot-failed])");
}

console.log("");
if (failed) {
  console.error(`✗ smoke failed: ${results.filter(r => !r.ok).length}/${results.length} routes`);
  process.exit(1);
}
console.log(`✓ smoke passed: ${results.length}/${results.length} routes rendered with no console errors`);
