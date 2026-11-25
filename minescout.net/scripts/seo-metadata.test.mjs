// Tests for the automated SEO metadata pipeline (scripts/seo.mjs):
// discovery, generation, overrides, validation, prerendered head tags, and the
// "committed output is current" check that CI runs.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  SITE_ROOT,
  classify,
  discoverPages,
  readIndexHtml,
  readRobots,
  readSitemap,
} from "./seo/discover.mjs";
import { parseHead, stripTags } from "./seo/html.mjs";
import { buildManifest } from "./seo/metadata.mjs";
import { headDrift, planFiles } from "./seo/plan.mjs";
import { renderHead, renderShell, shellPath } from "./seo/prerender.mjs";
import { renderSitemap } from "./seo/sitemap.mjs";
import { summarize, validate } from "./seo/validate.mjs";

const OVERRIDES = JSON.parse(readFileSync(new URL("../seo/overrides.json", import.meta.url), "utf8"));
const MANIFEST = JSON.parse(readFileSync(new URL("../public/seo/manifest.json", import.meta.url), "utf8"));
const SITEMAP = readSitemap();
const ROBOTS = readRobots();
const SHELL = readIndexHtml();

const pages = await discoverPages();
const built = buildManifest({ pages, overrides: OVERRIDES, shellHead: parseHead(SHELL), site: OVERRIDES.site });

function metaFor(path) {
  return MANIFEST.pages.find((page) => page.path === path);
}

function pageFor(path) {
  return pages.find((page) => page.path === path);
}

/** A manifest entry built from a hand-made page, for the derivation tests. */
function manifestFor(page, overrides = {}) {
  return buildManifest({ pages: [page], overrides: { site: OVERRIDES.site, pages: overrides }, shellHead: parseHead(SHELL) });
}

const SYNTHETIC = {
  path: "/studio/new-service",
  kind: "studio-page",
  source: "views.js",
  sourceFile: "public/views.js",
  html: "<h1>Accessible Website Audits</h1><p>I audit small business sites for keyboard access, colour contrast, and screen reader support, then fix what fails.</p>",
  headings: [{ level: 1, text: "Accessible Website Audits" }],
  h1s: ["Accessible Website Audits"],
  text: "Accessible Website Audits I audit small business sites for keyboard access, colour contrast, and screen reader support, then fix what fails.",
  words: 40,
  released: true,
  head: null,
  post: null,
};

test("discovery finds every SPA route plus the standalone documents", () => {
  const routes = new Set(pages.map((page) => page.path));
  for (const path of ["/", "/studio", "/studio/pricing", "/blog", "/work", "/about"]) {
    assert.ok(routes.has(path), `${path} was not discovered`);
  }
  for (const path of ["/services/lawn-care", "/services/coin-data", "/404"]) {
    assert.ok(routes.has(path), `${path} (a real file) was not discovered`);
  }
  assert.ok(!routes.has("404"), "the views.js 404 view is not a page");
  assert.ok(pages.length >= 45, `expected at least 45 pages, found ${pages.length}`);
});

test("scheduled posts are discovered even though they do not render yet", () => {
  const scheduled = pages.filter((page) => page.kind === "blog-post" && !page.released);
  for (const page of scheduled) {
    assert.ok(page.html.length > 0, `${page.path} has no body to derive metadata from`);
    assert.ok(page.h1s.length === 1, `${page.path} should have exactly one H1`);
  }
  // The three posts the Search Console audit found unindexed.
  const audit = [
    "/blog/custom-website-vs-wix-squarespace.html",
    "/blog/sammamish-small-business-website-guide.html",
    "/blog/websites-for-clubs-robotics-nonprofits.html",
  ];
  for (const path of audit) {
    assert.ok(pageFor(path), `${path} is missing from the inventory`);
    assert.ok(metaFor(path), `${path} has no manifest entry`);
  }
});

test("page kinds are classified from the route", () => {
  assert.equal(classify("/"), "home");
  assert.equal(classify("/studio"), "studio-home");
  assert.equal(classify("/studio/pricing"), "studio-pricing");
  assert.equal(classify("/studio/local-web-design"), "studio-service");
  assert.equal(classify("/blog/anything.html"), "blog-post");
  assert.equal(classify("/studio/admin"), "studio-app");
});

test("every indexable page has a unique title and description", () => {
  const indexable = MANIFEST.pages.filter((page) => page.indexable);
  const titles = indexable.map((page) => page.title);
  const descriptions = indexable.map((page) => page.description);
  assert.equal(new Set(titles).size, titles.length, `duplicate titles: ${titles.join(" | ")}`);
  assert.equal(new Set(descriptions).size, descriptions.length, "duplicate descriptions");
  for (const page of indexable) {
    assert.ok(page.title.trim().length > 0, `${page.path} has an empty title`);
    assert.ok(page.description.trim().length > 0, `${page.path} has an empty description`);
  }
});

