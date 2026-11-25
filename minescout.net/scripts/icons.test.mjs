// Guards the icon payload: the site used to ship a 2048x2048, 5.5 MB PNG as
// its favicon (and as a 40px sidebar logo). These tests keep the icons at the
// sizes browsers ask for and stop a full-resolution photo creeping back in.
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { test } from "node:test";

import { decodePng, encodePng, pngSize, resize } from "./seo/png.mjs";

const asset = (name) => new URL(`../public/assets/${name}`, import.meta.url);
const read = (name) => readFileSync(asset(name));
const sizeOf = (name) => pngSize(read(name));

test("the favicon is a small, square PNG", () => {
  const { width, height } = sizeOf("favicon.png");
  assert.equal(width, height, "the favicon must be square");
  assert.ok(width <= 512, `favicon.png is ${width}px; keep it at 512 or below`);
  const bytes = statSync(asset("favicon.png")).size;
  assert.ok(bytes < 300 * 1024, `favicon.png is ${(bytes / 1024).toFixed(0)} KB; keep it under 300 KB`);
});

test("the generated icon sizes match what browsers request", () => {
  assert.deepEqual(sizeOf("favicon-32.png"), { width: 32, height: 32 });
  assert.deepEqual(sizeOf("favicon-64.png"), { width: 64, height: 64 });
  assert.deepEqual(sizeOf("apple-touch-icon.png"), { width: 180, height: 180 });
  assert.deepEqual(sizeOf("favicon-180.png"), { width: 180, height: 180 });
});

test("the share card is 1200x630 and reasonably small", () => {
  assert.deepEqual(sizeOf("og-image.png"), { width: 1200, height: 630 });
  const bytes = statSync(asset("og-image.png")).size;
  assert.ok(bytes < 400 * 1024, `og-image.png is ${(bytes / 1024).toFixed(0)} KB`);
});

test("favicon.ico is a valid icon container", () => {
  const ico = read("favicon.ico");
  assert.equal(ico.readUInt16LE(0), 0, "reserved field");
  assert.equal(ico.readUInt16LE(2), 1, "type must be 1 (icon)");
  assert.ok(ico.readUInt16LE(4) >= 1, "the icon must hold at least one image");
  const png = ico.subarray(ico.readUInt32LE(6 + 12), ico.readUInt32LE(6 + 12) + 8);
  assert.deepEqual([...png], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], "ICO payload must be a PNG");
});

test("pages point at the small icons, not the master", () => {
  for (const file of ["../public/index.html", "../public/404.html"]) {
    const html = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(html, /favicon-32\.png/, `${file} does not use the 32px icon`);
    assert.ok(!/rel="icon"[^>]*favicon\.png/.test(html), `${file} still uses the 512px master as a favicon`);
  }
});

test("the sidebar logo is not the 512px master", () => {
  // It renders at 32px; serving the master cost every page load ~235 KB.
  for (const file of ["../public/app.js", "../public/404.html"]) {
    const html = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.ok(!html.includes('class="sidebar-logo"') || !/sidebar-logo[^>]*favicon\.png/.test(html), `${file} still loads the master as the logo`);
    assert.match(html, /srcset="\/assets\/favicon-32\.png 32w, \/assets\/favicon-64\.png 64w"/, `${file} needs a small logo srcset`);
  }
});

test("regenerating the master from itself is a no-op", () => {
  const png = read("favicon.png");
  const decoded = decodePng(png);
  const again = encodePng(resize(decoded, decoded.width, decoded.height));
  assert.ok(again.equals(png), "scripts/icons.mjs is not idempotent");
});
