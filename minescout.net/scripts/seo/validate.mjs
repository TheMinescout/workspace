// Validation rules for the metadata manifest. Errors fail CI; warnings are
// reported for a human to judge. Every issue names the URL and the source file
// so a failure points straight at the page that caused it.
import { fileExists } from "./discover.mjs";

const STOPWORDS = new Set([
  "about", "after", "also", "and", "are", "been", "before", "best", "but", "can", "for", "from", "have", "how",
  "into", "its", "more", "not", "our", "out", "over", "should", "than", "that", "the", "their", "them", "then",
  "there", "these", "they", "this", "was", "were", "what", "when", "where", "which", "while", "who", "why",
  "will", "with", "you", "your",
]);

const ROBOTS_PATTERN = /^(index|noindex),\s*(follow|nofollow)(,\s*(max-snippet:\s*-?\d+|max-image-preview:\s*\w+|max-video-preview:\s*-?\d+))*$/;

export function tokens(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !STOPWORDS.has(word)),
  );
}

function overlaps(a, b) {
  for (const word of a) if (b.has(word)) return true;
  return false;
}

function issue(level, page, rule, message) {
  return { level, path: page?.path ?? null, sourceFile: page?.sourceFile ?? null, rule, message };
}

/**
 * Validate a manifest against the pages it describes.
 *
 * @param {object} input
 * @param {object} input.manifest  built manifest
 * @param {Array}  input.pages     discovered pages (content, headings, words)
 * @param {Array}  input.sitemap   URLs listed in sitemap.xml
 * @param {string} input.robots    robots.txt contents
 * @param {Array}  input.buildErrors overrides problems found while building
 */
