# AGENTS.md

Persistent notes for agents working in this repository. See `README.md` for the
full description of each site.

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for shared-service ownership and
site-specific boundaries.

## What this repo is

A workspace of separate web properties, not one app. Each site has its own
runtime and build:

| Directory | Site | Stack |
| --- | --- | --- |
| `minescout.net/` | Main portfolio | Static HTML/CSS/JS, served from `public/` |
| `life.minescout.net/` | Minescout Life | React 19 + Vite + React Router (file-based posts, no Firebase) |
| `beta.minescout.net/` | Software lab | Static HTML with clean-URL routing |
| `chop-lab.com/` | The Chop Lab storefront | React 19 + Vite + TanStack Start/Router, Tailwind v4 |

Nginx serves the static sites and proxies the app routes (`my-sites.conf`).

## The Chop Lab (`chop-lab.com/`)

The most active project. Run every command from inside `chop-lab.com/`.

```bash
npm run dev          # dev server on 0.0.0.0:8080 (the platform preview proxy)
npm run build        # production build -> .vercel/output (Nitro), then db:migrate
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run format       # prettier --write .
npm test             # node:test suites under scripts/ and src/
npm run preview      # built-output QA preview on 127.0.0.1:8081
npm run preview:restart   # restart that preview (preview:stop stops it)
npm run db:migrate   # apply migrations/ to DATABASE_URL; skips when it is unset
npm run check:auth   # dev server vs build agree on VITE_AUTH_ENABLED
```

### Quality gate

A change is done when all of these pass:

1. `npm run typecheck` — must be clean.
2. `npm run build` — must succeed.
3. `node scripts/browser-smoke.mjs <url> <out.png>` — clean verdict for desktop
   (1280x800) and mobile (390x844): non-blank body text, **no console/page
   errors**, **no horizontal overflow**. Check the screenshots it writes.

`npm test` runs both stages — the script suites, then the app suites —
and both must be green; `scripts/run-tests.mjs` runs the second stage even when
the first fails, so one red stage cannot hide the other. The suites are
hermetic: they build their own fixtures under the OS temp directory instead of
reading `.grok/app-env.json`, `.env` or `src/lib/og/site.json`, so they pass on a
fresh clone and in CI. The app suites cover product data, the auth gate identity,
SEO and the order-delivery queue (`src/lib/requests.test.ts`).

### Stack and layout

- Routes live in `src/routes/` (file-based): `/`, `/tools`, `/tools/$slug` (which
  also serves the `custom-3d-print` service page), `/3d-printing`, `/configure`,
  `/files`, `/engineering-drawings`, `/about`, `/faq`, `/invoice`
  (passcode-gated studio tool), plus a 404.
- Shell: `src/routes/__root.tsx`, `src/components/layout/site-header.tsx`,
  `site-footer.tsx`.
- Data is static: `src/lib/products.ts` (ten products, `quoteFor()`, `PROCESS`,
  `FAQS`, `HANDLE_COLORS`), `src/lib/textures.ts`.
- Auth and a database are pre-wired but **off by default**
  (`VITE_AUTH_ENABLED=false`; embedded PGlite until `DATABASE_URL` is set):
  `src/lib/auth/`, `src/lib/app-data/` (viewer connector data), `src/lib/db.ts`,
  `migrations/`. Turning auth on means `authMiddleware` on every server function
  and every query scoped by the verified `context.userId` — read §0.5 of
  `chop-lab.com/AGENTS.md` before wiring either.
- Product imagery lives in `public/images/`; product records reference it via
  `image` (primary) and `gallery` (detail-page shots, first entry is the hero).
- Design tokens are in `src/styles.css` (`--color-bg`, `--color-primary`,
  `shadow-lift`, `rise-in`). Fonts: Fraunces (display) + Instrument Sans.

### Platform constraints (do not break)

- `chop-lab.com/AGENTS.md` is the **App Builder sandbox contract** — read it
  before large changes. It owns the preview/port/branding rules.
- Never put `og:*` or `twitter:card` tags in a route `head()`. The platform PWA
  injector (`scripts/grok-pwa-plugin.mjs`, constants in `grok-pwa-shared.mjs`)
  **strips and rewrites** them on every response. Share-card `og:title` comes
  from `src/lib/og/site.json` (currently pinned to "The Chop Lab"), falling back
  to the document `<title>` only when that file has no title; `og:description`
  comes from `site.description`. So a per-page document `<title>` is safe to set
  but does not drive the share card while `site.json` pins the title.
