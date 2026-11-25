import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { SITE_META, views } from "../public/views.js";

const SITEMAP = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const MANIFEST = JSON.parse(readFileSync(new URL("../public/seo/manifest.json", import.meta.url), "utf8"));

/** The generated metadata entry for a route (public/seo/manifest.json). */
function metaFor(path) {
  return MANIFEST.pages.find((page) => page.path === path);
}
const INDEX_HTML = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const APP_JS = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

const PRICING = views["/studio/pricing"];

/** Every dollar amount the pricing page actually charges. */
const PRICING_PRICES = new Set([
  ...[...PRICING.matchAll(/\$([\d,]+)/g)].map((m) => m[1]),
  ...[...PRICING.matchAll(/tier-price">\$<em>([\d,]+)<\/em>/g)].map((m) => m[1]),
]);

const PAGES = [
  {
    route: "/studio/local-web-design",
    h1: "Fast, custom websites for Sammamish and Eastside small businesses.",
    title: "Local Web Design in Sammamish & Bellevue | Minescout Studio",
    ctaLinks: ["/studio/intake", "/studio/pricing"],
    prices: ["750", "1,500", "2,500", "10", "75"],
  },
  {
    route: "/studio/custom-storefronts",
    h1: "Custom e-commerce storefronts built for speed and zero platform bloat.",
    title: "Custom Online Storefronts | Minescout Studio",
    ctaLinks: ["/studio/intake", "/blog/chop-lab-storefront.html"],
    prices: ["2,500", "3,500", "15", "75"],
  },
  {
    route: "/studio/student-nonprofit",
    h1: "Custom websites for student organizations, clubs, and local nonprofits.",
    title: "Websites for Clubs & Nonprofits | Minescout Studio",
    ctaLinks: ["/studio/intake", "/studio/clients"],
    prices: ["250", "750", "10", "15"],
  },
];

function h1Of(html) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return match ? match[1].trim() : null;
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

test("every service page has a registered view with the requested H1", () => {
  for (const page of PAGES) {
    const html = views[page.route];
    assert.ok(html, `${page.route} has no registered view`);
    assert.equal(h1Of(html), page.h1, `${page.route} does not render the requested H1`);
    assert.equal(count(html, /<h1\b/g), 1, `${page.route} should have exactly one H1`);
    assert.ok(html.length > 2000, `${page.route} looks like a stub (${html.length} chars)`);
  }
});

test("each service page has a unique H1", () => {
  const h1s = PAGES.map((page) => h1Of(views[page.route]));
  assert.equal(new Set(h1s).size, h1s.length, `duplicate H1 across service pages: ${h1s.join(" | ")}`);
});

test("each service page renders cleanly", () => {
  for (const page of PAGES) {
    const html = views[page.route];
    assert.ok(!/\bundefined\b/.test(html), `${page.route} leaks "undefined" into the markup`);
    assert.ok(!html.includes("[object Object]"), `${page.route} leaks an object into the markup`);
    assert.ok(!/\bNaN\b/.test(html), `${page.route} leaks NaN into the markup`);
    assert.equal(count(html, /<div\b/g), count(html, /<\/div>/g), `${page.route} has unbalanced <div> tags`);
    assert.equal(count(html, /<a\b/g), count(html, /<\/a>/g), `${page.route} has unbalanced <a> tags`);
    assert.equal(count(html, /<ul\b/g), count(html, /<\/ul>/g), `${page.route} has unbalanced <ul> tags`);
    assert.equal(count(html, /<li\b/g), count(html, /<\/li>/g), `${page.route} has unbalanced <li> tags`);
  }
});

test("service pages link to the requested conversion paths", () => {
  for (const page of PAGES) {
    const html = views[page.route];
    for (const link of page.ctaLinks) {
      assert.ok(html.includes(`href="${link}"`), `${page.route} is missing its CTA to ${link}`);
    }
  }
});

test("every internal link on a service page resolves to a view", () => {
  for (const page of PAGES) {
    const html = views[page.route];
    const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      assert.ok(views[href], `${page.route} links to ${href}, which has no registered view`);
    }
  }
});

test("/studio links to all three service pages", () => {
  const studio = views["/studio"];
  for (const page of PAGES) {
    assert.ok(studio.includes(`href="${page.route}"`), `/studio does not link to ${page.route}`);
  }
});

test("each service page sets a unique keyword-focused title and description", () => {
  const titles = [];
  const descriptions = [];

  for (const page of PAGES) {
    const meta = metaFor(page.route);
    assert.ok(meta, `${page.route} has no entry in the SEO manifest`);
    assert.equal(meta.title, page.title, `${page.route} title does not match the requested keyword title`);
    assert.ok(meta.title.length <= 60, `${page.route} title is too long for a search result (${meta.title.length})`);
    assert.ok(meta.description && meta.description.length >= 50, `${page.route} needs a real meta description`);
    assert.ok(meta.description.length <= 160, `${page.route} meta description is too long for a search result`);
    titles.push(meta.title);
    descriptions.push(meta.description);
  }

  assert.equal(new Set(titles).size, titles.length, "service page titles must be unique");
  assert.equal(new Set(descriptions).size, descriptions.length, "service page descriptions must be unique");
});

test("app.js applies the generated manifest and falls back to SITE_META", () => {
  assert.match(APP_JS, /import\s*\{[^}]*SITE_META[^}]*\}\s*from\s*["']\.\/views\.js/, "app.js must import SITE_META");
  assert.match(APP_JS, /fetch\('\/seo\/manifest\.json'/, "app.js must read the generated manifest");
  assert.match(APP_JS, /applyPageMeta\(finalPath\)/, "app.js never applies page metadata while rendering");
  assert.match(APP_JS, /pageMeta\[path\]/, "app.js must look the route up in the manifest");
  assert.match(APP_JS, /SITE_META\.title/, "app.js must fall back to SITE_META");
  assert.match(APP_JS, /setMetaContent\('og:title'/, "app.js must keep the share-card title in sync");
  assert.match(APP_JS, /setCanonical\(/, "app.js must keep the canonical link in sync");
});

test("SITE_META matches the shell metadata in index.html", () => {
  const title = INDEX_HTML.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = INDEX_HTML.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert.equal(SITE_META.title, title, "SITE_META.title drifted from index.html");
  assert.equal(SITE_META.description, description, "SITE_META.description drifted from index.html");
});

test("cache-busting query strings are present", () => {
  assert.match(INDEX_HTML, /src="\/app\.js\?v=[\w.]+"/, "index.html must cache-bust app.js");
  assert.match(APP_JS, /from\s*["']\.\/views\.js\?v=[\w.]+["']/, "app.js must cache-bust views.js");
});

test("sitemap.xml lists all three service pages exactly once", () => {
  for (const page of PAGES) {
    const loc = `<loc>https://minescout.net${page.route}</loc>`;
    assert.equal(SITEMAP.split(loc).length - 1, 1, `${page.route} must appear exactly once in sitemap.xml`);
  }
});

test("sitemap.xml stays valid XML 1.0", () => {
  assert.match(SITEMAP, /^<\?xml version="1\.0" encoding="UTF-8"\?>/, "sitemap.xml must start with an XML 1.0 declaration");
  assert.match(SITEMAP, /<\/urlset>\s*$/, "sitemap.xml must close the urlset element");
});

test("prices on the service pages stay synced with /studio/pricing", () => {
  for (const page of PAGES) {
    const html = views[page.route];
    const quoted = [...html.matchAll(/\$([\d,]+)/g)].map((m) => m[1]);

    for (const price of quoted) {
      assert.ok(
        PRICING_PRICES.has(price),
        `${page.route} quotes $${price}, which is not on /studio/pricing`,
      );
    }

    for (const price of page.prices) {
      assert.ok(quoted.includes(price), `${page.route} should quote $${price}, a real price on /studio/pricing`);
    }
  }
});
