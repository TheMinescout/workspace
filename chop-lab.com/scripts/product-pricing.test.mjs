import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getProduct, quoteFor } from "../src/lib/products.ts";
import { productLd } from "../src/lib/seo.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The published rate card: `$3` base for physical tools, design hours at the
 * product's CAD rate, and print hours at `$2/hr`. Digital STLs are a `$5` base
 * plus `$1/hr` of quoted print time, with no design time at all.
 */
const RATE_CARD = [
  { slug: "custom-3d-print", base: 3, design: 20, designHours: 0, printRate: 2, printHours: 2, quote: 7 },
  { slug: "custom-chop-complex", base: 3, design: 20, designHours: 0.75, printRate: 2, printHours: 0.5, quote: 19 },
  { slug: "custom-chop-simple", base: 3, design: 15, designHours: 0.5, printRate: 2, printHours: 0.5, quote: 11.5 },
  { slug: "texture-roller-10", base: 3, design: 12, designHours: 0, printRate: 2, printHours: 3, quote: 9 },
  { slug: "texture-roller-4", base: 3, design: 12, designHours: 0, printRate: 2, printHours: 3, quote: 9 },
  { slug: "sponge-basket", base: 3, design: 10, designHours: 0.25, printRate: 2, printHours: 1, quote: 7.5 },
  { slug: "slab-rails", base: 3, design: 10, designHours: 0, printRate: 2, printHours: 1, quote: 5 },
  { slug: "stl-sponge-basket", base: 5, design: 0, designHours: 0, printRate: 1, printHours: 3, quote: 8 },
  { slug: "stl-dual-bevel", base: 5, design: 0, designHours: 0, printRate: 1, printHours: 2, quote: 7 },
  { slug: "stl-slab-rails", base: 5, design: 0, designHours: 0, printRate: 1, printHours: 2.5, quote: 7.5 },
];

describe("published rate card", () => {
  for (const row of RATE_CARD) {
    it(`${row.slug} quotes $${row.quote}`, () => {
      const product = getProduct(row.slug);
      assert.ok(product, `${row.slug} is missing from PRODUCTS`);
      assert.equal(product.basePrice, row.base);
      assert.equal(product.hourlyRate, row.design);
      assert.equal(product.estimatedHours, row.designHours);
      assert.equal(product.printRate, row.printRate);
      assert.equal(product.estimatedPrintHours, row.printHours);
      assert.equal(quoteFor(product), row.quote);
    });
  }

  it("bills every physical tool's print time at $2/hr", () => {
    for (const row of RATE_CARD.filter((r) => !r.slug.startsWith("stl-"))) {
      assert.equal(getProduct(row.slug).printRate, 2, row.slug);
    }
  });
});

describe("digital STL pricing labels", () => {
  const digital = RATE_CARD.filter((r) => r.slug.startsWith("stl-"));

  it("charges the $1/hr rate as print time, with no design hours", () => {
    for (const row of digital) {
      const product = getProduct(row.slug);
      assert.ok(product.digital, `${row.slug} should be digital`);
      assert.equal(product.estimatedHours, 0, `${row.slug} design hours`);
      assert.equal(product.hourlyRate, 0, `${row.slug} design rate`);
      assert.equal(product.printRate, 1, `${row.slug} print rate`);
    }
  });

  it("renders only the Print line in the configurator estimate", () => {
    const form = readFileSync(join(ROOT, "src/components/consultation-form.tsx"), "utf8");
    assert.match(form, /product\.estimatedHours > 0 \?/);
    assert.match(form, /Print · \{product\.estimatedPrintHours \?\? 0\} hr/);
  });
});

describe("Product JSON-LD price", () => {
  it("advertises the quote target, not the bare base fee", () => {
    for (const row of RATE_CARD) {
      assert.equal(productLd(getProduct(row.slug)).offers.price, row.quote, row.slug);
    }
  });

  it("shows the realistic starting quote for the flagship tools", () => {
    assert.equal(productLd(getProduct("custom-chop-complex")).offers.price, 19);
    assert.equal(productLd(getProduct("custom-3d-print")).offers.price, 7);
  });
});
