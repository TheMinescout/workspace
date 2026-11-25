# SEO audit: baseline, what changed, what is still open

This file reconciles the original crawl/Lighthouse/Search Console audit with
what this repository can actually measure, and records the diagnosis for every
item that was investigated. Numbers here were produced by the tooling in
`scripts/seo/` and by Chromium runs against a local copy of `public/`.

Last reconciled: 2026-11-25.

## How to reproduce the measurements

```bash
cd minescout.net
npm run seo:inventory      # page inventory, metadata sources, lengths
npm run seo:report:write   # refresh seo/INVENTORY.md
npm run seo:check          # validation + generated output is current
npm test                   # includes the metadata and redirect suites
```

Serve `public/` with an SPA fallback (nginx `try_files $uri $uri/index.html
@spa`, as `my-sites.conf` does) and the pages behave as they do in production.

## Sprint 1 — metadata infrastructure

The system is described in `seo/README.md`. What it changed:

| Audit finding | Before | After |
| --- | --- | --- |
| Pages discovered | 44 (crawl) | 51 (46 SPA routes incl. 3 scheduled posts, 5 documents) |
| Duplicate titles | 37 | 0 |
| Duplicate meta descriptions | 37 | 0 |
| Pages with a canonical tag | 1 (`index.html`) | 50 (every prerendered route + every document) |
| Pages with `og:*` tags | 1 | every prerendered page |
| Multiple H1 | 2 | 0 |
| Titles over 70 chars | 6 | 0 errors (7 warnings, 60–70 chars: real headlines) |
| Heading-level skips | 18 | 0 |
| Orphan pages | 3 | 0 (`/services/lawn-care` and `/services/coin-data` are now linked from `/work`; `/services/donations` is a `noindex` placeholder) |

