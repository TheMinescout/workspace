import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getProduct, PRODUCTS, productsIn, quoteFor } from "../src/lib/products.ts";
import { absoluteUrl } from "../src/lib/seo.ts";
import { COLUMNS, feedRows } from "./merchant-feed.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const sitemap = read("public/sitemap.xml");
const printingPage = read("src/routes/3d-printing.tsx");
const configurator = read("src/components/consultation-form.tsx");

const product = getProduct("custom-3d-print");

describe("custom 3D print product", () => {
  it("exists on the requested slug and name", () => {
    assert.ok(product, "custom-3d-print is missing from PRODUCTS");
    assert.equal(product.name, "Custom 3D Print — STL & CAD Service");
    assert.equal(product.kind, "print");
  });

  it("prices the service as $3 base + $20/hr CAD + $2/hr print", () => {
    assert.equal(product.basePrice, 3);
    assert.equal(product.hourlyRate, 20);
    assert.equal(product.printRate, 2);
    assert.ok(product.estimatedPrintHours > 0);
    const expected =
      product.basePrice +
      product.hourlyRate * product.estimatedHours +
      product.printRate * product.estimatedPrintHours;
    assert.equal(quoteFor(product), expected);
  });

  it("carries the only Best seller badge", () => {
    const sellers = PRODUCTS.filter((p) => p.bestSeller).map((p) => p.slug);
    assert.deepEqual(sellers, ["custom-3d-print"]);
    assert.ok(!getProduct("custom-chop-complex").bestSeller);
  });

  it("has keyword-forward headline and SEO copy", () => {
    assert.match(product.headline, /Custom 3D Printing Service/);
    assert.match(product.headline, /STL/);
    assert.match(product.seoDescription, /PLA Matte/);
    assert.match(product.seoDescription, /PETG/);
    assert.match(product.seoDescription, /Sammamish/);
    assert.match(product.seoDescription, /Eastside/);
  });

  it("states the build volume, materials and invoice terms", () => {
    const text = [
      product.longDescription,
      ...product.features,
      ...product.specs.map((s) => `${s.label} ${s.value}`),
    ].join(" ");
    assert.match(text, /256/);
    assert.match(text, /PLA Matte/);
    assert.match(text, /PETG/);
    assert.match(text, /Venmo/i);
    assert.match(text, /invoice/i);
  });
});

describe("custom 3D print discoverability", () => {
  it("is listed in the sitemap with a clean URL", () => {
    assert.ok(
      sitemap.includes("<loc>https://chop-lab.com/tools/custom-3d-print</loc>"),
      "sitemap is missing /tools/custom-3d-print",
    );
    assert.ok(!sitemap.includes("/tools/custom-3d-print#"));
  });

  it("is linked from the 3D printing landing page", () => {
    assert.match(printingPage, /custom-3d-print/);
  });

  it("is in the tools catalog and the homepage grid", () => {
    assert.ok(productsIn("custom").some((p) => p.slug === "custom-3d-print"));
    assert.ok(
      PRODUCTS.filter((p) => !p.digital).some((p) => p.slug === "custom-3d-print"),
      "homepage grid renders non-digital products",
    );
  });

  it("is in the Merchant Center feed at its starting price", () => {
    const row = feedRows().find((r) => r[0] === "custom-3d-print");
    assert.ok(row, "custom-3d-print is missing from the merchant feed");
    const record = Object.fromEntries(COLUMNS.map((k, i) => [k, row[i]]));
    assert.equal(record.price, "3.00 USD");
    assert.equal(record.link, absoluteUrl("/tools/custom-3d-print"));
  });
});

describe("custom 3D print configurator", () => {
  it("offers an STL upload plus print options for the print kind", () => {
    assert.match(configurator, /kind === "print"/);
    assert.match(configurator, /\.stl,model\/stl/);
    assert.match(configurator, /PLA Matte/);
    assert.match(configurator, /PETG/);
  });
});
