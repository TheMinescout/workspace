// Post scheduling, shared by the browser app (src/data/posts.js) and the MCP
// server (server/mcp.js). Deliberately dependency-free — no Vite or DOM — so
// both runtimes can import it unchanged and the "is this post live?" answer
// never drifts between the site and the tools that write to it.

// The `date` field is the human-readable show date ("November 14, 2026",
// "Aug. 11, 2026"). Parse it to local midnight so a future show date can
// schedule the post. Returns null for free-text/unparseable values, which then
// impose no constraint.
const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
export function parseShowDate(value) {
  if (typeof value !== "string") return null;
  const m = /^\s*([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\s*$/.exec(value);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
  const day = Number(m[2]);
  const year = Number(m[3]);
  if (month < 0 || day < 1 || day > 31) return null;
  return new Date(year, month, day).getTime();
}

// The instant a post goes live: the later of its scheduled `publishDate` (an
// ISO datetime) and its show `date`. Either may be absent or unparseable, in
// which case it imposes no constraint; a post with neither is always live.
export function publishTime(post) {
  if (!post) return 0;
  const times = [];
  if (typeof post.publishDate === "string" && post.publishDate) {
    const at = new Date(post.publishDate).getTime();
    if (!Number.isNaN(at)) times.push(at);
  }
  const show = parseShowDate(post.date);
  if (show !== null) times.push(show);
  return times.length ? Math.max(...times) : 0;
}

export function isPublished(post, now = Date.now()) {
  return publishTime(post) <= now;
}

export function isScheduled(post, now = Date.now()) {
  return publishTime(post) > now;
}
