import assert from "node:assert/strict";
import { test } from "node:test";

import { BLOG_POSTS, isReleased, views } from "../public/views.js";

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
