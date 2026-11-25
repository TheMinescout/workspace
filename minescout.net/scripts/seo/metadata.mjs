// Builds the metadata manifest from discovered pages plus hand-written
// overrides. Every page gets its own title, description, canonical and robots
// directive; a page with no override gets values derived from its own content
// so a newly added route is never left with the site-wide default.
import { firstParagraph, stripTags, truncate } from "./html.mjs";

const CITY_SERVICES = ["Sammamish", "Bellevue", "Redmond", "Issaquah"];

function absolute(origin, path) {
  if (path === "/" || path === "") return `${origin}/`;
  return `${origin}/${path.replace(/^\/+/, "")}`;
}

/** Split a headline into words that fit `room` characters, without a trailing comma. */
function fitWords(text, room) {
  const words = text.split(/\s+/);
  let out = "";
  for (const word of words) {
    const next = out ? `${out} ${word}` : word;
    if (next.length > room) break;
    out = next;
  }
  return (out || words[0]).replace(/[\s,;:.!?\u2014-]+$/, "");
}

function deriveTitle(page, site) {
  const brand = page.kind.startsWith("studio") || page.kind === "legal" ? site.studioName : site.name;
  // A post's headline is the title; shortening it with an ellipsis would ship a
  // worse title than the one the article uses.
  if (page.post) return stripTags(page.post.title);
  const headline = page.h1s[0] ? stripTags(page.h1s[0]).replace(/[.!?]+$/, "") : "";
  if (!headline) {
    const label = page.path.split("/").filter(Boolean).pop() ?? "Home";
    return `${label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | ${brand}`;
  }
  const room = site.titleMax - brand.length - 3;
  const candidate = headline.length <= room ? headline : fitWords(headline, room);
  return `${candidate} | ${brand}`;
}

function deriveDescription(page, site) {
  if (page.post) return truncate(stripTags(page.post.excerpt), site.descriptionMax);
  const paragraph = firstParagraph(page.html ?? "");
  const text = paragraph ?? stripTags(page.text);
  return truncate(text, site.descriptionMax);
}

/** Default indexability: private app screens and 404s are never indexed. */
function defaultIndexable(page) {
  return page.kind !== "studio-app" && page.path !== "/404";
}

function robotsFor(indexable, kind) {
  if (indexable) return "index, follow";
  return kind === "studio-app" || kind === "utility" ? "noindex, nofollow" : "noindex, follow";
}

function jsonLdFor(page, { title, description, url }, site) {
  if (page.kind === "blog-post" && page.post) {
    const date = new Date(page.post.date);
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description,
      datePublished: Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10),
      url,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: site.author, url: absolute(site.origin, "/about") },
      publisher: { "@type": "Organization", name: site.name, url: `${site.origin}/` },
    };
  }

  if (page.kind === "studio-service") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      url,
      areaServed: CITY_SERVICES.map((name) => ({ "@type": "City", name })),
      provider: {
        "@type": "ProfessionalService",
        name: site.studioName,
        url: absolute(site.origin, "/studio"),
        areaServed: CITY_SERVICES.map((name) => ({ "@type": "City", name })),
      },
    };
  }

  if (page.kind === "studio-home") {
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.studioName,
      description,
      url,
      areaServed: CITY_SERVICES.map((name) => ({ "@type": "City", name })),
      founder: { "@type": "Person", name: site.author, url: absolute(site.origin, "/about") },
      parentOrganization: { "@type": "Organization", name: site.name, url: `${site.origin}/` },
    };
  }

  return null;
}

export const SITE_DEFAULTS = {
  name: "Minescout",
  studioName: "Minescout Studio",
  author: "Thomas Carleton",
  origin: "https://minescout.net",
  defaultOgImage: "/assets/og-image.png",
  titleMax: 60,
  descriptionMin: 50,
  descriptionMax: 160,
};

const ALLOWED_OVERRIDE_FIELDS = new Set([
  "title",
  "description",
  "canonical",
  "indexable",
  "kind",
  "ogImage",
  "jsonLd",
  "notes",
]);

/**
 * Merge discovered pages with the overrides file.
 *
 * Overrides win field by field; everything else is derived. `shellHead` is the
 * metadata already published in index.html, which is the source for `/` so the
 * home page's manifest entry can never disagree with the document it lives in.
 */
export function buildManifest({ pages, overrides, shellHead, site = {} }) {
  const config = { ...SITE_DEFAULTS, ...site };
  const overridePages = overrides.pages ?? {};
  const errors = [];

  for (const [path, entry] of Object.entries(overridePages)) {
    if (!pages.some((page) => page.path === path)) {
      errors.push(`override for ${path} does not match any discovered page`);
    }
    for (const field of Object.keys(entry)) {
      if (!ALLOWED_OVERRIDE_FIELDS.has(field)) errors.push(`override for ${path} has unknown field "${field}"`);
    }
  }

  const manifestPages = pages.map((page) => {
    const override = overridePages[page.path] ?? {};
    const kind = override.kind ?? page.kind;
    const indexable = override.indexable ?? defaultIndexable(page);
    const url = absolute(config.origin, page.path);

    // `/` lives in index.html; a standalone page carries its own head tags.
    const shell = page.path === "/" ? shellHead : null;
    const ownHead = page.head ?? null;
    const title = override.title ?? shell?.title ?? ownHead?.title ?? deriveTitle(page, config);
    const description = override.description ?? shell?.description ?? ownHead?.description ?? deriveDescription(page, config);
    const canonical = override.canonical ?? shell?.canonical ?? ownHead?.canonical ?? url;
    const ogImage = override.ogImage
      ? absolute(config.origin, override.ogImage)
      : absolute(config.origin, config.defaultOgImage);

    const entry = {
      path: page.path,
      kind,
      url,
      title,
      description,
      canonical,
      robots: robotsFor(indexable && page.released !== false, kind),
      indexable,
      released: page.released !== false,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: kind === "blog-post" ? "article" : "website",
      source: override.title || override.description ? "override" : shell ? "shell" : ownHead ? "static-html" : "derived",
      sourceFile: page.sourceFile,
      h1: page.h1s?.[0] ?? null,
      words: page.words,
      jsonLd: override.jsonLd ?? jsonLdFor(page, { title, description, url }, config),
    };
    return entry;
  });

  return {
    manifest: {
      version: 1,
      site: config,
      generatedBy: "npm run seo:build:write",
      pages: manifestPages.sort((a, b) => a.path.localeCompare(b.path)),
    },
    errors,
  };
}
