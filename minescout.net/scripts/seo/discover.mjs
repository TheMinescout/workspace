// Page discovery for the SEO tooling.
//
// The site has no build step, so "the repository is the site": routes come from
// `public/views.js`, blog posts from `BLOG_POSTS`/`registerPost`, and standalone
// documents from real `.html` files under `public/`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { headings, parseHead, stripTags, wordCount } from "./html.mjs";

export const SITE_ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const PUBLIC_DIR = join(SITE_ROOT, "public");
export const PRERENDER_MARKER = "seo:prerendered";

/** Directories under public/ that hold assets, not pages. Generated shells are
 * skipped by their marker instead, so real files inside /studio/ and
 * /services/ stay in the inventory. */
const SKIP_DIRS = new Set(["assets", "ads", "seo"]);

let importCounter = 0;

/**
 * Import views.js fresh. The module gates posts on `new Date()` at import time,
 * so a cached module would keep an old view of what is released.
 *
 * With `at`, the clock is pinned for the duration of the import, which is the
 * only way to see a route that is still scheduled (registerPost skips it
 * otherwise). The real clock is restored immediately afterwards.
 */
export async function loadViews({ at = null } = {}) {
  const url = pathToFileURL(join(PUBLIC_DIR, "views.js")).href;
  if (!at) return import(`${url}?v=${importCounter++}`);

  const RealDate = Date;
  const fixed = at.getTime();
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [fixed]));
    }
    static now() {
      return fixed;
    }
  };
  try {
    return await import(`${url}?v=${importCounter++}`);
  } finally {
    globalThis.Date = RealDate;
  }
}

/** Release check against a caller-supplied clock, mirroring views.js isReleased. */
export function releasedAt(dateStr, now = new Date()) {
  const release = new Date(dateStr);
  if (Number.isNaN(release.getTime())) return false;
  const day = new Date(release.getFullYear(), release.getMonth(), release.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return day <= today;
}

/** Classify a route by the role it plays, which drives metadata defaults. */
export function classify(path) {
  if (path === "/") return "home";
  if (path === "/blog") return "blog-index";
  if (path.startsWith("/blog/")) return "blog-post";
  if (path === "/studio") return "studio-home";
  if (path === "/studio/pricing") return "studio-pricing";
  if (["/studio/local-web-design", "/studio/custom-storefronts", "/studio/student-nonprofit"].includes(path)) {
    return "studio-service";
  }
  if (["/studio/legal", "/legal"].includes(path)) return "legal";
  if (["/studio/intake", "/studio/info"].includes(path)) return "studio-form";
  if (["/studio/admin", "/studio/clients/portal"].includes(path)) return "studio-app";
  if (path.startsWith("/studio/")) return "studio-page";
  if (path.startsWith("/services/")) return "service-demo";
  return "page";
}

function walkHtml(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walkHtml(full, found);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

/** URL a static file is served at, e.g. services/lawn-care/index.html -> /services/lawn-care */
function urlForFile(file) {
  const rel = relative(PUBLIC_DIR, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404";
  return `/${rel.replace(/(^|\/)index\.html$/, "$1").replace(/\/$/, "")}`;
}

function staticPages() {
  const pages = [];
  for (const file of walkHtml(PUBLIC_DIR)) {
    const html = readFileSync(file, "utf8");
    if (html.includes(PRERENDER_MARKER)) continue;
    const path = urlForFile(file);
    if (path === "/") continue;
    pages.push({
      path,
      kind: classify(path),
      source: "static-html",
      sourceFile: relative(SITE_ROOT, file).split(sep).join("/"),
      html,
      head: parseHead(html),
      headings: headings(html),
      text: stripTags(html),
    });
  }
  return pages.sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * Discover every page the site can serve.
 *
 * Returns one record per route with its kind, source, rendered HTML, headings
 * and visible text, so metadata can be derived from the real page content.
 * views.js is imported with the clock pinned far ahead so scheduled posts are
 * discovered too; `released` is then computed against the real clock.
 */
export async function discoverPages({ now = new Date() } = {}) {
  const { views, BLOG_POSTS } = await loadViews({ at: new Date("2100-01-01T00:00:00Z") });
  const pages = [];

  for (const [path, html] of Object.entries(views)) {
    if (path === "/404" || path === "404") continue;
    const post = path.startsWith("/blog/") ? BLOG_POSTS.find((entry) => entry.href === path) : null;
    const released = post ? releasedAt(post.date, now) : true;
    const broken = typeof html !== "string";
    pages.push({
      path,
      kind: classify(path),
      source: "views.js",
      sourceFile: "public/views.js",
      html: broken ? "" : html,
      post,
      broken,
      released,
      head: null,
      headings: broken ? [] : headings(html),
      text: broken ? "" : stripTags(html),
    });
  }

  pages.push(...staticPages());

  for (const page of pages) {
    page.h1s = page.headings.filter((heading) => heading.level === 1).map((heading) => heading.text);
    page.words = wordCount(page.text);
    if (page.head) page.released = true;
  }

  return pages.sort((a, b) => a.path.localeCompare(b.path));
}

/** URLs listed in public/sitemap.xml, in document order. */
export function readSitemap() {
  const xml = readFileSync(join(PUBLIC_DIR, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

export function readRobots() {
  return readFileSync(join(PUBLIC_DIR, "robots.txt"), "utf8");
}

export function readIndexHtml() {
  return readFileSync(join(PUBLIC_DIR, "index.html"), "utf8");
}

/** True when a path exists on disk as a real file (assets, standalone pages). */
export function fileExists(path) {
  try {
    return statSync(join(PUBLIC_DIR, path.replace(/^\//, ""))).isFile();
  } catch {
    return false;
  }
}
