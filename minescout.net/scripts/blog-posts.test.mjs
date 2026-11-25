import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BLOG_POSTS, isReleased, views } from "../public/views.js";

const SITEMAP = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
const MANIFEST = JSON.parse(readFileSync(new URL("../public/seo/manifest.json", import.meta.url), "utf8"));

/** The generated metadata entry for a route (public/seo/manifest.json). */
function metaFor(path) {
  return MANIFEST.pages.find((page) => page.path === path);
}

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

/**
 * Posts published on a schedule. `registerPost` only defines a view when the
 * release date has passed, so these have to be exercised under a pinned clock
 * rather than whenever the suite happens to run.
 */
const SCHEDULED_POSTS = [
  {
    href: "/blog/custom-website-vs-wix-squarespace.html",
    title: "Custom Website vs. Wix and Squarespace: When Should a Small Business Upgrade?",
    date: "Nov 27, 2026",
    lastmod: "2026-11-27",
    links: ["/studio/local-web-design", "/studio/intake", "/studio/pricing"],
  },
  {
    href: "/blog/sammamish-small-business-website-guide.html",
    title: "What Sammamish &amp; Eastside Small Businesses Should Look for in a Website (2026 Guide)",
    date: "Dec 4, 2026",
    lastmod: "2026-12-04",
    links: ["/studio/local-web-design", "/blog/chop-lab-storefront.html", "/blog/chop-lab-spa.html", "/studio/intake"],
  },
  {
    href: "/blog/websites-for-clubs-robotics-nonprofits.html",
    title: "How Student Clubs, Robotics Teams, and Local Nonprofits Can Get a Custom Website Under $750",
    date: "Dec 11, 2026",
    lastmod: "2026-12-11",
    links: ["/studio/student-nonprofit", "/studio/clients", "/studio/intake"],
  },
];

const VIEWS_URL = new URL("../public/views.js", import.meta.url).href;
const SNAPSHOT_ROUTES = ["/blog", ...SCHEDULED_POSTS.map((post) => post.href)];
const snapshots = new Map();

/**
 * Renders the site under a pinned clock. views.js gates posts at import time,
 * so the only way to observe a scheduled post is to load the module in a child
 * process whose Date is fixed before the import runs.
 */
function viewsAt(isoDate) {
  if (!snapshots.has(isoDate)) {
    const script = `
      const RealDate = Date;
      const fixed = new RealDate(${JSON.stringify(isoDate)}).getTime();
      globalThis.Date = class extends RealDate {
        constructor(...args) { super(...(args.length ? args : [fixed])); }
        static now() { return fixed; }
      };
      const { views } = await import(${JSON.stringify(VIEWS_URL)});
      const routes = ${JSON.stringify(SNAPSHOT_ROUTES)};
      process.stdout.write(JSON.stringify(
        Object.fromEntries(routes.map((route) => [route, views[route] ?? null])),
      ));
    `;
    const out = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    snapshots.set(isoDate, JSON.parse(out));
  }
  return snapshots.get(isoDate);
}

const BEFORE_ALL = "2026-11-20T12:00:00";
const AFTER_TWO = "2026-12-05T12:00:00";
const AFTER_ALL = "2026-12-12T12:00:00";

function dollars(html) {
  // Matches $750 and $1,500 but stops before a trailing comma ("$750, and ...").
  return [...html.matchAll(/\$(\d[\d,]*\d|\d)/g)].map((m) => m[1]);
}

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

test("only the newest post carries the featured flag", () => {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  assert.equal(featured.length, 1, "exactly one post should be featured");
  assert.equal(
    featured[0].href,
    BLOG_POSTS[0].href,
    "the featured flag belongs on the newest post, or the Latest badge will stick to an older one after release",
  );
});

test("BLOG_POSTS is ordered newest first", () => {
  const times = BLOG_POSTS.map((post) => new Date(post.date).getTime());
  for (const [i, time] of times.entries()) {
    assert.ok(!Number.isNaN(time), `BLOG_POSTS[${i}] (${BLOG_POSTS[i].href}) has an unparseable date`);
  }
  for (let i = 1; i < times.length; i++) {
    assert.ok(
      times[i - 1] >= times[i],
      `${BLOG_POSTS[i - 1].href} is listed above the newer ${BLOG_POSTS[i].href}`,
    );
  }
});

test("the Latest badge goes to the newest released post", () => {
  const index = viewsAt(AFTER_ALL)["/blog"];
  const newest = BLOG_POSTS[0];
  assert.ok(
    index.includes(`class="blog-card featured" href="${newest.href}"`),
    `the Latest badge is not on ${newest.href}`,
  );
  assert.equal(
    (index.match(/featured-label/g) || []).length,
    1,
    "exactly one card may carry the Latest badge",
  );
});