- Keep the `0.0.0.0:8080` dev / `127.0.0.1:8081` preview port contract and
  `PreviewHostBridge` intact.

### Order email and the delivery queue

- `src/lib/studio-mail.ts` sends **only** through SMTP. There is no send
  fallback: without `SMTP_USER` / `SMTP_PASSWORD` it returns a "not configured"
  error, so a missing key is loud instead of silently failing. The Apps Script
  URL stays in that file for the `/invoice` passcode check only (`doGet` still
  answers; `doPost` never did).
- `npm run dev`, `npm run build` and `npm run preview` all run through
  `scripts/with-app-env.mjs`. It reads a git-ignored `.env` at the **repo root**
  and passes every key to the child process, so the file is the place to set
  SMTP for a local dev server; on deploy there is no `.env` and the provider's
  injected secrets are used. Layer order, lowest first: `.grok/app-env.json`,
  the process environment, the root `.env`, the mail keys from every sibling
  site's `.env`, then a `chop-lab.com/.env`. A non-empty file value wins; empty
  keys are ignored so an untouched `.env.example` cannot blank an injected
  secret. `.env.example` at the repo root lists every key, and `EMAIL-SETUP.md`
  walks through the setup.
- `/outbox` reports `smtp` or `unconfigured`, so a missing `.env` is visible
  before the next order fails. A live order that reaches "Request received" but
  never arrives usually means `.env` is missing, or the server was started
  before it was created — restart `npm run dev` after editing `.env`.
- Requests are stored in `localStorage` before sending (`src/lib/requests.ts`,
  key `chop-lab-requests`) and listed at `/outbox`, where an undelivered
  request can be resent with its saved files. A successful studio send clears
  the stored base64 attachments.

### Where email is sent across the sites

There is **one** transport: SMTP, from one account. Nothing uses the Apps Script
or EmailJS to send any more.

- `life.minescout.net` runs the relay: `POST /api/mail` (`server/mail.js`,
  mounted in `vite.config.js`). It owns every template, every recipient and the
  rate limits. The three static sites post form fields to it and never name a
  recipient — an endpoint that emails a browser-chosen address is an open spam
  relay, and Gmail would suspend the account.
- `chop-lab.com/` sends in-process (`src/lib/studio-mail.ts`) because its order
  form carries the customer's attachments. Callers: the configurator
  (`src/components/consultation-form.tsx`), the invoice page
  (`src/routes/invoice.tsx`), and resends (`src/routes/outbox.tsx`).
- `minescout.net/public/app.js` — `postStudioMail(form, fields)` posts the
  contact form, the studio consultation spec and the intelligence-file intake.
  `public/services/lawn-care/index.html` has its own copy of the same call for
  SmartCut leads.
- `life.minescout.net/src/pages/CategoryPage.jsx` posts the feature request to
  its own `/api/mail`.
- `beta.minescout.net/email.html` and `feature-requests.html` post to the relay;
  the Firebase Realtime Database copy is a best-effort archive that no longer
  blocks the send.
- The forms are `minescout/contact`, `minescout/studio-consult`,
  `minescout/studio-intake`, `minescout/lawn-care`, `life/feature-request`,
  `beta/inquiry`, `beta/feature-request`. `FORM_NAMES` in `server/mail.js` is
  the list; an unknown name is a `400`.
- The Apps Script `doGet` still answers the `/invoice` passcode when
  `STUDIO_PASSCODE` is unset, and nothing else. Set `STUDIO_PASSCODE` in `.env`
  to drop that dependency; the compare is constant-time and server-side.

### Conventions

- SEO: use `pageHead(...)` from `src/lib/seo.ts` in each route's `head()`. It
  sets title, description, canonical link, and optional JSON-LD. `SITE_URL` is
  the canonical origin. `public/robots.txt` and `public/sitemap.xml` are static.
- Images: every content `<img>` should carry `loading` (`lazy` below the fold,
  `eager` for the hero), `decoding="async"`, and a fixed aspect wrapper so the
  layout does not shift. `src/components/product-gallery.tsx` does this for
  product shots; `texture-swatch.tsx` and `product-card.tsx` for cards.
