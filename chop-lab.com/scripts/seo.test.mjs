import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS, productSeo } from "../src/lib/products.ts";
import {
  canonicalUrl,
  LOCAL_BUSINESS_LD,
  ORGANIZATION_LD,
  pageHead,
  productHead,
  productImageUrl,
  productLd,
  SITE_URL,
} from "../src/lib/seo.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function metaOf(head, key) {
  return head.meta.filter((entry) => entry[key] !== undefined).map((entry) => entry[key]);
}

function ldBlocks(head) {
  return head.meta.filter((entry) => entry["script:ld+json"]).map((entry) => entry["script:ld+json"]);
}

test("canonical hrefs are absolute and self-referencing", () => {
  assert.equal(canonicalUrl("/"), "https://chop-lab.com");
  assert.equal(canonicalUrl("/tools"), "https://chop-lab.com/tools");
  assert.equal(canonicalUrl("/tools/sponge-basket"), "https://chop-lab.com/tools/sponge-basket");
  assert.equal(canonicalUrl("/3d-printing"), "https://chop-lab.com/3d-printing");
});

test("every page head carries exactly one canonical link", () => {
  for (const path of ["/", "/tools", "/faq", "/about", "/3d-printing"]) {
    const head = pageHead({ title: "t", description: "d", path });
    assert.equal(head.links.length, 1);
    assert.equal(head.links[0].rel, "canonical");
    assert.equal(head.links[0].href, canonicalUrl(path));
  }
});

test("homepage canonical is the bare origin with no hash fragment", () => {
  const head = pageHead({ title: "t", description: "d", path: "/" });
  assert.equal(head.links[0].href, SITE_URL);
  assert.ok(!head.links[0].href.includes("#"));
});

test("pageHead emits several JSON-LD blocks when given an array", () => {
  const head = pageHead({
    title: "t",
    description: "d",
    path: "/x",
    ld: [ORGANIZATION_LD, LOCAL_BUSINESS_LD],
  });
  assert.equal(ldBlocks(head).length, 2);
});

test("each product has unique, pottery-intent title and description", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const product of PRODUCTS) {
    const seo = productSeo(product);
    assert.ok(seo.title.length > 0 && seo.title.length <= 70, `title length for ${product.slug}`);
    assert.ok(
      seo.description.length > 50 && seo.description.length <= 160,
      `description length for ${product.slug}`,
    );
    assert.ok(seo.keywords.length >= 3, `keywords for ${product.slug}`);
    assert.ok(seo.title.endsWith("— The Chop Lab"), `brand suffix for ${product.slug}`);
    titles.add(seo.title);
    descriptions.add(seo.description);
  }
  assert.equal(titles.size, PRODUCTS.length, "product titles must be unique");
  assert.equal(descriptions.size, PRODUCTS.length, "product descriptions must be unique");
});

test("high-intent products name ceramics search terms in the title", () => {
  const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, productSeo(p)]));
  assert.match(bySlug["custom-chop-complex"].title, /Pottery Stamp/);
  assert.match(bySlug["custom-chop-complex"].title, /Maker's Mark/);
  assert.match(bySlug["sponge-basket"].title, /Pottery Wheel Sponge Holder/);
});

test("product head sets title, description, canonical and Product JSON-LD", () => {
  for (const product of PRODUCTS) {
    const head = productHead(product);
    const seo = productSeo(product);
    assert.deepEqual(metaOf(head, "title"), [seo.title]);
    const description = head.meta.find((entry) => entry.name === "description");
    assert.equal(description.content, seo.description);
    assert.equal(head.links[0].href, `https://chop-lab.com/tools/${product.slug}`);

    const [ld] = ldBlocks(head);
    assert.equal(ld["@type"], "Product");
    assert.equal(ld.name, seo.heading);
    assert.equal(ld.url, `https://chop-lab.com/tools/${product.slug}`);
    assert.equal(ld.brand.name, "The Chop Lab");
    assert.ok(Array.isArray(ld.image) && ld.image.length > 0);
    assert.ok(ld.image[0].startsWith("https://chop-lab.com/"));
    assert.equal(ld.offers["@type"], "Offer");
    assert.equal(ld.offers.priceCurrency, "USD");
    assert.match(ld.offers.price, /^\d+\.\d{2}$/);
    assert.equal(ld.offers.availability, "https://schema.org/InStock");
    assert.equal(ld.offers.url, ld.url);
  }
});

test("product JSON-LD price matches the quoted estimate", () => {
  for (const product of PRODUCTS) {
    const ld = productLd(product);
    const expected = (product.basePrice + product.hourlyRate * product.estimatedHours).toFixed(2);
    assert.equal(ld.offers.price, expected, `price for ${product.slug}`);
  }
});

test("every product resolves a structured-data image", () => {
  for (const product of PRODUCTS) {
    assert.ok(productImageUrl(product).startsWith("https://chop-lab.com/"), product.slug);
  }
});

test("sitemap lists canonical pages and products with no hash fragments", () => {
  const xml = readFileSync(join(root, "public/sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locs.length > 0);
  assert.ok(locs.includes("https://chop-lab.com"), "homepage entry");
  assert.ok(locs.includes("https://chop-lab.com/3d-printing"), "/3d-printing entry");
  for (const product of PRODUCTS) {
    assert.ok(locs.includes(`https://chop-lab.com/tools/${product.slug}`), product.slug);
  }
  for (const loc of locs) {
    assert.ok(!loc.includes("#"), `hash fragment in ${loc}`);
    assert.equal(new URL(loc).origin, SITE_URL, `off-site loc ${loc}`);
  }
  assert.equal(new Set(locs).size, locs.length, "duplicate sitemap entries");
});

test("robots.txt points at the sitemap and keeps the studio tool out of the index", () => {
  const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/chop-lab\.com\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/invoice/);
});