test("metadata lengths stay inside search-result limits", () => {
  for (const page of MANIFEST.pages) {
    assert.ok(page.title.length <= 75, `${page.path} title is ${page.title.length} chars`);
    assert.ok(page.description.length <= 180, `${page.path} description is ${page.description.length} chars`);
  }
});

test("a page with no override gets metadata derived from its own content", () => {
  const { manifest, errors } = manifestFor(SYNTHETIC);
  const [page] = manifest.pages;
  assert.deepEqual(errors, []);
  assert.equal(page.source, "derived");
  assert.equal(page.title, "Accessible Website Audits | Minescout Studio");
  assert.ok(page.description.startsWith("I audit small business sites"), `unexpected description: ${page.description}`);
  assert.equal(page.canonical, "https://minescout.net/studio/new-service");
  assert.equal(page.robots, "index, follow");
});

test("an override wins over derivation, field by field", () => {
  const { manifest } = manifestFor(SYNTHETIC, {
    "/studio/new-service": { title: "Website Accessibility Audits", indexable: false },
  });
  const [page] = manifest.pages;
  assert.equal(page.title, "Website Accessibility Audits");
  assert.equal(page.source, "override");
  assert.equal(page.indexable, false);
  assert.equal(page.robots, "noindex, follow");
  // The description was not overridden, so it is still derived.
  assert.ok(page.description.startsWith("I audit small business sites"));
});

test("an override for a route that does not exist is an error", () => {
  const { errors } = manifestFor(SYNTHETIC, { "/studio/typo": { title: "x" } });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /does not match any discovered page/);
});

test("unknown override fields are rejected", () => {
  const { errors } = manifestFor(SYNTHETIC, { "/studio/new-service": { tittle: "typo" } });
  assert.match(errors.join(" "), /unknown field "tittle"/);
});

test("validation passes for the real manifest", () => {
  const issues = validate({
    manifest: built.manifest,
    pages,
    sitemap: SITEMAP,
    robots: ROBOTS,
    buildErrors: built.errors,
  });
  const { errors } = summarize(issues);
  assert.deepEqual(errors.map((entry) => `${entry.path}: ${entry.message}`), []);
});

/** Run the validator over a manifest whose entry at `path` has been changed. */
function issuesAfter(path, change) {
  const manifest = {
    ...built.manifest,
    pages: built.manifest.pages.map((page) => (page.path === path ? { ...page, ...change } : page)),
  };
  return summarize(validate({ manifest, pages, sitemap: SITEMAP, robots: ROBOTS })).errors;
}

test("validation catches a missing title", () => {
  const errors = issuesAfter("/studio/pricing", { title: "" });
  assert.ok(errors.some((entry) => entry.rule === "title-missing"), errors.map((entry) => entry.rule).join(","));
});

test("validation catches a duplicate title", () => {
  const other = metaFor("/studio/process");
  const errors = issuesAfter("/studio/pricing", { title: other.title });
  assert.ok(errors.some((entry) => entry.rule === "title-duplicate"));
});

test("validation catches a missing description on an indexable page", () => {
  const errors = issuesAfter("/studio/pricing", { description: "" });
  assert.ok(errors.some((entry) => entry.rule === "description-missing" && entry.level === "error"));
});

test("validation catches a malformed canonical", () => {
  for (const canonical of ["/studio/pricing", "https://minescout.net/studio/pricing?x=1", "https://minescout.net/index.html"]) {
    const errors = issuesAfter("/studio/pricing", { canonical });
    assert.ok(errors.some((entry) => entry.rule === "canonical"), `${canonical} was accepted`);
  }
});

test("validation catches an indexable page that is noindex", () => {
  const errors = issuesAfter("/studio/pricing", { robots: "noindex, follow" });
  assert.ok(errors.some((entry) => entry.rule === "robots"));
});

test("validation catches an invalid robots directive", () => {
  const errors = issuesAfter("/studio/pricing", { robots: "do-not-index" });
  assert.ok(errors.some((entry) => entry.rule === "robots" && /invalid/.test(entry.message)));
});

test("validation catches metadata that does not describe the page", () => {
  const errors = issuesAfter("/studio/pricing", { title: "Zebra Husbandry Quarterly" });
  assert.ok(errors.some((entry) => entry.rule === "title-mismatch"));
});