- Merchant Center: `public/merchant-center-feed.tsv` is the Google Shopping
  feed, generated from `PRODUCTS` by `scripts/merchant-feed.mjs`
  (`npm run feed:merchant`; `npm run feed:merchant -- --check` exits 1 when the
  committed feed is stale). Never hand-edit it — regenerate after touching
  `products.ts`; `scripts/merchant-feed.test.mjs` fails when the committed file
  is stale. It lists only physical products that have a photo: digital STLs are
  skipped (Merchant Center has no downloadable-goods listing), and
  `sponge-basket` / `slab-rails` are skipped until someone adds a real photo to
  `public/images/` and sets `product.image`. `price` is the `quoteFor(product)`
  quote target the product page renders, and `productLd()` advertises the same
  number, so the feed, the Product JSON-LD, and the page cannot drift.
- Order email: `src/lib/studio-mail.ts` sends the configurator receipt and
  studio notification over SMTP when `SMTP_USER` / `SMTP_PASSWORD` are in the
  server environment (or the git-ignored `.env` at the repo root — see
  `.env.example` and `EMAIL-SETUP.md`), and supports base64 attachments (the
  configurator sends uploaded sketches/STLs with the studio copy). The client
  caps attachments at 3 MB because Vercel caps a server-function body at 4.5 MB;
  a raster photo over that is re-encoded to JPEG to fit, and a file that still
  cannot be attached is named in the studio email instead of being dropped
  silently. There is no fallback transport: without the vars it returns an
  explicit "not configured" error.
  Never hard-code the SMTP password — a non-empty `.env` value wins over the
  process environment locally, and the platform injects the secrets on deploy.
  `nodemailer` is loaded with a dynamic `import()` so a missing install surfaces
  as a send error, not a 500. The deploy syncs the **committed** `node_modules/`
  rather than running `npm install`, so a new runtime dependency has to be
  committed there (only the new package and the lock/metadata files, not the
  whole tree).
- Accessibility: keep the skip link (`#main`) in `__root.tsx`, label navs
  (`aria-label="Main"` / `"Mobile"`), and give content images meaningful `alt`
  text. `alt=""` is only for genuinely decorative images.
- Keep the "clay vibe": warm neutrals, generous spacing, Fraunces display type,
  soft `shadow-lift`. Prefer extending tokens over hard-coded colors.
- Measurement units: **all lengths are stored canonically in millimetres**;
  display units (`mm`/`in`) are applied only at render time. Use `useLength()`
  or the `<Length mm={…} />` component (`src/components/length.tsx`) so a unit
  switch re-renders every measurement — never hard-code `"256 mm"` in JSX. The
  header's `UnitsToggle` is a sliding segmented control (`.unit-switch` in
  `src/styles.css`); the preference persists in `localStorage`.
- Palette/typography: `src/styles.css` holds the warm clay palette
  (`--color-bg #f4ecdf`, `--color-primary #9a4a2c`), a paper grain on `body`, and
  Fraunces `SOFT`/`WONK` variation axes. The font link in `__root.tsx` must keep
  those axis names or the display type loses its warmth.

## The thomas-chat AI worker (`https://thomas-chat.tmcarleton11.workers.dev`)

One Cloudflare Worker (v7.3) backs every AI chat on the sites: Sentry AI and the
pricing quiz / ROI verdict / AI Site Builder on `minescout.net`, the sidebar
reflection and the Admin summarizer on `life.minescout.net`, and the AI Writer on
`beta.minescout.net`. The worker is not in this repo and is treated as fixed, so
the clients have to match its contract:

- **Routes**: `POST /` (chat), `POST /ask` (Life assistant), `POST /code`,
  `POST /holo` (image), `POST /mail`. It answers `405` to anything that is not a
  POST, and `/holo` takes `{prompt}` as JSON — a `?prompt=` GET fails.
- **Never send `system_override`.** The worker answers
  `400 {"error":"Client-supplied system prompts are not accepted."}`. Fold the
  persona, context and instructions into the **first user message** instead.
- **Never send `client_id`** unless the id is in the worker's
  `ALLOWED_CLIENT_IDS` *and* seeded in its `STUDIO_KV`; otherwise it is a `403`.
