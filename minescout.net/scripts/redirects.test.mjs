// The legacy /ai/ redirect map lives in seo/legacy-redirects.json and is served
// by the minescout.net block in my-sites.conf. These tests keep the two in step
// and check the things a redirect map gets wrong: chains, loops, and targets
// that are not pages this repository serves.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { discoverPages } from "./seo/discover.mjs";

const MAP = JSON.parse(readFileSync(new URL("../seo/legacy-redirects.json", import.meta.url), "utf8")).redirects;
const NGINX = readFileSync(new URL("../../my-sites.conf", import.meta.url), "utf8");
const pages = await discoverPages();
const routes = new Set(pages.map((page) => page.path));

/** The minescout.net server block only: other vhosts have their own redirects. */
function siteBlock() {
  const start = NGINX.indexOf("server_name minescout.net www.minescout.net;");
  assert.ok(start > -1, "my-sites.conf has no minescout.net server block");
  const next = NGINX.indexOf("server {", start);
  return NGINX.slice(start, next === -1 ? undefined : next);
}

const BLOCK = siteBlock();

test("every mapped legacy URL is served as a permanent single-hop redirect", () => {
  for (const [from, to] of Object.entries(MAP)) {
    const rule = new RegExp(`location = ${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{\\s*return 301 ${to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")};\\s*\\}`);
    assert.match(BLOCK, rule, `my-sites.conf has no 301 from ${from} to ${to}`);
  }
});

test("no redirect target is itself a redirect (no chains)", () => {
  for (const [from, to] of Object.entries(MAP)) {
    assert.ok(!(to in MAP), `${from} -> ${to}, but ${to} redirects again`);
    assert.notEqual(from, to, `${from} redirects to itself`);
  }
});

test("every redirect target is a page the site serves", () => {
  for (const [from, to] of Object.entries(MAP)) {
    assert.ok(routes.has(to), `${from} -> ${to}, but ${to} is not a discovered page`);
  }
});

test("no legacy /ai/ URL is also a live page", () => {
  for (const from of Object.keys(MAP)) {
    assert.ok(!routes.has(from), `${from} is redirected but is also a registered page`);
  }
});

test("unmapped /ai/ URLs still leave the legacy prefix", () => {
  assert.match(BLOCK, /location ~ \^\/ai\/ \{\s*return 301 \/studio;/, "my-sites.conf must catch the rest of /ai/");
});

test("the /studio/2026 dead end is redirected instead of 404ing", () => {
  assert.equal(MAP["/studio/2026"], "/studio");
  assert.ok(!routes.has("/studio/2026"), "/studio/2026 must not be a page: the presentation never shipped");
});
