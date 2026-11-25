# SEO metadata for minescout.net

The site is a client-side SPA: `public/views.js` holds every page template and
`public/app.js` renders it in the browser. That is fine for visitors and bad for
crawlers, which see the empty shell in `index.html` and nothing else. This
directory holds the tooling that fixes that without turning the site into a
build-heavy app.

```
seo/
  overrides.json        hand-written metadata (the only file you normally edit)
  legacy-redirects.json /ai/ URL map, served by my-sites.conf
  INVENTORY.md          generated page inventory + validation findings
scripts/
  seo.mjs               CLI: inventory | build | report | check
  icons.mjs             regenerates the icons and the share card
  seo/                  discovery, parsing, generation, prerender, validation
```

## How it works

```
public/views.js ─┐
public/**/*.html ├─→ discover ─→ generate ─→ validate ─→ prerender ─→ public/**/index.html
index.html shell ┘                 ↑                                      public/seo/manifest.json
                          seo/overrides.json
```

1. **Discover** (`scripts/seo/discover.mjs`) imports `views.js`, so the route
   list comes from the code rather than a hand-kept list, and finds standalone
   documents under `public/`. Scheduled blog posts are discovered too: their
   body is parsed even though `views.js` will not render them until release.
2. **Generate** (`scripts/seo/metadata.mjs`) reads each page's own `<h1>`,
   paragraphs and post title, and produces a title, description, canonical,
   robots directive, Open Graph tags and — only where the page type makes it
   accurate — JSON-LD.
3. **Validate** (`scripts/seo/validate.mjs`) checks the manifest against the
   pages, `sitemap.xml` and `robots.txt`.
4. **Prerender** (`scripts/seo/prerender.mjs`) writes a copy of the shell with
   the real head tags into `public/<path>/index.html`, so the server sends
   correct metadata with the first byte. The body is still the SPA shell: the
   app hydrates as usual.
5. **Runtime parity** — `app.js` fetches `public/seo/manifest.json` and applies
   the same values on every client-side navigation, so a crawler and a visitor
   never see different titles.

## Commands

```bash
npm run seo:inventory    # list every page with its metadata source and lengths
npm run seo:build        # dry run: which generated files are out of date
npm run seo:build -- --write   # write the manifest and prerendered pages
npm run seo:report --write     # regenerate seo/INVENTORY.md
npm run seo:check        # validation + "is the committed output current?" (CI)
npm run icons            # regenerate favicon/icon/share-card PNGs
```

`build` and `report` are dry runs unless `--write` is passed. `check` exits 1 on
any error, and on stale generated output.

## Adding or changing a page

- **A new route in `views.js`**: nothing to do. The next `seo:check` (CI) will
  fail until `npm run seo:build -- --write` is run and the result committed; the
  new page gets a derived title and description in the meantime.
- **A page that needs a better title/description than the derived one**: add an
  entry to `seo/overrides.json`, then rebuild.
- **A new standalone HTML file**: write its `<title>`, description, canonical
  and robots tags in the file itself. The manifest records them, and
  `seo:check` fails if the file and the manifest disagree.
- **A new blog post**: add it to `BLOG_POSTS` and `registerPost` as before, plus
  a sitemap entry. Title and description come from the post itself.

## overrides.json

```json
{
  "site": { "name": "Minescout", "url": "https://minescout.net", "...": "..." },
  "pages": {
    "/studio/pricing": {
      "title": "Website Design Pricing | Minescout Studio",
      "description": "Real Studio prices: ...",
      "indexable": true,
      "canonical": "https://minescout.net/studio/pricing",
      "notes": "why this wording"
    }
  }
}
```

Every field is optional; an override only replaces the field it names. Allowed
fields: `title`, `description`, `canonical`, `indexable`, `robots`, `kind`,
`ogImage`, `notes`. A typo in a field name or a path that matches no page is a
build error, so a stale override cannot sit there quietly.

Use overrides for editorial judgement — the search intent a page should answer —
not to paper over a page whose content is wrong.

## Rules the validator enforces

Errors (fail CI):

- missing or blank title/description on an indexable page;
- duplicate titles or descriptions across indexable pages;
- title over 75 characters, description over 180;
- a canonical that is not absolute, carries a query string, or points at
  `index.html`;
- a canonical that disagrees with the route's own URL (except deliberate
  aliases, which are also noindex);
- `indexable: true` on a page that emits `noindex`, or `indexable: false` on a
  page that emits `index`;
- an invalid robots directive;
- a sitemap URL that is not an indexable page, or a page that is both
  `noindex` and in the sitemap;
- an indexable page blocked by `robots.txt`;
- more than one `<h1>`;
- metadata that shares no distinctive word with the page's own content;
- generated output that is stale, or a hand-written document that disagrees
  with the manifest.

Warnings (reported, not fatal): thin content, heading-level skips, long titles,
pages missing from the sitemap, and scheduled posts listed before release.

## Intentional exceptions

- `/studio/admin`, `/studio/review`, `/studio/chat-config` and the other app
  screens are `noindex` — they are tools, not marketing pages.
- `/studio/info` and `/legal` are aliases: they keep their own title but point
  their canonical at the page they duplicate, and are noindex.
- `/services/donations` is a retired demo kept as a `noindex` placeholder so the
  URL does not 404.
- Blog posts are gated by date. A scheduled post is `noindex` and unlinked until
  its release date, which is why the sitemap entries for the next three posts
  are a warning rather than an error.