- **Prefer `task`**: `cms-chat` (default), `studio-builder`, `pricing-quiz`,
  `roi-analysis`, `site-coder`, `life-insight`. An unknown task is a `400`.
  `pricing-quiz` comes back as an already-parsed JSON object in `content`.
- **The reply is `{content}`** — not `answer`, `response` or `text`.
- **Origins**: only the production domains plus `http://localhost:3000` are
  allowed. `http://127.0.0.1:3000` and the platform preview hosts get `403` on
  preflight, which is why `life.minescout.net/scripts/smoke.mjs` stubs the worker.
- **Always check `res.ok`.** An error body has no `.content`, so an unchecked
  call renders whatever canned string the fallback path holds — the pricing quiz
  looped one question forever and the ROI page printed "strong return on
  investment" even for a net loss.
- `minescout.net/scripts/chat-worker.test.mjs` scans every caller in the repo
  (all three sites) for these rules, so CI fails on a regression even though the
  browser smoke stubs the worker.

## The Minescout blog (`minescout.net/public/views.js`)

`/blog` is not a separate app or a file-per-post directory. Everything lives in
`minescout.net/public/views.js`, which is the whole SPA's template module:

- `BLOG_POSTS` is the index metadata (date, tag, `href`, title, excerpt). Order
  in the array is display order; the first released post with `featured: true`
  gets the "Latest" badge.
- Each post body is a `registerPost('/blog/<slug>.html', "Mon D, YYYY", "Category",
  q, a, `<html>`)` call at the bottom of the file. `registerPost` only defines
  the view when `isReleased(date)` is true, so a future date makes the post
  invisible on the index *and* 404 on direct navigation.
- A new post needs four things to be complete: an entry in `BLOG_POSTS`, a
  matching `registerPost` call, a tag colour in `main.css` (`.tag-*`, which
  is duplicated in two blocks — update both), and a `<url>` in
  `public/sitemap.xml`. The sitemap has a `<!-- Blog Posts -->` block at the end
  listing every post; `scripts/blog-posts.test.mjs` fails if a post in
  `BLOG_POSTS` has no sitemap entry.
- A **scheduled** post is one whose `registerPost` date is in the future:
  `registerPost` skips the view, so the post is missing from the index *and*
  404s on direct navigation until the date arrives. `BLOG_POSTS` is ordered
  newest first and `featured: true` must sit on the newest entry —
  `buildBlogIndex` falls back to the newest *released* post, so the Latest badge
  is right before and after a release. `scripts/blog-posts.test.mjs` covers the
  scheduled posts (Nov 27, Dec 4, Dec 11 2026) by importing `views.js` in a child
  process with `Date` pinned (`viewsAt(iso)`), which is the only way to observe a
  gated post without waiting for the calendar.
- A post that needs its own document title/description gets a `PAGE_META` entry
  keyed by its href. Note that this also applies on the 404 render before the
  post releases, so the title/description are public early even though the body
  is not.
- Prices quoted in a post must match `views['/studio/pricing']` — that page is
  the source of truth for what the studio charges. The test suite reads the tier
  and monthly prices out of it and fails if the e-commerce post stops mentioning
  one of them.
- Cache-busting is manual: bump `?v=` on the `app.js` script tag in `index.html`
  and on the `views.js` import in `app.js` after editing either file.
- Per-route document metadata lives in the generated manifest
  (`public/seo/manifest.json`), not in `views.js`. `app.js` renders the route
  immediately (the prerendered head is already correct) and fetches the manifest
  in the background, then applies `document.title`, `meta[name=description]`,
  the canonical link and the `og:*` equivalents on every navigation. To change a
  title, edit `minescout.net/seo/overrides.json` and run
  `npm run seo:build:write`; see the next section.
- The three studio service landing pages (`/studio/local-web-design`,
  `/studio/custom-storefronts`, `/studio/student-nonprofit`) are plain `views`
  entries linked from `/studio`. `scripts/studio-pages.test.mjs` asserts their
  unique H1s, their manifest titles/descriptions, CTA links, sitemap entries,
  and that every dollar figure on them also appears on `/studio/pricing`.
- `npm test` here is `node --test scripts/*.test.mjs` from inside
  `minescout.net/`; `scripts/blog-posts.test.mjs` asserts every index entry has a
  view, that scheduled posts stay out of the sitemap until release, that the new
  posts are released, and that the e-commerce post's prices trace back to the
  pricing page.