The 37 duplicate titles were not a content problem: every route inherited the
single `<title>` in `index.html`, because the SPA sets `document.title` from
JavaScript after the document loads. A crawler that does not run JavaScript
(and Google's first-wave indexing) saw the same title on all 45 routes that existed
at the time. Each
route now ships its own `<title>`, description, canonical, robots directive and
social tags in the HTML itself.

Two pages that the audit counted as duplicate content are aliases
(`/studio/info` → `/studio/intake`, `/legal` → `/studio/legal`). They keep a
useful title but declare the canonical of the page they duplicate and are
`noindex`, which is the correct signal for a duplicate URL that must keep
working.

## Sprint 2 — indexing, crawlability, URL migration

### The three unindexed articles

All three are **scheduled, not thin**:

| URL | Words | Release date |
| --- | --- | --- |
| `/blog/custom-website-vs-wix-squarespace.html` | 1,310 | 2026-11-27 |
| `/blog/sammamish-small-business-website-guide.html` | 1,133 | 2026-12-04 |
| `/blog/websites-for-clubs-robotics-nonprofits.html` | 1,113 | 2026-12-11 |

`views.js` gates each post on its date: `registerPost` does not define the view
until the release date, so the URL 404s and the post is absent from `/blog`.
Search Console reporting "crawled, currently not indexed" is the expected
result for a URL that did not exist yet, and the crawl's thin-content flag came
from the SPA 404 body, not from the articles.

Diagnosis: **no content defect**. Nothing to fix. Request indexing after each
release date; the metadata for each is already written and waiting.

The sitemap no longer lists them before release. `npm run seo:build:write`
rebuilds the blog block of `public/sitemap.xml` from the manifest's release
state, so a scheduled post is omitted until its date and added automatically
afterwards. `seo:check` treats a scheduled URL in the sitemap as an error, since
a crawler following it before the release date gets a 404. The blog entries are
generated; the core, Studio and service entries stay hand-written and are
preserved byte for byte.

### Legacy `/ai/` URLs

`seo/legacy-redirects.json` maps every old URL to its genuine replacement and
`my-sites.conf` serves each as a single-hop 301. `/ai/pricing` →
`/studio/pricing` and `/ai/legal` → `/studio/legal` are mapped explicitly rather
than swept to the Studio home page, which is why `/ai/pricing`'s indexed
canonical now resolves to the page that actually answers that intent.

Anything left under `/ai/` that is not in the map (the old generator, admin
screens) 301s to `/studio`; `robots.txt` still disallows the private ones.
`scripts/redirects.test.mjs` fails if the map and nginx disagree, if a target is
itself a redirect, or if a target is not a page the site serves.

### `/studio/2026` crawl timeout

Cause: `app.js` redirected `/studio/2026` to
`/ads/studio-2026-year-in-review.html`, a file that was never created, so the
URL ended on a 404 (or a hanging request in a crawler that follows the JS
redirect). The sidebar also linked to it.

Fix: the sidebar entry is gone, `app.js` sends the path to `/studio`, and nginx
301s it server-side so a crawler never runs the JS. The review page itself is
still unbuilt — when it ships, drop the redirect and register the route.

### Crawl and structure

- `robots.txt` blocks nothing that should be indexed (`seo:check` asserts this
  against the manifest).
- Sitemap: 44 URLs — 41 indexable and released, plus the 3 scheduled posts. No
  `noindex` page is listed, and every indexable page is listed.
- Heading hierarchy: fixed. Every post opened with an `<h1>` and then jumped to
  `<h3>` for its sections (21 skips across 20 posts and `/studio/roi`). Those
  sections are now `<h2>`, with `.blog-content h2` pinned to the size the `h3`s
  rendered at, so the outline is h1 → h2 and the type looks unchanged.

## Sprint 3 — local and commercial SEO

Keyword-to-page map. The rule applied: one strong page per intent, not a thin
page per town.

| Intent | Page | Title |
| --- | --- | --- |
| web design Sammamish / Eastside | `/studio/local-web-design` | Local Web Design in Sammamish & Bellevue \| Minescout Studio |
| website designer near me | `/studio` | Minescout Studio \| Custom Websites for Small Businesses |
| custom storefront / online shop | `/studio/custom-storefronts` | Custom Online Storefronts \| Minescout Studio |
| clubs, teams, nonprofits | `/studio/student-nonprofit` | Websites for Clubs & Nonprofits \| Minescout Studio |
| website cost / pricing | `/studio/pricing` | Website Design Pricing \| Minescout Studio |
| proof / portfolio | `/studio/clients`, `/work` | Client Work — Minescout Studio |
| process / what it is like | `/studio/process` | The Studio Process — Minescout Studio |

Bellevue, Redmond and Issaquah are named inside the local page's copy and
metadata rather than given their own pages; four near-identical location pages
would compete with each other and read as doorway pages.

Open, needs the site owner (not doable from the repository):

- Confirm whether a Google Business Profile exists and is eligible. The business
  is a service-area business with no storefront; a profile may be created without
  publishing an address, but eligibility and the service-area list are the
  owner's call. Do not invent an address or a phone number.
- Check that name, website and phone match across the profile, the site footer
  and any directory listings.

Competitor baseline (from the audit, sampled results only — not a definitive
list): IY Technology, Caffeinated Design Studio, Mountain Goat Websites,
Sayenko Design, Thrive Design. Their local landing pages are the comparison set
for `/studio/local-web-design`.

## Sprint 4 — content and authority

- The three "thin" articles are 1,100–1,300 words and are scheduled, not thin
  (see Sprint 2). No filler was added.
- Every published article has its own title and description, a single H1 and a
  sitemap entry. The longest are 60–70 characters, which is a warning, not a
  defect: shortening a real headline with an ellipsis ships a worse title.
- Backlinks: the provider reported 56 backlinks from 54 referring domains with a
  spam score of 60. That score is a provider heuristic and was **not** used to
  draw conclusions; individual links were not inspected because the link export
  is not in this repository. Before any disavow or outreach decision, export the
  referring-domain list and classify it by hand.
- No paid links, link schemes or directory spam was added.

## Sprint 5 — performance and accessibility

### Fixed

| Item | Before | After |
| --- | --- | --- |
| `/assets/favicon.png` | 2048×2048, 5.56 MB | 512×512, 235 KB master; 1.3 KB `favicon-32.png` and 3.9 KB `favicon-64.png` are what pages load |
| Sidebar logo (every page) | 5.56 MB PNG rendered at 32 px | `srcset` of the 32/64 px icons (1.3 KB / 3.9 KB) |
| `pisa.jpg` | 16.8 MB, 4000×6000 | 504 KB, 1600×2400 |
| `owl-portrait.jpg` | 15.3 MB, 6000×4000 | 185 KB, 1600×1067 |
| `sagrada-familia-door.jpg` | 14.7 MB, 6000×4000 | 224 KB, 1600×1067 |
| Six unreferenced screenshots (`sbgs-*`, `offc-*`, `life-*`) | 6.8 MB, linked from nowhere | deleted |
| `public/` total | 56 MB | 3.0 MB |
| Colour contrast | 40+ failures across 16 pages, incl. every accent-coloured price, link and badge | 0 failures at AA (see below) |
| Photography `<img>` | no `loading`/`decoding` | `loading="lazy" decoding="async"` |

The favicon finding was the "wrong source image" case: a 5.56 MB 2048 px PNG was
being used as both the favicon and the 32 px sidebar logo, so every page load
pulled it. `scripts/icons.mjs` now generates the sizes browsers ask for from a
512 px master, plus `favicon.ico` and a 1200×630 share card, and
`scripts/icons.test.mjs` fails if a large master creeps back into an icon slot.

Colour contrast was systemic rather than six isolated findings. The established
brand orange (`--brand: #FF6B35`) reaches only 2.8:1 on the page background, so
it cannot carry text or a fill behind text. The brand token is unchanged and
still used for brand accents and decoration (active-nav dot, progress bars,
bullets, and the accent on the dark featured tier, where it reaches 5.1:1).
Text and text-bearing fills use a dedicated accessible shade,
`--accent: #c2461a` (4.85:1 on the tinted page, 5.02:1 under white); the
featured-tier CTA hover moved from `#e03d10` (4.33:1 under white) to `#a83a12`
(5.96:1). Status greens moved to `#2f7350` (5.3:1+ on the pale green panel), the
muted grey on tinted panels to `#5c5850`, the ROI positive figure to `#2f7350`,
and the rating stars to `#9a5f0d`.

The visible change is the darker orange used for accent-coloured text (prices,
links, eyebrows, badges) and for accent fills that carry white text. Brand-only
decoration keeps the original orange. That trade-off is what buys AA contrast;
there is no pairing that keeps `#FF6B35` as text on this background and passes.

### Still open

- **Desktop Lighthouse `NO_FCP`.** Not reproduced here: Chromium loads every
  page with no console error, no failed request and a painted body (verified on
  17 routes, desktop and mobile viewport). The most likely cause is the test
  environment rather than the page — the only render-blocking third party is the
  Google Fonts stylesheet, and `/studio*` additionally injects Google Tag
  Manager at runtime. Reproduce with
  `npx lighthouse https://minescout.net/studio --preset=desktop --chrome-flags="--headless=new"`
  and check `--disable-gpu`/sandbox flags before treating it as a site defect.
  Do not record a score for a run that never painted.
- **TTFB** (about 793 ms in the audit) is a hosting measurement, not a
  repository one: static files behind nginx, so it is origin latency. Measure
  again from the deployed host before changing anything.
- **Render-blocking CSS and Google Fonts**: `main.css` is 103 KB (17 KB gzipped)
  and the font stylesheet is third-party. Options are inlining the critical CSS
  and self-hosting the two font families; both change how the site is built and
  should be their own change with before/after measurements.
- **Unused JS/CSS**: `views.js` (218 KB) is the whole template module and is
  needed by every route; splitting it is a build-system change, not a metadata
  change. `main.css` carries rules for admin screens most visitors never open.
- No Lighthouse score is claimed here. Re-measure after this change is deployed;
  lab scores are not real-user Core Web Vitals.

## Sprint 6 — monitoring

In the repository (automated, runs on every PR that touches `minescout.net/`):

- `npm run seo:check` — fails on missing/duplicate metadata, blank values,
  over-long titles/descriptions, malformed canonicals, accidental `noindex`,
  invalid robots directives, sitemap/`robots.txt` disagreement, metadata that
  does not describe the page, and stale generated output.
- `npm test` — the suites assert the same properties from the other side, plus
  redirect integrity, icon payload limits, and that every sitemap URL is a page
  the repository actually serves.

In Search Console (needs the owner's account; recorded here as the baseline):

| Metric | Baseline (12 months, whole domain) |
| --- | --- |
| Impressions | 379 |
| Clicks | 3 |
| CTR | 0.79% |
| `/studio` | 23 impressions, 0 clicks |
| Indexed Studio pages inspected | `/studio`, `/studio/local-web-design`, `/studio/custom-storefronts` |
| Legacy `/ai/pricing` | indexed, own canonical |
| `/ai/legal` | crawled, not indexed |

Monthly routine:

1. Add a page filter for `https://minescout.net/studio` (and the service pages)
   to separate Studio from the personal pages, the blog and legacy `/ai/` URLs.
2. Record clicks, impressions, CTR, average position, indexed/excluded counts
   and the queries in the commercial term list (web design Sammamish, website
   designer Sammamish, web design Bellevue, small business website design,
   custom website development).
3. Note which URLs changed in the month (the manifest diff is the record) before
   interpreting movement.
4. Re-run `npm run seo:check` against the deployed build and spot-check the
   priority pages return 200 with the expected canonical.
