// Keeps the blog-post block of public/sitemap.xml in step with the release
// state. A post is a real page only from its release date, so a scheduled post
// must not be advertised: a crawler that follows the URL before then gets a
// 404. Everything outside the blog block (core, Studio and service pages) is
// left byte-for-byte untouched.
const BLOG_MARKER = "<!-- Blog Posts -->";

function blogEntries(manifest) {
  return manifest.pages
    .filter((page) => page.kind === "blog-post" && page.indexable && page.released)
    .map((page) => ({ url: page.url, lastmod: page.jsonLd?.datePublished ?? null }))
    .filter((entry) => entry.lastmod)
    .sort((a, b) => (a.lastmod === b.lastmod ? a.url.localeCompare(b.url) : a.lastmod < b.lastmod ? 1 : -1));
}

/**
 * Rebuild sitemap.xml from the manifest's release state.
 *
 * Released blog posts are added (newest first), scheduled ones are removed, and
 * the hand-written non-blog entries are preserved exactly as they are.
 */
export function renderSitemap({ sitemapXml, manifest }) {
  const markerAt = sitemapXml.indexOf(BLOG_MARKER);
  const prefix = markerAt === -1 ? sitemapXml.replace(/\s*<\/urlset>\s*$/, "") : sitemapXml.slice(0, markerAt + BLOG_MARKER.length);
  const marker = markerAt === -1 ? `\n\n  ${BLOG_MARKER}` : "";

  const entries = blogEntries(manifest)
    .map(
      (entry) =>
        `\n  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    )
    .join("");

  return `${prefix}${marker}${entries}\n</urlset>\n`;
}