## SEO metadata for minescout.net (`minescout.net/seo/`)

`minescout.net` is a client-side SPA, so the HTML it serves contains no page
metadata unless something puts it there. `minescout.net/seo/` is that something:
it discovers every route from `views.js`, generates metadata from each page's own
content, validates it, and prerenders the head tags into `public/<path>/index.html`.
Read `minescout.net/seo/README.md` for the method and `seo/AUDIT.md` for the
audit baseline and what is still open.

```bash
cd minescout.net
npm run seo:inventory          # every page, metadata source, lengths
npm run seo:build              # dry run: which generated files are stale
npm run seo:build:write        # regenerate manifest + prerendered pages + sitemap
npm run seo:report             # print seo/INVENTORY.md
npm run seo:report:write       # regenerate seo/INVENTORY.md
npm run seo:check              # validation + "generated output is current" (CI)
npm run icons                  # regenerate icons + share card
```

`seo:build` and `seo:report` are dry runs. Only the explicitly named
`:write` aliases modify files on disk.

- **Adding a page**: add the route to `views.js`; the next `seo:check` fails
  until `npm run seo:build:write` is run and the output committed. The page
  gets a derived title/description from its own `<h1>` and copy.
- **Better metadata than the derivation**: add an entry to
  `seo/overrides.json` (`title`, `description`, `canonical`, `indexable`,
  `robots`, `kind`, `ogImage`, `notes`). A field name typo or a path that matches
  no page is a build error, so stale overrides cannot linger.
- **Standalone HTML pages** keep their own head tags in the file; the manifest
  records them and `seo:check` fails when the two disagree.
- **Never edit `public/seo/manifest.json` or the prerendered
  `public/<path>/index.html` by hand** — both are generated, and `seo:check`
  fails when they are stale. `public/index.html` stays the shell and is not
  rewritten.
- `seo:check` fails on missing/duplicate/blank metadata, over-long titles or
  descriptions, malformed canonicals, a canonical that disagrees with the route,
  accidental `noindex`, invalid robots directives, more than one `<h1>`,
  metadata sharing no distinctive word with the page, a sitemap URL that is
  unreleased or noindex, sitemap/`robots.txt` disagreement, and stale output.
  Warnings (thin content, long titles, a released page missing from the
  sitemap) do not fail the build.
- Scheduled blog posts are `noindex` and unlinked until their release date, and
  `seo:build:write` derives the blog block of `public/sitemap.xml` from that
  release state: released posts are added automatically and scheduled posts are
  never advertised (a crawler would get a 404). Listing an unreleased post is a
  CI error, not a warning.
- The favicon/logo payload is guarded: `scripts/icons.mjs` derives every icon
  from a 512 px master, and `scripts/icons.test.mjs` fails if a large master is
  wired into an icon or logo slot again (it used to be a 5.56 MB PNG on every
  page load).
- Cache busting still applies: bump `?v=` on `app.js` in `index.html` and on the
  `views.js` import in `app.js` after editing either file, then regenerate.

## Minescout Life (`life.minescout.net/`)

```bash
npm run dev      # Vite dev server on 127.0.0.1:3000
npm run build    # vite build -> dist/
npm run check    # lint (oxlint) + build + tests + render and MCP smoke
```

- The API is a **dev-server-only Vite plugin** (`apiPlugin` in `vite.config.js`),
  mounted in `configureServer`. It only exists while `npm run dev` runs; there is
  no `configurePreviewServer`, so `vite preview` has no backend.
- CORS for `/api/` is owned by the relay's `applyCors`: it echoes the caller's
  origin from `ALLOWED_ORIGINS` and sets `Vary: Origin`. Vite's built-in CORS is
  off (`server.cors: false`) because it only allows localhost and answers the
  preflight before the middleware. `my-sites.conf` must not add a fixed
  `Access-Control-Allow-Origin` to `location /api/` — one hardcoded origin makes
  every other site fail the preflight. `scripts/cors-config.test.mjs` guards it.
- The SMTP client is loaded with `loadNodemailer(appDir)` from
  `life.minescout.net/node_modules`, not a bundled `import("nodemailer")`, so
  the config bundler does not warn and a missing install is reported at startup
  (`mail transport ready` or an install hint). Run `npm install` in
  `life.minescout.net` after a dependency change.
