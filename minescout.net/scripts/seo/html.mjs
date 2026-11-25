// Small HTML helpers shared by the SEO tooling. No parser dependency: the
// inputs are either our own templates or our own generated head tags.
const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "\u2014",
  ndash: "\u2013",
  middot: "\u00b7",
  rarr: "\u2192",
  larr: "\u2190",
  hellip: "\u2026",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
  times: "\u00d7",
  laquo: "\u00ab",
  raquo: "\u00bb",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
};

export function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const named = ENTITIES[body.toLowerCase()];
    return named === undefined ? match : named;
  });
}

/** Visible text of an HTML fragment: tags, scripts and styles removed. */
export function stripTags(html) {
  return decodeEntities(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(text) {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

export function truncate(text, limit) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary > limit * 0.6 ? cut.slice(0, boundary) : cut).replace(/[\s,;:.!?-]+$/, "")}\u2026`;
}

/** Read one attribute from a single tag, tolerating either quote style. */
export function attributeValue(tag, name) {
  const double = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i"));
  if (double) return double[1];
  const single = tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, "i"));
  return single ? single[1] : null;
}

function metaContent(html, attr, key) {
  const pattern = new RegExp(`<meta[^>]*\\b${attr}\\s*=\\s*["']${key}["'][^>]*>`, "i");
  const tag = html.match(pattern)?.[0];
  if (!tag) return null;
  return attributeValue(tag, "content");
}

/** Read the head tags this project owns out of a rendered HTML document. */
export function parseHead(html) {
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1],
  );

  return {
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() ?? null,
    description: metaContent(html, "name", "description"),
    robots: metaContent(html, "name", "robots"),
    ogTitle: metaContent(html, "property", "og:title"),
    ogDescription: metaContent(html, "property", "og:description"),
    ogImage: metaContent(html, "property", "og:image"),
    ogType: metaContent(html, "property", "og:type"),
    ogUrl: metaContent(html, "property", "og:url"),
    twitterCard: metaContent(html, "name", "twitter:card"),
    canonical: canonical ? attributeValue(canonical, "href") : null,
    jsonLd,
  };
}

/** Headings in document order, with their level and visible text. */
export function headings(html) {
  return [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: stripTags(match[2]),
  }));
}

/** First paragraph that carries real prose (skips eyebrow labels and chips). */
export function firstParagraph(html, minLength = 60) {
  for (const match of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(match[1]);
    if (text.length >= minLength) return text;
  }
  return null;
}
