#!/usr/bin/env node
// Builds the Google Merchant Center TSV feed from the same product records the
// site renders, so feed prices, links and images cannot drift from the pages.
//
//   node scripts/merchant-feed.mjs           # write public/merchant-center-feed.tsv
//   node scripts/merchant-feed.mjs --check   # exit 1 if the committed file is stale
//
// Digital STL products are skipped: Merchant Center has no listing type for
// downloadable goods, and a shopper cannot be handed a file at checkout.
//
// `price` is the numeric `basePrice`, matching the Product JSON-LD the product
// page emits. The quote target (base + CAD hours) is not a fixed price, so
// advertising it would disagree with the structured data on the same page.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "../src/lib/products.ts";
import { absoluteUrl, SITE_URL } from "../src/lib/seo.ts";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const FEED_PATH = join(ROOT, "public/merchant-center-feed.tsv");
export const FEED_URL = `${SITE_URL}/merchant-center-feed.tsv`;

export const COLUMNS = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "additional_image_link",
  "availability",
  "price",
  "brand",
  "condition",
  "identifier_exists",
  "google_product_category",
  "product_type",
];

const GOOGLE_CATEGORY =
  "Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Art & Crafting Tools";

const PRODUCT_TYPE = {
  chops: "Pottery Tools > Custom Chops & Texture Rollers",
  storage: "Pottery Tools > Studio Storage",
  slab: "Pottery Tools > Slab & Handbuilding",
};

/** Tab/newline-safe field, per the Merchant Center TSV spec. */
function cell(value) {
  return String(value).replace(/[\t\r\n]+/g, " ").trim();
}

function priceCell(product) {
  return `${product.basePrice.toFixed(2)} USD`;
}

/** Products that cannot be listed yet: no photo, or a digital download. */
export function skipped() {
  return PRODUCTS.filter((p) => p.digital || !p.image).map((p) => ({
    slug: p.slug,
    reason: p.digital ? "digital download (unsupported product type)" : "no photo in public/images",
  }));
}

export function feedRows() {
  return PRODUCTS.filter((p) => !p.digital && p.image).map((p) => {
    const extra = (p.gallery ?? [])
      .slice(1)
      .map((g) => absoluteUrl(g.src))
      .join(",");
    return [
      p.slug,
      p.headline,
      p.longDescription,
      absoluteUrl(`/tools/${p.slug}`),
      absoluteUrl(p.image),
      extra,
      "in_stock",
      priceCell(p),
      "The Chop Lab",
      "new",
      "no",
      GOOGLE_CATEGORY,
      PRODUCT_TYPE[p.category],
    ].map(cell);
  });
}

export function renderFeed() {
  const lines = [COLUMNS.join("\t"), ...feedRows().map((r) => r.join("\t"))];
  return `${lines.join("\n")}\n`;
}

export function isStale() {
  try {
    return readFileSync(FEED_PATH, "utf8") !== renderFeed();
  } catch {
    return true;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const check = process.argv.includes("--check");
  if (check) {
    if (isStale()) {
      console.error(`merchant feed is stale — run: npm run feed:merchant`);
      process.exit(1);
    }
    console.log(`merchant feed is current (${feedRows().length} products)`);
  } else {
    writeFileSync(FEED_PATH, renderFeed());
    console.log(`wrote ${FEED_PATH} (${feedRows().length} products) -> ${FEED_URL}`);
    for (const s of skipped()) console.log(`  skipped ${s.slug}: ${s.reason}`);
  }
}