test("every released blog card resolves to a view", () => {
  for (const post of BLOG_POSTS) {
    if (!isReleased(post.date)) {
      assert.equal(
        views[post.href],
        undefined,
        `${post.href} renders before its ${post.date} release date`,
      );
      continue;
    }
    assert.ok(views[post.href], `${post.href} is released but has no view`);
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

// ---------------------------------------------------------------------------
// Scheduled posts (Nov 27, Dec 4, and Dec 11, 2026)
//
// These go live one at a time, so every assertion runs against a pinned clock
// instead of whatever day CI happens to run. viewsAt() loads views.js with Date
// fixed, which is the only way to see a post that has not been released yet.
// ---------------------------------------------------------------------------

test("scheduled posts are listed in BLOG_POSTS with their release dates", () => {
  for (const post of SCHEDULED_POSTS) {
    const entry = BLOG_POSTS.find((p) => p.href === post.href);
    assert.ok(entry, `${post.href} is missing from BLOG_POSTS`);
    assert.equal(entry.date, post.date, `${post.href} has the wrong release date`);
    assert.equal(entry.tag, "tag-business", `${post.href} should carry the Business tag`);
    assert.equal(entry.tagLabel, "Business", `${post.href} should be labelled Business`);
    assert.ok(entry.excerpt && entry.excerpt.length > 40, `${post.href} needs a real excerpt`);
  }
});

test("scheduled posts stay off the index and the router before release", () => {
  const before = viewsAt(BEFORE_ALL);
  for (const post of SCHEDULED_POSTS) {
    assert.equal(before[post.href], null, `${post.href} renders before its ${post.date} release`);
    assert.ok(
      !before["/blog"].includes(post.href),
      `${post.href} leaked onto the public /blog index before ${post.date}`,
    );
  }
});

test("each scheduled post goes live on its own release date", () => {
  const mid = viewsAt(AFTER_TWO);
  const live = [];
  const pending = [];

  for (const post of SCHEDULED_POSTS) {
    const released = new Date(`${post.lastmod}T12:00:00`) <= new Date(AFTER_TWO);
    if (released) {
      live.push(post.href);
      assert.ok(mid[post.href], `${post.href} should render by ${AFTER_TWO}`);
      assert.ok(mid["/blog"].includes(post.href), `${post.href} should be on /blog by ${AFTER_TWO}`);
    } else {
      pending.push(post.href);
      assert.equal(mid[post.href], null, `${post.href} renders before its ${post.date} release`);
      assert.ok(
        !mid["/blog"].includes(post.href),
        `${post.href} leaked onto the public /blog index before ${post.date}`,
      );
    }
  }

  // Guards the snapshot itself: if every post fell on the same side of the
  // clock this test would stop proving anything about the release gate.
  assert.ok(live.length > 0, `no scheduled post was live by ${AFTER_TWO}`);
  assert.ok(pending.length > 0, `no scheduled post was still pending at ${AFTER_TWO}`);
});

test("scheduled posts render cleanly once released", () => {
  const after = viewsAt(AFTER_ALL);
  for (const post of SCHEDULED_POSTS) {
    const html = after[post.href];
    assert.ok(html, `${post.href} has no registered view after ${post.date}`);
    assert.ok(html.includes(post.title), `${post.href} does not render its title`);
    assert.ok(html.includes('href="/blog"'), `${post.href} has no back link to /blog`);
    assert.ok(html.length > 6000, `${post.href} looks like a stub (${html.length} chars)`);
    assert.ok(!/\bundefined\b/.test(html), `${post.href} leaks "undefined" into the markup`);
    assert.ok(!html.includes("[object Object]"), `${post.href} leaks an object into the markup`);
    assert.ok(!/\bNaN\b/.test(html), `${post.href} leaks NaN into the markup`);

    for (const tag of ["div", "a", "ul", "ol", "li"]) {
      assert.equal(
        (html.match(new RegExp(`<${tag}\\b`, "g")) || []).length,
        html.split(`</${tag}>`).length - 1,
        `${post.href} has unbalanced <${tag}> tags`,
      );
    }
  }
});

test("scheduled posts link to the routes the brief asks for", () => {
  const after = viewsAt(AFTER_ALL);
  for (const post of SCHEDULED_POSTS) {
    const html = after[post.href];
    for (const link of post.links) {
      assert.ok(html.includes(`href="${link}"`), `${post.href} is missing its link to ${link}`);
    }
  }
});

test("every internal link in a scheduled post resolves to a view", () => {
  const after = viewsAt(AFTER_ALL);
  for (const post of SCHEDULED_POSTS) {
    const hrefs = [...after[post.href].matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length > 0, `${post.href} has no internal links`);
    for (const href of hrefs) {
      assert.ok(views[href], `${post.href} links to ${href}, which has no registered view`);
    }
  }
});

test("each scheduled post has its own manifest metadata", () => {
  const titles = [];
  const descriptions = [];

  for (const post of SCHEDULED_POSTS) {
    const meta = metaFor(post.href);
    assert.ok(meta, `${post.href} has no entry in the SEO manifest`);
    assert.ok(meta.title && meta.title.length > 0, `${post.href} needs a document title`);
    assert.ok(meta.title.length <= 70, `${post.href} document title is too long (${meta.title.length})`);
    assert.ok(meta.description && meta.description.length >= 50, `${post.href} needs a real meta description`);
    assert.ok(
      meta.description.length <= 200,
      `${post.href} meta description is too long for a search result (${meta.description.length})`,
    );
    titles.push(meta.title);
    descriptions.push(meta.description);
  }

  assert.equal(new Set(titles).size, titles.length, "scheduled post titles must be unique");
  assert.equal(new Set(descriptions).size, descriptions.length, "scheduled post descriptions must be unique");
});

test("sitemap.xml lists each scheduled post with its release date", () => {
  for (const post of SCHEDULED_POSTS) {
    const loc = `<loc>https://minescout.net${post.href}</loc>`;
    assert.equal(SITEMAP.split(loc).length - 1, 1, `${post.href} must appear exactly once in sitemap.xml`);
    const block = SITEMAP.slice(SITEMAP.indexOf(loc));
    assert.ok(
      block.includes(`<lastmod>${post.lastmod}</lastmod>`),
      `${post.href} is missing <lastmod>${post.lastmod}</lastmod>`,
    );
  }
});

/** Every price the studio actually charges, read from the pricing page. */
const PRICING_PAGE = views["/studio/pricing"];
const STUDIO_PRICES = new Set([
  ...dollars(PRICING_PAGE),
  // Tier prices render as `$<em>1,500</em>`, so the plain `$1,500` scan misses them.
  ...[...PRICING_PAGE.matchAll(/tier-price">\$<em>([\d,]+)<\/em>/g)].map((m) => m[1]),
]);

/**
 * Platform prices read from wix.com/plans and squarespace.com/pricing in
 * November 2026. Wix quotes yearly plans from about $17 to about $159 a month;
 * Squarespace lists Basic/Core/Plus/Advanced at $25/$39/$65/$139 a month and,
 * at the time of writing, a 30% first-term discount of $19/$29/$49/$99.
 */
const PLATFORM_PRICES = ["17", "159", "25", "39", "65", "139", "19", "29", "49", "99"];

/** Three-year totals the comparison post works out from the prices above. */
const THREE_YEAR_TOTALS = ["612", "5,724", "900", "684", "5,004", "3,564", "1,290", "2,040", "3,040"];

test("the Wix/Squarespace comparison quotes researched prices, not invented ones", () => {
  const html = viewsAt(AFTER_ALL)["/blog/custom-website-vs-wix-squarespace.html"];
  const allowed = new Set([...STUDIO_PRICES, ...PLATFORM_PRICES, ...THREE_YEAR_TOTALS]);

  for (const price of dollars(html)) {
    assert.ok(
      allowed.has(price),
      `comparison post quotes $${price}, which is neither on /studio/pricing nor a researched platform price`,
    );
  }
  for (const price of [...PLATFORM_PRICES, ...THREE_YEAR_TOTALS]) {
    assert.ok(html.includes(`$${price}`), `comparison post never mentions $${price}, a figure it depends on`);
  }
});

test("the comparison post quotes the studio tiers and care range", () => {
  const html = viewsAt(AFTER_ALL)["/blog/custom-website-vs-wix-squarespace.html"];
  for (const price of ["750", "1,500", "2,500", "10", "75"]) {
    assert.ok(html.includes(`$${price}`), `comparison post never mentions $${price}, a real price on /studio/pricing`);
  }
});

test("the guide and club posts only quote prices from /studio/pricing", () => {
  const after = viewsAt(AFTER_ALL);
  for (const post of SCHEDULED_POSTS) {
    if (post.href === "/blog/custom-website-vs-wix-squarespace.html") continue;
    for (const price of dollars(after[post.href])) {
      assert.ok(
        STUDIO_PRICES.has(price),
        `${post.href} quotes $${price}, which is not on /studio/pricing`,
      );
    }
  }
});

test("the club post quotes the discounted tier and the optional care plans", () => {
  const html = viewsAt(AFTER_ALL)["/blog/websites-for-clubs-robotics-nonprofits.html"];
  for (const price of ["250", "750", "10", "15"]) {
    assert.ok(html.includes(`$${price}`), `club post never mentions $${price}, a real price on /studio/pricing`);
  }
});
