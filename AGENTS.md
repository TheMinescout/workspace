# AGENTS.md

Persistent notes for agents working in this repository. See `README.md` for the
full description of each site.

## What this repo is

A workspace of separate web properties, not one app. Each site has its own
runtime and build:

| Directory | Site | Stack |
| --- | --- | --- |
| `minescout.net/` | Main portfolio | Static HTML/CSS/JS, served from `public/` |
| `life.minescout.net/` | Minescout Life | React 19 + Vite + React Router + Firebase |
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

`npm test` has pre-existing failures unrelated to most work (they exercise the
platform template's `.grok/` skill scaffolding, which is absent here). Confirm
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
  response. Per-page document `<title>` and `description` are safe and are what
  the injector reads for share cards.
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

## Git

Shallow clone — run `git fetch --unshallow` before anything needing full history.
`node_modules/`, `.vercel/`, and `.agents_tmp/` are not part of the source tree;
do not commit them.