export function validate({ manifest, pages, sitemap, robots, buildErrors = [] }) {
  const issues = buildErrors.map((message) => issue("error", null, "overrides", message));
  const byPath = new Map(pages.map((page) => [page.path, page]));
  const { origin } = manifest.site;
  const disallowed = [...robots.matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)].map((match) => match[1]);

  for (const page of manifest.pages) {
    const source = byPath.get(page.path);
    const label = page.path;

    if (!page.title || !page.title.trim()) {
      issues.push(issue("error", page, "title-missing", `${label} has no title`));
    } else {
      if (page.title.length > 75) issues.push(issue("error", page, "title-length", `${label} title is ${page.title.length} chars (max 75): "${page.title}"`));
      else if (page.title.length > manifest.site.titleMax) issues.push(issue("warn", page, "title-length", `${label} title is ${page.title.length} chars, above the ${manifest.site.titleMax}-char guideline`));
      if (page.title.length < 15) issues.push(issue("warn", page, "title-length", `${label} title is only ${page.title.length} chars`));
    }

    if (!page.description || !page.description.trim()) {
      issues.push(issue(page.indexable ? "error" : "warn", page, "description-missing", `${label} has no meta description`));
    } else {
      const length = page.description.length;
      if (length > 180) issues.push(issue("error", page, "description-length", `${label} description is ${length} chars (max 180)`));
      else if (length > manifest.site.descriptionMax) issues.push(issue("warn", page, "description-length", `${label} description is ${length} chars, above the ${manifest.site.descriptionMax}-char guideline`));
      if (page.indexable && length < manifest.site.descriptionMin) issues.push(issue("warn", page, "description-length", `${label} description is only ${length} chars`));
      if (length < 20) issues.push(issue("error", page, "description-length", `${label} description is too short to be useful`));
    }

    if (page.title && page.description && page.title.trim() === page.description.trim()) {
      issues.push(issue("error", page, "title-equals-description", `${label} uses its title as the description`));
    }

    if (!page.canonical?.startsWith(`${origin}/`)) {
      issues.push(issue("error", page, "canonical", `${label} canonical "${page.canonical}" is not an absolute ${origin} URL`));
    } else if (/[?#]/.test(page.canonical) || page.canonical.includes("//", 8) || page.canonical.endsWith("/index.html")) {
      issues.push(issue("error", page, "canonical", `${label} canonical "${page.canonical}" has a query, fragment, empty segment or index.html`));
    }
    if (page.canonical !== page.url && page.indexable) {
      issues.push(issue("error", page, "canonical", `${label} canonical points at ${page.canonical} but the page is indexable; a cross-canonical page must be noindex`));
    }

    if (!ROBOTS_PATTERN.test(page.robots)) {
      issues.push(issue("error", page, "robots", `${label} has an invalid robots directive "${page.robots}"`));
    }
    if (page.indexable && page.released && /noindex/.test(page.robots)) {
      issues.push(issue("error", page, "robots", `${label} is marked indexable but its robots directive says noindex`));
    }
    if (!page.indexable && !/noindex/.test(page.robots)) {
      issues.push(issue("error", page, "robots", `${label} is not indexable but its robots directive does not say noindex`));
    }

    for (const rule of disallowed) {
      if (rule === "/") continue;
      if ((page.path === rule || page.path.startsWith(`${rule}/`)) && page.indexable) {
        issues.push(issue("error", page, "robots-txt", `${label} is indexable but robots.txt disallows ${rule}`));
      }
    }

    if (page.ogTitle !== page.title || page.ogDescription !== page.description) {
      issues.push(issue("error", page, "open-graph", `${label} Open Graph title/description drifted from the page metadata`));
    }
    if (page.ogImage?.startsWith(origin)) {
      const localPath = page.ogImage.slice(origin.length);
      if (!fileExists(localPath)) issues.push(issue("error", page, "og-image", `${label} og:image ${page.ogImage} is not in public/`));
    }

    if (!page.released) {
      issues.push(issue("warn", page, "scheduled", `${label} is scheduled and does not render yet`));
    }

    if (source) {
      if (source.broken) {
        issues.push(issue("error", page, "broken-route", `${label} is registered in views.js but has no view body`));
      }
      const h1Count = source.h1s.length;
      if (h1Count === 0 && page.indexable) {
        issues.push(issue("error", page, "h1", `${label} has no H1`));
      } else if (h1Count > 1) {
        issues.push(issue("error", page, "h1", `${label} has ${h1Count} H1 elements: ${source.h1s.join(" | ")}`));
      }

      let previous = 0;
      for (const heading of source.headings) {
        if (previous && heading.level > previous + 1) {
          issues.push(issue("warn", page, "heading-order", `${label} skips from h${previous} to h${heading.level} at "${heading.text.slice(0, 60)}"`));
          break;
        }
        previous = heading.level;
      }

      if (page.indexable && source.words < 120) {
        issues.push(issue("warn", page, "thin-content", `${label} has about ${source.words} words`));
      }

      const bodyTokens = tokens(source.text);
      if (page.title && !overlaps(tokens(page.title), bodyTokens)) {
        issues.push(issue("error", page, "title-mismatch", `${label} title shares no distinctive word with the page content`));
      }
      if (page.description && !overlaps(tokens(page.description), bodyTokens)) {
        issues.push(issue("error", page, "description-mismatch", `${label} description shares no distinctive word with the page content`));
      }
    }
  }

  for (const [field, rule] of [
    ["title", "title-duplicate"],
    ["description", "description-duplicate"],
    ["canonical", "canonical-duplicate"],
  ]) {
    const seen = new Map();
    for (const page of manifest.pages) {
      if (field === "canonical" && !page.indexable) continue;
      const value = page[field];
      if (!value) continue;
      const key = value.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(page);
    }
    for (const [, group] of seen) {
      if (group.length < 2) continue;
      for (const page of group) {
        issues.push(
          issue("error", page, rule, `${page.path} shares its ${field} with ${group.filter((other) => other !== page).map((other) => other.path).join(", ")}`),
        );
      }
    }
  }

  const pagesByUrl = new Map(manifest.pages.map((page) => [page.url, page]));
  const seenInSitemap = new Set();
  for (const loc of sitemap) {
    if (seenInSitemap.has(loc)) {
      issues.push(issue("error", null, "sitemap-duplicate", `sitemap.xml lists ${loc} more than once`));
      continue;
    }
    seenInSitemap.add(loc);
    const page = pagesByUrl.get(loc);
    if (!page) {
      issues.push(issue("error", null, "sitemap-unknown", `sitemap.xml lists ${loc}, which is not a page this repository serves`));
      continue;
    }
    if (!page.indexable) {
      issues.push(issue("error", page, "sitemap-noindex", `sitemap.xml lists ${loc}, but the page is noindex`));
    } else if (!page.released) {
      const release = page.jsonLd?.datePublished ? ` (releases ${page.jsonLd.datePublished})` : "";
      issues.push(
        issue("error", page, "sitemap-scheduled", `sitemap.xml lists ${loc}${release}, before the page exists, so a crawler gets a 404`),
      );
    }
  }

  for (const page of manifest.pages) {
    if (page.indexable && page.released && !seenInSitemap.has(page.url)) {
      issues.push(issue("warn", page, "sitemap-missing", `${page.path} is indexable but not in sitemap.xml`));
    }
  }

  if (!new RegExp(`^\\s*Sitemap:\\s*${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml\\s*$`, "im").test(robots)) {
    issues.push(issue("error", null, "robots-sitemap", `robots.txt does not point at ${origin}/sitemap.xml`));
  }

  return issues;
}

export function summarize(issues) {
  const errors = issues.filter((entry) => entry.level === "error");
  const warnings = issues.filter((entry) => entry.level === "warn");
  return { errors, warnings };
}
