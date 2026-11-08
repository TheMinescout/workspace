// Vite gives us the deploy base ("/" on life.minescout.net, "/workspace/" on
// GitHub Pages). Everything the app fetches or links to must go through here,
// or deep paths break when the site is served from a subdirectory.
export const BASE = import.meta.env.BASE_URL || "/";

// For values that might already be a full URL (hero images come from the post
// JSON, which the admin editor can point anywhere).
export function assetUrl(path) {
  const v = String(path || "");
  if (!v || /^(https?:)?\/\/|^data:/.test(v)) return v;
  return withBase(v);
}

export function withBase(path) {
  const clean = String(path || "").replace(/^\/+/, "");
  return BASE + clean;
}

// Post bodies are authored with root-absolute asset paths (/assests/...,
// /post/...). Rewrite them so they resolve under whatever base we're served
// from. Skipped when BASE is "/" so nothing is needlessly touched.
export function rewriteContentPaths(html) {
  if (!html || BASE === "/") return html;
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${BASE}`);
}
