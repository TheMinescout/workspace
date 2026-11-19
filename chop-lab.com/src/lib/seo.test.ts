import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { absoluteUrl, ORGANIZATION_LD, pageHead, productLd, SITE_URL } from "./seo.ts";
import { PRODUCTS } from "./products.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");

function locs() {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

describe("canonical URLs", () => {
  it("uses the bare origin for the homepage, with no trailing slash", () => {
    assert.equal(SITE_URL, "https://chop-lab.com");
    assert.equal(absoluteUrl("/"), "https://chop-lab.com");
  });

  it("builds absolute canonical URLs for nested paths", () => {
    assert.equal(absoluteUrl("/tools"), "https://chop-lab.com/tools");
    assert.equal(
      absoluteUrl("/tools/sponge-basket"),
      "https://chop-lab.com/tools/sponge-basket",
    );
  });

  it("emits a self-referencing canonical link for every route path", () => {
    for (const path of ["/", "/tools", "/faq", "/about", "/3d-printing"]) {
      const head = pageHead({ title: "t", description: "d", path });
      assert.deepEqual(head.links, [{ rel: "canonical", href: absoluteUrl(path) }]);
    }
  });

  it("never emits a hash fragment in a canonical link", () => {
    for (const path of ["/", "/tools", "/faq", "/about", "/3d-printing"]) {
      const [link] = pageHead({ title: "t", description: "d", path }).links;
      assert.ok(!String(link.href).includes("#"));
    }
  });
});

describe("product SEO metadata", () => {
  it("gives every product a distinct, keyword-forward headline and description", () => {
    const headlines = new Set<string>();
    const descriptions = new Set<string>();
    for (const product of PRODUCTS) {
      assert.ok(product.headline.length > 0, `${product.slug} headline`);
      assert.ok(product.seoDescription.length >= 60, `${product.slug} description`);
      assert.notEqual(product.headline, product.name, `${product.slug} headline is keyword-forward`);
      headlines.add(product.headline);
      descriptions.add(product.seoDescription);
    }
    assert.equal(headlines.size, PRODUCTS.length);
    assert.equal(descriptions.size, PRODUCTS.length);
  });

  it("targets high-intent ceramics queries on the flagship tools", () => {
    const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
    assert.match(bySlug.get("custom-chop-complex")!.headline, /Clay Stamp|Maker's Mark/i);
    assert.match(bySlug.get("sponge-basket")!.headline, /Pottery Wheel Sponge Holder/i);
  });
});

describe("product structured data", () => {
  it("emits a Product offer with a clean numeric starting price", () => {
    for (const product of PRODUCTS) {
      const ld = productLd(product) as {
        "@type": string;
        name: string;
        description: string;
        offers: { price: number; priceCurrency: string; availability: string };
      };
      assert.equal(ld["@type"], "Product");
      assert.equal(typeof ld.offers.price, "number");
      assert.ok(Number.isFinite(ld.offers.price));
      assert.equal(ld.offers.price, product.basePrice);
      assert.equal(ld.offers.priceCurrency, "USD");
      assert.equal(ld.offers.availability, "https://schema.org/InStock");
      assert.equal(ld.name, product.headline);
      assert.equal(ld.description, product.seoDescription);
    }
  });

  it("includes an absolute image URL when the product has a photo", () => {
    const withImage = PRODUCTS.filter((p) => p.image);
    assert.ok(withImage.length > 0);
    for (const product of withImage) {
      const ld = productLd(product) as { image?: string[] };
      assert.deepEqual(ld.image, [absoluteUrl(product.image!)]);
    }
  });
});

describe("product page heads", () => {
  it("gives every product a unique title and description", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const product of PRODUCTS) {
      const head = pageHead({
        title: `${product.headline} — The Chop Lab`,
        description: product.seoDescription,
        path: `/tools/${product.slug}`,
        ld: productLd(product),
      });
      titles.add(String(head.meta.find((m) => "title" in m)?.title));
      descriptions.add(String(head.meta.find((m) => "name" in m && m.name === "description")?.content));
      assert.equal(head.links[0].href, `https://chop-lab.com/tools/${product.slug}`);
    }
    assert.equal(titles.size, PRODUCTS.length);
    assert.equal(descriptions.size, PRODUCTS.length);
  });
});

describe("sitemap", () => {
  it("lists the dedicated 3D printing page", () => {
    assert.ok(locs().some((u) => u === "https://chop-lab.com/3d-printing"));
  });

  it("lists every indexable static route", () => {
    const urls = locs();
    for (const path of ["/", "/tools", "/3d-printing", "/files", "/about", "/faq", "/engineering-drawings"]) {
      assert.ok(urls.includes(`https://chop-lab.com${path}`), `missing ${path}`);
    }
  });

  it("lists every product route cleanly", () => {
    const urls = locs();
    for (const product of PRODUCTS) {
      assert.ok(
        urls.includes(`https://chop-lab.com/tools/${product.slug}`),
        `missing ${product.slug}`,
      );
    }
  });

  it("contains no hash fragments and no duplicates", () => {
    const urls = locs();
    assert.equal(urls.filter((u) => u.includes("#")).length, 0);
    assert.equal(new Set(urls).size, urls.length);
  });
});

describe("organization structured data", () => {
  it("points at the canonical origin", () => {
    assert.equal(ORGANIZATION_LD.url, SITE_URL);
  });
});
