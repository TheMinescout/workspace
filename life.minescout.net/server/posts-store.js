// Post storage: the single place that normalizes and persists posts.
//
// Both the admin HTTP API (/api/save-post) and the MCP server write through
// here, so an agent-authored post and a hand-authored one are byte-identical
// in shape and go through the same sanitizing.
import fs from "fs";
import path from "path";
import { isPostId, cleanText, isSafeAssetUrl, sanitizeHtml } from "./security.js";

// POSTS_DIR lets tests point at a scratch directory; production uses the
// served public/posts folder.
export function postsDir() {
  return process.env.POSTS_DIR ? path.resolve(process.env.POSTS_DIR) : path.resolve("public/posts");
}

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

export function slugify(title) {
  const slug = String(title || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
  return isPostId(slug) ? slug : "";
}

export function readManifest() {
  const m = readJSON(path.join(postsDir(), "manifest.json"), []);
  return Array.isArray(m) ? m : [];
}

export function readPost(id) {
  if (!isPostId(id)) return null;
  return readJSON(path.join(postsDir(), `${id}.json`), null);
}

// Mirrors the admin editor's field set exactly. `id` is already validated by
// the caller; every other field is cleaned or rejected here.
export function normalizePost(body, id) {
  const b = body && typeof body === "object" ? body : {};
  return {
    id,
    title: cleanText(b.title, 200),
    category: cleanText(b.category, 40) || "Tech",
    summary: cleanText(b.summary, 400),
    heroImage: isSafeAssetUrl(b.heroImage) ? b.heroImage : "",
    content: sanitizeHtml(typeof b.content === "string" ? b.content : ""),
    linkText: cleanText(b.linkText, 60) || "Read Entry",
    linkUrl: `/post/${id}`,
    date: cleanText(b.date, 80),
    timestamp: Number.isFinite(b.timestamp) ? b.timestamp : Date.now(),
    publishDate: typeof b.publishDate === "string" ? cleanText(b.publishDate, 40) || null : null,
    backLabel: cleanText(b.backLabel, 60),
    backHref: isSafeAssetUrl(b.backHref) ? b.backHref : "/",
  };
}

function updateManifest(post, remove) {
  const dir = postsDir();
  const mp = path.join(dir, "manifest.json");
  let manifest = readManifest();
  if (remove) {
    manifest = manifest.filter(p => p.id !== post.id);
  } else {
    const idx = manifest.findIndex(p => p.id === post.id);
    const entry = {
      id: post.id, title: post.title, category: post.category,
      summary: post.summary, heroImage: post.heroImage,
      timestamp: post.timestamp, linkUrl: post.linkUrl || `/post/${post.id}`,
      linkText: post.linkText || "Read Entry", date: post.date,
      publishDate: post.publishDate || null,
    };
    if (idx >= 0) manifest[idx] = entry; else manifest.unshift(entry);
    manifest.sort((a, b) => b.timestamp - a.timestamp);
  }
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2));
}

export function savePost(post) {
  const dir = postsDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${post.id}.json`), JSON.stringify(post, null, 2));
  updateManifest(post, false);
}

export function removePost(id) {
  const dir = postsDir();
  const file = path.join(dir, `${id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  updateManifest({ id }, true);
}

export function postExists(id) {
  return isPostId(id) && fs.existsSync(path.join(postsDir(), `${id}.json`));
}