test("validation catches a sitemap entry for a noindex page", () => {
  const manifest = built.manifest;
  const target = manifest.pages.find((page) => page.path === "/studio/pricing");
  const tampered = {
    ...manifest,
    pages: manifest.pages.map((page) =>
      page.path === target.path ? { ...page, indexable: false, robots: "noindex, follow" } : page,
    ),
  };
  const { errors } = summarize(validate({ manifest: tampered, pages, sitemap: SITEMAP, robots: ROBOTS }));
  assert.ok(errors.some((entry) => entry.rule === "sitemap-noindex"));
});

test("validation catches a page blocked by robots.txt while indexable", () => {
  const errors = issuesAfter("/studio/admin", { indexable: true, robots: "index, follow" });
  assert.ok(errors.some((entry) => entry.rule === "robots-txt"));
});

test("validation catches a page with two H1s", () => {
  const doubled = pages.map((page) =>
    page.path === "/resume" ? { ...page, h1s: ["Thomas Carleton", "Experience"] } : page,
  );
  const { errors } = summarize(validate({ manifest: built.manifest, pages: doubled, sitemap: SITEMAP, robots: ROBOTS }));
  assert.ok(errors.some((entry) => entry.rule === "h1"));
});

test("prerendered head tags carry title, description, canonical, robots and social tags", () => {
  const head = renderHead({ ...metaFor("/studio/pricing"), siteName: "Minescout" });
  assert.match(head, /<title>Website Design Pricing \| Minescout Studio<\/title>/);
  assert.match(head, /<meta name="description" content="[^"]{50,}" \/>/);
  assert.match(head, /<meta name="robots" content="index, follow" \/>/);
  assert.match(head, /<link rel="canonical" href="https:\/\/minescout\.net\/studio\/pricing" \/>/);
  assert.match(head, /<meta property="og:title"/);
  assert.match(head, /<meta property="og:description"/);
  assert.match(head, /<meta property="og:url"/);
  assert.match(head, /<meta name="twitter:card"/);
});

test("prerendering is deterministic and marks its own output", () => {
  const page = metaFor("/studio/local-web-design");
  const once = renderShell(SHELL, { ...page, siteName: "Minescout" });
  const twice = renderShell(SHELL, { ...page, siteName: "Minescout" });
  assert.equal(once, twice);
  assert.match(once, /<!-- seo:prerendered path=\/studio\/local-web-design -->/);
  assert.match(once, /<script type="application\/ld\+json">/);
  // The shell's charset must stay at the top of the document.
  assert.ok(once.indexOf("<meta charset") < once.indexOf("<title>"));
});

test("the committed manifest and prerendered pages are current", () => {
  const files = planFiles({ manifest: built.manifest, shellHtml: SHELL });
  const stale = files.filter((entry) => entry.status !== "unchanged");
  assert.deepEqual(
    stale.map((entry) => `${entry.status}: ${entry.file}`),
    [],
    "run npm run seo:build:write and commit the result",
  );
  assert.equal(JSON.stringify(built.manifest, null, 2) + "\n", readFileSync(new URL("../public/seo/manifest.json", import.meta.url), "utf8"));
});

test("hand-written documents agree with the manifest", () => {
  const drift = headDrift({ manifest: built.manifest, pages, shellHead: parseHead(SHELL) });
  assert.deepEqual(drift, []);
});

test("the served document for every indexable route carries its title", () => {
  for (const page of MANIFEST.pages) {
    if (!page.indexable) continue;
    const file = page.path === "/" ? new URL("../public/index.html", import.meta.url) : shellPath(page.path);
    if (!file) continue;
    let html;
    try {
      html = readFileSync(file, "utf8");
    } catch {
      continue; // scheduled posts are not prerendered yet
    }
    assert.ok(
      html.includes(page.title.replace(/&/g, "&amp;")) || html.includes(page.title),
      `${page.path} does not serve its manifest title`,
    );
    assert.ok(html.includes(page.canonical), `${page.path} does not serve its canonical URL`);
  }
});

test("robots.txt never blocks a page the manifest wants indexed", () => {
  const disallowed = [...ROBOTS.matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)].map((match) => match[1]);
  for (const page of MANIFEST.pages.filter((entry) => entry.indexable && entry.released)) {
    for (const rule of disallowed) {
      assert.ok(!(page.path === rule || page.path.startsWith(`${rule}/`)), `${page.path} is disallowed by robots.txt`);
    }
  }
  assert.match(ROBOTS, /^Sitemap: https:\/\/minescout\.net\/sitemap\.xml$/m);
});

