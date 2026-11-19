# AGENTS.md

Persistent notes for agents working in this repository. See `README.md` for the
full description of each site.

## What this repo is

A workspace of separate web properties, not one app. Each site has its own
runtime and build:

| Directory | Site | Stack |
| --- | --- | --- |
| `minescout.net/` | Main portfolio | Static HTML/CSS/JS, served from `public/` |
| `life.minescout.net/` | Minescout Life | React 19 + Vite + React Router (file-based posts, no Firebase) |
| `beta.minescout.net/` | Staging | Static HTML with clean-URL routing |
| `chop-lab.com/` | The Chop Lab storefront | React 19 + Vite + TanStack Start/Router, Tailwind v4 |

Nginx serves the static sites and proxies the app routes (`my-sites.conf`).

## The Chop Lab (`chop-lab.com/`)

The most active project. Run every command from inside `chop-lab.com/`.

```bash
npm run dev          # dev server on 0.0.0.0:8080 (the platform preview proxy)
npm run build        # production build -> .vercel/output (Nitro)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # node:test suites under scripts/ and src/
npm run preview      # built-output QA preview on 127.0.0.1:8081
```

### Quality gate

A change is done when all of these pass:

1. `npm run typecheck` — must be clean.
2. `npm run build` — must succeed.
3. `node scripts/browser-smoke.mjs <url> <out.png>` — clean verdict for desktop
   (1280x800) and mobile (390x844): non-blank body text, **no console/page
   errors**, **no horizontal overflow**. Check the screenshots it writes.

`npm test` has 16 pre-existing failures (of 195) unrelated to most work, in two
groups. Eight read App Builder template scaffolding this repo does not ship —
`.grok/skills/**` and `.grok/app-env.json` (`brand-check`, `write-atomic`,
`with-app-env`, `check-auth-invariant`). The other eight (`grok-pwa-plugin`)
expect the document `<title>` to become `og:title`, but the committed
`src/lib/og/site.json` pins the app title to "The Chop Lab", which wins. Confirm
your change did not add failures by comparing the failing-test count before and
after — `git stash` your edits and re-run if unsure.

### Stack and layout

- Routes live in `src/routes/` (file-based): `/`, `/tools`, `/tools/$slug`,
  `/configure`, `/files`, `/engineering-drawings`, `/about`, `/faq`,
  `/invoice` (passcode-gated studio tool), plus a 404.
- Shell: `src/routes/__root.tsx`, `src/components/layout/site-header.tsx`,
  `site-footer.tsx`.
- Data is static: `src/lib/products.ts` (products, `PROCESS`, `FAQS`,
  `HANDLE_COLORS`), `src/lib/textures.ts`.
- Product imagery lives in `public/images/`; product records reference it via
  `image` (primary) and `gallery` (detail-page shots, first entry is the hero).
- Design tokens are in `src/styles.css` (`--color-bg`, `--color-primary`,
  `shadow-lift`, `rise-in`). Fonts: Fraunces (display) + Instrument Sans.

### Platform constraints (do not break)

- `chop-lab.com/AGENTS.md` is the **App Builder sandbox contract** — read it
  before large changes. It owns the preview/port/branding rules.
- Never put `og:*` or `twitter:card` tags in a route `head()`. The platform PWA
  injector (`scripts/grok-pwa-plugin.mjs`) **strips and rewrites** them on every
  response. Share-card `og:title` comes from `src/lib/og/site.json` (currently
  pinned to "The Chop Lab"), falling back to the document `<title>` only when
  that file has no title; `og:description` comes from `site.description`. So a
  per-page document `<title>` is safe to set but does not drive the share card
  while `site.json` pins the title.
- Keep the `0.0.0.0:8080` dev / `127.0.0.1:8081` preview port contract and
  `PreviewHostBridge` intact.

### Conventions

- SEO: use `pageHead(...)` from `src/lib/seo.ts` in each route's `head()`. It
  sets title, description, canonical link, and optional JSON-LD. `SITE_URL` is
  the canonical origin. `public/robots.txt` and `public/sitemap.xml` are static.
- Images: every content `<img>` should carry `loading` (`lazy` below the fold,
  `eager` for the hero), `decoding="async"`, and a fixed aspect wrapper so the
  layout does not shift. `src/components/product-gallery.tsx` does this for
  product shots; `texture-swatch.tsx` and `product-card.tsx` for cards.
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
- Prices quoted in a post must match `views['/studio/pricing']` — that page is
  the source of truth for what the studio charges. The test suite reads the tier
  and monthly prices out of it and fails if the e-commerce post stops mentioning
  one of them.
- Cache-busting is manual: bump `?v=` on the `app.js` script tag in `index.html`
  and on the `views.js` import in `app.js` after editing either file.
- `npm test` here is `node --test minescout.net/scripts/*.test.mjs` from inside
  `minescout.net/`; `scripts/blog-posts.test.mjs` asserts every index entry has a
  view and a sitemap entry, that the new posts are released, and that the
  e-commerce post's prices trace back to the pricing page.

## Minescout Life (`life.minescout.net/`)

```bash
npm run dev      # Vite dev server on 127.0.0.1:3000
npm run build    # vite build -> dist/
npm run check    # lint (oxlint) + render smoke + MCP smoke
```

- The API is a **dev-server-only Vite plugin** (`apiPlugin` in `vite.config.js`),
  mounted in `configureServer`. It only exists while `npm run dev` runs; there is
  no `configurePreviewServer`, so `vite preview` has no backend.
- Posts are plain files: `public/posts/<id>.json` plus `public/posts/manifest.json`.
  `src/data/posts.js` fetches them. An unknown id gets the 200 HTML app shell
  back from the SPA fallback — not a 404 — so `res.json()` throws.
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

`.github/workflows/ci.yml` runs for `life.minescout.net/**` and
`minescout.net/**` changes. The Life job installs, lints, builds, tests, then runs
`scripts/smoke.mjs` and `scripts/mcp-smoke.mjs` (Chromium installed via Playwright).
The `minescout-net` job just runs `npm test` (the blog tests in
`minescout.net/scripts/`). `pages.yml` publishes a static Life preview
to GitHub Pages — its API routes are dev-server-only, so comments, votes and
admin sign-in do not work there. The Chop Lab has no CI; verify it by hand with
the commands above.

## Git

When committing on a new branch, go ahead and open the pull request — do not
stop to ask first.

Shallow clone — run `git fetch --unshallow` before anything needing full history.
Build output and dependencies are not source: `life.minescout.net/` gitignores
its `node_modules/` and `dist/`, and `chop-lab.com/.vercel/` (written by
`npm run build`) is untracked. `chop-lab.com/node_modules/` is committed in git
anyway, so an install there dirties thousands of files — do not stage them.

The `origin` remote's embedded token can go stale; if a push prompts for a
password, reset the remote to use `$GITHUB_TOKEN`:
`git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/TheMinescout/workspace.git"`
