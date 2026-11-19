import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COLUMNS, feedRows, FEED_URL, isStale, renderFeed, skipped } from "./merchant-feed.mjs";
import { PRODUCTS } from "../src/lib/products.ts";
import { absoluteUrl, productLd } from "../src/lib/seo.ts";

const rows = feedRows();
const header = COLUMNS;

function record(row) {
  return Object.fromEntries(header.map((k, i) => [k, row[i]]));
}

describe("merchant center feed", () => {
  it("is committed and in sync with the product data", () => {
    assert.equal(isStale(), false, "run `npm run feed:merchant` and commit the result");
  });

  it("is served from the canonical origin", () => {
    assert.equal(FEED_URL, "https://chop-lab.com/merchant-center-feed.tsv");
  });

  it("has one row per physical product with a photo", () => {
    const expected = PRODUCTS.filter((p) => !p.digital && p.image).map((p) => p.slug);
    assert.deepEqual(
      rows.map((r) => r[0]),
      expected,
    );
    assert.ok(rows.length > 0);
  });

  it("excludes digital downloads and products without a photo", () => {
    const skippedSlugs = skipped().map((s) => s.slug);
    assert.deepEqual(skippedSlugs.sort(), ["slab-rails", "sponge-basket", "stl-dual-bevel", "stl-slab-rails", "stl-sponge-basket"].sort());
    for (const row of rows) assert.ok(!skippedSlugs.includes(row[0]));
  });

  it("fills every required attribute", () => {
    for (const row of rows) {
      const r = record(row);
      for (const key of [
        "id",
        "title",
        "description",
        "link",
        "image_link",
        "availability",
        "price",
        "brand",
        "condition",
        "google_product_category",
      ]) {
        assert.ok(r[key] && r[key].length > 0, `${r.id || row[0]} missing ${key}`);
      }
      assert.equal(r.availability, "in_stock");
      assert.equal(r.condition, "new");
      assert.equal(r.brand, "The Chop Lab");
      assert.match(r.price, /^\d+\.\d{2} USD$/);
    }
  });

  it("links to the live product page and the published photo", () => {
    for (const row of rows) {
      const r = record(row);
      const product = PRODUCTS.find((p) => p.slug === r.id);
      assert.equal(r.link, absoluteUrl(`/tools/${r.id}`));
      assert.equal(r.image_link, absoluteUrl(product.image));
      assert.ok(r.image_link.startsWith("https://chop-lab.com/images/"));
      assert.ok(r.image_link.endsWith(".jpg"));
      assert.equal(r.title, product.headline);
      assert.equal(r.description, product.longDescription);
    }
  });

  it("advertises the same starting price as the Product schema, in whole cents", () => {
    for (const row of rows) {
      const r = record(row);
      const product = PRODUCTS.find((p) => p.slug === r.id);
      const ld = productLd(product);
      assert.equal(r.price, `${product.basePrice.toFixed(2)} USD`);
      assert.equal(Number.parseFloat(r.price), ld.offers.price);
    }
  });

  it("emits tab-separated rows with a header and no stray tabs or newlines", () => {
    const text = renderFeed();
    const lines = text.trimEnd().split("\n");
    assert.equal(lines[0], COLUMNS.join("\t"));
    assert.equal(lines.length, rows.length + 1);
    for (const line of lines) {
      assert.equal(line.split("\t").length, COLUMNS.length, line.slice(0, 60));
    }
    assert.ok(!/[\r]/.test(text));
  });

  it("gives every product a distinct id and title", () => {
    const ids = rows.map((r) => r[0]);
    const titles = rows.map((r) => r[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(titles).size, titles.length);
  });
});