- The AI Reflection line in the sidebar and the Admin chat post to a third-party
  Cloudflare Worker that only answers the production origin. From `127.0.0.1`
  the preflight is rejected and the browser logs a CORS error page JS cannot
  catch; `scripts/smoke.mjs` stubs that one endpoint, so a CORS failure there is
  not a regression.
- Posts are plain files: `public/posts/<id>.json` plus `public/posts/manifest.json`.
  `src/data/posts.js` fetches them. An unknown id gets the 200 HTML app shell
  back from the SPA fallback — not a 404 — so `res.json()` throws.
- A post's `heroImage` (and any body image) must be a same-origin `/assests/...`
  path, never an absolute `https://life.minescout.net/...` URL. An absolute URL
  makes the preview server fetch the production host, and a request that hangs
  leaves `scripts/smoke.mjs` waiting on `networkidle` until the route times out.
  The smoke also stubs the production origin for the same reason it stubs the
  chat worker.
- **`return res.json()` inside a `try` in an `async` function does not catch
  parse failures.** The rejection escapes the `catch`, because the promise is
  returned without being awaited. Always `return await res.json()`. This was a
  real bug across every helper in `src/data/posts.js`.
- The boot guard in `index.html` fires on any `unhandledrejection`. It must stop
  acting once React has painted (`root.firstElementChild`), or a routine
  background-request rejection wipes the whole rendered app. `scripts/smoke.mjs`
  guards both this and the unknown-id path.
- `src/data/` matches the `data/` rule in `life.minescout.net/.gitignore`, but
  `src/data/posts.js` is tracked. Naming that path explicitly (`git add
  src/data/posts.js`) is refused as ignored; stage it with `git add -u` (or
  `git add .`) instead.
- Two posts have an empty `content` in git history (`gemini-cuboid-oracle`,
  `gpt-number-guessing`) — pre-existing at the V4 upgrade, never populated.
- A post is scheduled while either its `publishDate` (ISO datetime) or its show
  `date` is in the future. The pure helpers live in
  `src/lib/scheduling.js` (`parseShowDate`/`publishTime`/`isPublished`/
  `isScheduled`), imported by both the app (`src/data/posts.js`, which
  re-exports them) and the MCP server (`server/mcp.js`), so the site and the
  tools agree. `parseShowDate` must read every shape a `date` can take —
  "November 14, 2026", "14 November 2026", "2026-11-14", "11/14/2026" — because
  a future date it cannot parse is silently treated as "always live" and leaks
  to non-admins. `visiblePosts(posts, isAdmin)` in `src/data/posts.js` is the
  single source of truth for who may see a post: non-admins (and the
  pre-session-check `isAdmin === null` window) never see a scheduled post on the
  timeline, category pages, sidebars, or by direct `/post/<id>` URL. Route every
  list through `visiblePosts`, never inline. `filter(isPublished)` is wrong —
  `filter` passes the index as the `now` argument; `visiblePosts` wraps it in an
  arrow for this reason.
- **AI Posts** (`/pages/ai-posts`) is a category kept off the home timeline but
  shown on its own tab — the weekly AI column. `isAICategory`/`isHomeHidden`/
  `homePosts` in `src/data/posts.js` own that rule (whole-word "ai" match). Home
  uses `homePosts`; every other view keeps using `visiblePosts`. Scheduling still
  applies to AI posts.
- `npm test` runs `node --test scripts/*.test.mjs` (the scheduling and post-body
  sanitizer unit tests). `npm run check` chains lint, build, test, render smoke,
  and the MCP smoke.
