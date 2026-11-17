// Post scheduling, shared by the browser app (src/data/posts.js) and the MCP
// server (server/mcp.js). Deliberately dependency-free — no Vite or DOM — so
// both runtimes can import it unchanged and the "is this post live?" answer
// never drifts between the site and the tools that write to it.

// The `date` field is the human-readable show date. Accept every shape a post
// might carry — "November 14, 2026", "Aug. 11, 2026", "14 November 2026",
// "2026-11-14", "11/14/2026" — so a future date always schedules the post no
// matter how it was written. A format we cannot read returns null, which then
// imposes no constraint (see publishTime).
const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

function monthIndex(name) {
  return MONTHS.indexOf(String(name || "").slice(0, 3).toLowerCase());
}

// Local midnight for the parts, or null when they are not a real calendar day.
// The round-trip check rejects overflow like "November 31" or "February 29" in
// a non-leap year, which Date would otherwise roll into the next month.
function atMidnight(year, month, day) {
  if (!Number.isInteger(year) || month < 0 || month > 11 || day < 1 || day > 31) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return d.getTime();
}

export function parseShowDate(value) {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s) return null;

  // Year-first: 2026-11-14, 2026/11/14, 2026.11.14
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(s);
  if (m) return atMidnight(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  // Month-first: "November 14, 2026", "Aug. 11 2026", "Nov 14th, 2026"
  m = /^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(s);
  if (m) return atMidnight(Number(m[3]), monthIndex(m[1]), Number(m[2]));

  // Day-first: "14 November 2026", "14th Nov, 2026"
  m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/.exec(s);
  if (m) return atMidnight(Number(m[3]), monthIndex(m[2]), Number(m[1]));

  // Numeric dates: 11/14/2026 or 11-14-2026. Prefer month-first (US), but fall
  // back to day-first when the first number cannot be a month ("25/12/2026").
  m = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(s);
  if (m) {
    const a = Number(m[1]), b = Number(m[2]), year = Number(m[3]);
    if (a >= 1 && a <= 12) return atMidnight(year, a - 1, b);
    if (b >= 1 && b <= 12) return atMidnight(year, b - 1, a);
    return null;
  }

  return null;
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
