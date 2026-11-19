import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BLOG_POSTS, isReleased, views } from "../public/views.js";

const SITEMAP = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");

const NEW_POSTS = [
  {
    href: "/blog/slow-websites-cost-customers.html",
    title: "Why Slow Websites Cost Local Businesses Customers (And How Static Edge Sites Fix It)",
    date: "Nov 19, 2026",
  },
  {
    href: "/blog/custom-ecommerce-cost-2026.html",
    title: "How Much Does a Custom E-Commerce Website Cost in 2026?",
    date: "Nov 12, 2026",
  },
  {
    href: "/blog/chop-lab-storefront.html",
    title: "How I Built a Fast Online Storefront for a Local Ceramics Brand",
    date: "Nov 8, 2026",
  },
];

const blogIndex = views["/blog"];

test("blog index lists every new post", () => {
  for (const post of NEW_POSTS) {
    assert.ok(
      BLOG_POSTS.some((p) => p.href === post.href),
      `${post.href} is missing from BLOG_POSTS`,
    );
    assert.ok(blogIndex.includes(post.title), `${post.title} is missing from the /blog index`);
    assert.ok(blogIndex.includes(post.href), `${post.href} is not linked from the /blog index`);
  }
});

test("new posts are dated today or earlier so they are live", () => {
  for (const post of NEW_POSTS) {
    assert.equal(isReleased(post.date), true, `${post.href} is still scheduled for ${post.date}`);
  }
});

test("each new post has its own rendered page", () => {
  for (const post of NEW_POSTS) {
    const page = views[post.href];
    assert.ok(page, `${post.href} has no registered view`);
    assert.ok(page.includes(post.title), `${post.href} does not render its title`);
    assert.ok(page.includes('href="/blog"'), `${post.href} has no back link to /blog`);
    // Body copy, not just the title card.
    assert.ok(page.length > 2000, `${post.href} looks like a stub (${page.length} chars)`);
  }
});

test("only the newest post carries the Latest badge", () => {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  assert.equal(featured.length, 1, "exactly one post should be featured");
  assert.equal(featured[0].href, NEW_POSTS[0].href);
});

test("every blog card href resolves to a view", () => {
  for (const post of BLOG_POSTS) {
    assert.ok(views[post.href], `${post.href} is linked from the index but has no view`);
  }
});

test("sitemap.xml lists every blog post", () => {
  for (const post of BLOG_POSTS) {
    assert.ok(
      SITEMAP.includes(`<loc>https://minescout.net${post.href}</loc>`),
      `${post.href} is missing from sitemap.xml`,
    );
  }
});

test("sitemap.xml declares a real XML version", () => {
  assert.match(SITEMAP, /^<\?xml version="1\.0" encoding="UTF-8"\?>/, "sitemap.xml must start with an XML 1.0 declaration");
});

/**
 * Every dollar figure in the e-commerce post has to trace back to a price the
 * site actually charges. The pricing page is the source of truth, so pull the
 * tier prices out of it rather than restating them here.
 */
test("e-commerce post quotes the pricing page, not invented numbers", () => {
  const pricing = views["/studio/pricing"];
  const tiers = [...pricing.matchAll(/tier-price">\$<em>([\d,]+)<\/em>/g)].map((m) => m[1]);
  const monthly = [...pricing.matchAll(/\$([\d]+) \/ month/g)].map((m) => m[1]);
  assert.ok(tiers.length >= 4, `could not read tier prices from /studio/pricing (${tiers.length})`);
  assert.ok(monthly.length >= 4, `could not read monthly plans from /studio/pricing (${monthly.length})`);

  const post = views["/blog/custom-ecommerce-cost-2026.html"];
  for (const price of [...tiers, ...monthly]) {
    assert.ok(post.includes(`$${price}`), `post never mentions $${price}, a real price on /studio/pricing`);
  }

  // Ranges the old draft invented, above anything the studio charges to start.
  for (const invented of ["$6,000", "$15,000", "$200 a month"]) {
    assert.ok(!post.includes(invented), `post still quotes ${invented}, which is not on /studio/pricing`);
  }
});