- The MCP server (`server/mcp.js`) also renders **title images**: the
  `create_title_image` tool (and the `titleImage` option on `create_post` /
  `update_post`) builds a 1600x900 card and saves it as the post hero. There is
  no image generator in this environment, so a card is DESIGNED from the site's
  tokens, not generated — that is the intended path, not a workaround.
  - **The default renderer needs no browser.** `server/title-image-render.js`
    lays the card out with `satori` (pure JS) and rasterizes it with
    `@resvg/resvg-js`, whose only runtime deps are libc/libm/libgcc. That means
    `create_title_image` works on a host where Chromium cannot start (for
    example `libglib-2.0.so.0` is missing and there is no root to install it),
    so an MCP client needs nothing but the tool call. `server/title-image.js`
    also exports `buildCardHtml`/`exportTitleCardHtml`, which write the card as
    a human-editable HTML source of record beside the PNG. Keep
    `title-image-render.js` in step with `buildCardHtml` — the two must draw the
    same card. `scripts/title-image-render.test.mjs` guards the layout (it
    asserts every band has ink, which catches an overflow such as a missing
    `box-sizing: border-box`).
  - The **browser** renderer is opt-in: `renderer:"browser"` (or
    `TITLE_IMAGE_RENDERER=browser`) photographs the card HTML in headless
    Chromium via Playwright. Chromium must then be present: `CHROMIUM_PATH`,
    else `/usr/bin/chromium`, else Playwright's bundled build. Same card; use it
    for pixel QA of the default renderer.
  - The card design tokens live in `server/title-image.js`; the how-to
    instructions live in `server/title-image-guide.js` and are served over MCP
    as the `how-to-make-a-title` resource and `make_title_image` prompt. Keep
    those two in step with `public/assests/images/how-to-make-a-title.txt`.
  - Images are written to `public/assests/images/<folder>/` — note the
    long-standing `assests` spelling. `IMAGES_DIR` overrides it for tests.
  - **Client-side render is an optional escape hatch** (never required):
    `render_title_card_html` returns the card HTML URL; screenshot it at
    1600x900 (or 2x) anywhere a browser works, then `upload_title_image` (or
    `titleImage.pngBase64` on `create_post` / `update_post`) stores the PNG. The
    server still owns storage and naming, so the resulting path is identical.
    Keep uploads under ~1 MB — nginx sets no `client_max_body_size`, so its 1 MB
    default applies to the base64 body; prefer `scale` 1.
  - The fonts (Lora/Inter/JetBrains Mono) are bundled in `server/fonts/` and
    embedded directly by both renderers, so the render needs no network and
    works offline. `satori` matches a face by an exact numeric weight, so
    `fontBuffers()` registers each weight the card uses (a variable font
    registered only at 400 makes the 700 headline render thin). The tool reports
    `fontsLoaded` so a fallback card is visible, not silent.

## CI

`.github/workflows/ci.yml` runs for `life.minescout.net/**`,
`minescout.net/**` and `chop-lab.com/**` changes. The Life job installs, lints,
builds, tests, then runs `scripts/smoke.mjs` and `scripts/mcp-smoke.mjs`
(Chromium installed via Playwright). The `minescout-net` job just runs `npm test`
(the blog tests in `minescout.net/scripts/`). The `chop-lab` job runs `npm ci`,
`typecheck`, the Merchant Center feed check, the production build, then
`npm test` — the script suites and the app suites, both blocking.
`scripts/run-tests.mjs` discovers every test file itself and fails when a stage
finds none, so a glob that stops matching cannot pass as a green run. The build
step pins `DATABASE_URL` empty because `npm run build` runs `db:migrate`.
`chop-lab.com/package-lock.json` must be committed in the shape npm 10.9.9
(what Node 22 ships) writes it. npm 10 and npm 12 disagree about
`node_modules/nitro/node_modules/lru-cache`, an optional peer of Nitro's nested
`unstorage`: npm 12 omits it, and npm 10 then fails `npm ci` with
`Missing: lru-cache@11.5.3 from lock file`. Regenerate with
`npx npm@10.9.9 install --package-lock-only` from `chop-lab.com/` and never
commit a lockfile rewritten by a newer npm; never swap CI to `npm install`.
`pages.yml` publishes a static
Life preview to GitHub Pages — its API routes are dev-server-only, so comments,
votes and admin sign-in do not work there.

## Git

When committing on a new branch, go ahead and open the pull request — do not
stop to ask first.

Shallow clone — run `git fetch --unshallow` before anything needing full history.
Build output and dependencies are not source: `life.minescout.net/` gitignores
its `node_modules/` and `dist/`, and `chop-lab.com/.vercel/` plus
`chop-lab.com/node_modules/.nitro/` (written by `npm run build`) are untracked.
`chop-lab.com/node_modules/` is committed in git anyway, so an install there
dirties thousands of files — do not stage them.

The `origin` remote's embedded token can go stale; if a push prompts for a
password, reset the remote to use `$GITHUB_TOKEN`:
`git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/TheMinescout/workspace.git"`
