import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";

const HTML = readFileSync(new URL("../public/services/typing/index.html", import.meta.url), "utf8");
const SITEMAP = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const MANIFEST = JSON.parse(readFileSync(new URL("../public/seo/manifest.json", import.meta.url), "utf8"));
const OVERRIDES = JSON.parse(readFileSync(new URL("../seo/overrides.json", import.meta.url), "utf8"));
const META = MANIFEST.pages.find((page) => page.path === "/services/typing");
const APP_SCRIPT = [...HTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1] ?? "";

test("FlowType is a standalone, indexable page with complete metadata", () => {
  assert.match(HTML, /<title>Adaptive Typing Coach \| FlowType by Minescout<\/title>/);
  assert.match(HTML, /<link rel="canonical" href="https:\/\/minescout\.net\/services\/typing">/);
  assert.match(HTML, /<meta name="robots" content="index, follow">/);
  assert.equal((HTML.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(META, "SEO manifest is missing /services/typing");
  assert.equal(META.canonical, "https://minescout.net/services/typing");
  assert.equal(META.indexable, true);
  assert.ok(META.title.length <= 60);
  assert.ok(META.description.length >= 50 && META.description.length <= 160);
  assert.equal(OVERRIDES.pages["/services/typing"].title, META.title);
  assert.equal(OVERRIDES.pages["/services/typing"].description, META.description);
  assert.match(SITEMAP, /<loc>https:\/\/minescout\.net\/services\/typing<\/loc>/);
});

test("the typing engine parses and exposes the expected training features", () => {
  assert.ok(APP_SCRIPT.length > 10000, "the app script looks incomplete");
  assert.doesNotThrow(() => new vm.Script(APP_SCRIPT, { filename: "flowtype-inline.js" }));
  for (const feature of ["detectPatterns", "analyseSession", "aggregateKeys", "aggregatePairs", "renderDrills", "renderHistory"]) {
    assert.ok(APP_SCRIPT.includes(feature), "missing engine feature: " + feature);
  }
  assert.match(APP_SCRIPT, /localStorage\.setItem/);
  assert.match(APP_SCRIPT, /minescout\.flowtype\.v2/);
});

test("practice history is local-only and no typing text is sent to a service", () => {
  assert.match(HTML, /LOCAL-ONLY ANALYSIS/);
  assert.match(HTML, /Your analysis stays in this browser/);
  assert.doesNotMatch(APP_SCRIPT, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
  assert.match(HTML, /id="clear-history"/);
});

test("the practice viewport stays fixed while the passage advances locally", () => {
  assert.match(HTML, /height:7\.6em;min-height:7\.6em;max-height:7\.6em/);
  assert.match(HTML, /height:72px;min-height:72px;max-height:72px;resize:none/);
  assert.match(APP_SCRIPT, /focus\(\{preventScroll:true\}\)/);
  assert.match(APP_SCRIPT, /const start=Math\.max\(0/);
  assert.match(APP_SCRIPT, /state\.text\+=/);
  assert.match(APP_SCRIPT, /challenge="accuracy reset"/);
});

test("each session draws varied passages and avoids recently used source text", () => {
  assert.match(APP_SCRIPT, /PASSAGES\.balanced\.push/);
  assert.match(APP_SCRIPT, /PASSAGES\.punctuation\.push/);
  assert.match(APP_SCRIPT, /PASSAGES\.numbers\.push/);
  assert.match(APP_SCRIPT, /PASSAGE_HISTORY_KEY="minescout\.flowtype\.passages\.v1"/);
  assert.match(APP_SCRIPT, /function shuffle\(items\)/);
  assert.match(APP_SCRIPT, /function loadPassageHistory\(\)/);
  assert.match(APP_SCRIPT, /function rememberPassages\(ids\)/);
  assert.match(APP_SCRIPT, /const available=src\.filter/);
  assert.match(APP_SCRIPT, /while\(base\.length<850\)/);
});
