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
  `date` (e.g. "November 14, 2026") is in the future. The pure helpers live in
  `src/lib/scheduling.js` (`parseShowDate`/`publishTime`/`isPublished`/
  `isScheduled`), imported by both the app (`src/data/posts.js`, which
  re-exports them) and the MCP server (`server/mcp.js`), so the site and the
  tools agree. `visiblePosts(posts, isAdmin)` in `src/data/posts.js` is the
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
  `update_post`) builds a 1600x900 card by rendering HTML in headless chromium
  via Playwright and screenshotting it. There is no image generator in this
  environment, so that is the intended path, not a workaround.
  - The card HTML and design tokens live in `server/title-image.js`; the
    how-to instructions live in `server/title-image-guide.js` and are served
    over MCP as the `how-to-make-a-title` resource and `make_title_image`
    prompt. Keep those two in step with
    `public/assests/images/how-to-make-a-title.txt`.
  - Images are written to `public/assests/images/<folder>/` — note the
    long-standing `assests` spelling. `IMAGES_DIR` overrides it for tests.
  - Chromium must be present: `CHROMIUM_PATH`, else `/usr/bin/chromium`, else
    Playwright's bundled build. `scripts/mcp-smoke.mjs` renders a real card.
  - **If the server's browser cannot launch** (a missing system library such as
    `libglib-2.0.so.0`, which needs root to install), do not give up on the
    card: render it on the client instead. `render_title_card_html` returns the
    card HTML URL; screenshot it at 1600x900 (or 2x) anywhere a browser works,
    then `upload_title_image` (or `titleImage.pngBase64` on `create_post` /
    `update_post`) stores the PNG. The server still owns storage and naming, so
    the resulting path is identical. `scripts/render-title-card.mjs`
    (`npm run render-title-card`) does the whole loop in one command. Keep
    uploads under ~1 MB — nginx sets no `client_max_body_size`, so its 1 MB
    default applies to the base64 body; prefer `scale` 1.
  - The fonts (Lora/Inter/JetBrains Mono) are bundled in `server/fonts/` and
    inlined into the card as base64 `@font-face` rules, so the render needs no
    network and works offline. The tool still reports `fontsLoaded` so a
    fallback card is visible, not silent. The render waits on
    `document.fonts.ready` (with a 5s cap) rather than `networkidle`, so a
    stalled resource can never hang the render and leave an empty hero image.

## CI

`.github/workflows/ci.yml` runs only for `life.minescout.net/**` changes: install,
lint, build, test, then `scripts/smoke.mjs` and `scripts/mcp-smoke.mjs`
(Chromium installed via Playwright). `pages.yml` publishes a static Life preview
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