test("every sitemap URL is an indexable page this repository serves", () => {
  const byUrl = new Map(MANIFEST.pages.map((page) => [page.url, page]));
  for (const loc of SITEMAP) {
    const page = byUrl.get(loc);
    assert.ok(page, `${loc} is in sitemap.xml but is not a page`);
    assert.ok(page.indexable, `${loc} is in sitemap.xml but is noindex`);
    assert.ok(page.released, `${loc} is in sitemap.xml before its release date`);
  }
});

test("the sitemap omits posts that have not been released", () => {
  const scheduled = MANIFEST.pages.filter((page) => page.kind === "blog-post" && !page.released);
  assert.ok(scheduled.length > 0, "expected at least one scheduled post to guard the rule");
  for (const page of scheduled) {
    assert.ok(!SITEMAP.includes(`<loc>${page.url}</loc>`), `${page.path} is in sitemap.xml before release`);
  }
});

test("the sitemap generator adds released posts and preserves every other URL", async () => {
  const future = await discoverPages({ now: new Date("2026-12-12T12:00:00Z") });
  const { manifest } = buildManifest({
    pages: future,
    overrides: OVERRIDES,
    shellHead: parseHead(SHELL),
    site: OVERRIDES.site,
  });
  const xml = renderSitemap({ sitemapXml: readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"), manifest });
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  for (const post of [
    "/blog/custom-website-vs-wix-squarespace.html",
    "/blog/sammamish-small-business-website-guide.html",
    "/blog/websites-for-clubs-robotics-nonprofits.html",
  ]) {
    assert.ok(locs.includes(`https://minescout.net${post}`), `${post} was not added once released`);
  }
  for (const loc of SITEMAP) {
    assert.ok(locs.includes(loc), `${loc} was dropped from the sitemap`);
  }
  assert.ok(xml.includes("<!-- Blog Posts -->"), "the blog block marker was lost");
  assert.ok(xml.trimEnd().endsWith("</urlset>"), "the sitemap is not closed");
});

test("validation fails when the sitemap lists an unreleased post", () => {
  const scheduled = built.manifest.pages.find((page) => page.kind === "blog-post" && !page.released);
  assert.ok(scheduled, "expected a scheduled post to test with");
  const { errors } = summarize(
    validate({ manifest: built.manifest, pages, sitemap: [...SITEMAP, scheduled.url], robots: ROBOTS }),
  );
  assert.ok(errors.some((entry) => entry.rule === "sitemap-scheduled"), errors.map((entry) => entry.rule).join(","));
});

test("seo:build is a dry run and seo:build:write is the explicit writer", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.scripts["seo:build"], "node scripts/seo.mjs build");
  assert.equal(pkg.scripts["seo:build:write"], "node scripts/seo.mjs build --write");
});

test("the CLI dry run changes nothing and exits cleanly", () => {
  const before = planFiles({ manifest: built.manifest, shellHtml: SHELL }).map((entry) => entry.status);
  const sitemapFile = new URL("../public/sitemap.xml", import.meta.url);
  const sitemapBefore = readFileSync(sitemapFile, "utf8");
  const output = execFileSync(process.execPath, ["scripts/seo.mjs", "build"], {
    cwd: SITE_ROOT,
    encoding: "utf8",
  });
  assert.match(output, /dry run: run npm run seo:build:write to apply/);
  const after = planFiles({ manifest: built.manifest, shellHtml: SHELL }).map((entry) => entry.status);
  assert.deepEqual(after, before, "a dry run must not touch the working tree");
  assert.equal(readFileSync(sitemapFile, "utf8"), sitemapBefore, "a dry run must not rewrite the sitemap");
});

test("stripTags removes script and style end tags with whitespace", () => {
  const html = [
    "<p>Keep this</p>",
    "<script>drop()</script >",
    "<script type=\"text/javascript\">drop()</script\t\n bar>",
    "<style>.drop { color: red }</style\t>",
  ].join("");
  const text = stripTags(html);
  assert.equal(text, "Keep this");
});

test("the CI check fails when a page is left without metadata", () => {
  // Simulate a new page being added without regenerating: the validator has to
  // reject it, otherwise CI could not catch a deliberate regression.
  const broken = {
    ...built.manifest,
    pages: built.manifest.pages.map((page) =>
      page.path === "/studio/tools" ? { ...page, title: "", description: "" } : page,
    ),
  };
  const { errors } = summarize(validate({ manifest: broken, pages, sitemap: SITEMAP, robots: ROBOTS }));
  assert.ok(errors.some((entry) => entry.path === "/studio/tools"));
});
