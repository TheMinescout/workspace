# Minescout Beta — Site Overview

**Current state: November 2026**

Live preview: <https://work-1-queeoildiayknbys.prod-runtime.all-hands.dev/>

This document explains what `beta.minescout.net` is now and what changed from the previous version. Nothing here has been pushed to GitHub yet.

---

## 1. What Beta is now

Minescout Beta is the independent software lab in the Minescout ecosystem.

- **ATLS** is what the lab has written.
- **PRDS** is what the lab has built.
- **UPDATES** is what changed, and when.

The site is not a staging copy of the main site, not a client-services page, and not a community platform. It is a public catalogue of software experiments, utilities, release notes, and development histories.

The current positioning is:

> **Ideas become software.**
>
> An independent software lab exploring technology, building useful tools, and publishing experimental projects.

There is **no public account requirement**. Following a project and the “since your last visit” module are stored in the browser.

---

## 2. At a glance

| Item | Current state |
| --- | --- |
| Projects | **7** total: 5 stable, 1 experimental, 1 archived |
| ATLS publications | **8** total: 7 published, 1 archived |
| Release-log items | **15** (project updates + ATLS entries) |
| Top navigation | HOME, ATLS, PRDS, UPDATES, REQUESTS, CONTACT |
| Account | Removed from public navigation |
| Data source | `assets/js/catalog.js` |
| Stylesheet | `assets/css/style.css?v=18` |
| Hosting model | Static files, clean URLs, Cloudflare Pages-compatible `_headers` |

### Current projects

| Project | Status | Version | Released |
| --- | --- | --- | --- |
| Minescout Crypto Toolkit | Stable | v1.0 | Sep 29, 2026 |
| Crypto Toolkit v2 | Experimental | v2 · in development | — |
| AI Writer Suite | Stable | v1.0 | Dec 25, 2025 |
| Portfolio Projection | Stable | v1.0 | Dec 27, 2025 |
| Vigenère Tool | Stable | v1.0 | Dec 05, 2025 |
| Cognisearch v5 | Stable | v5.0 | Nov 30, 2025 |
| AI News Synthesis v1 | Archived | v1.0 | Oct 01, 2025 |

### Current publications

| Publication | Type | Date |
| --- | --- | --- |
| Ideas Become Software | Design / Research | Nov 27, 2026 |
| RELEASE: Minescout Crypto Toolkit | Release / Technical | Sep 29, 2026 |
| The Evolution of Minescout Beta | Design / Retrospective | Aug 09, 2026 |
| RELEASE: Portfolio Projection | Release | Dec 27, 2025 |
| RELEASE: AI Writer Suite | Release | Dec 25, 2025 |
| RELEASE: Vigenère Crypto Tool | Release | Dec 05, 2025 |
| RELEASE: Cognisearch v5 | Release | Nov 30, 2025 |
| AI News Synthesis v1 | Archive | Oct 01, 2025 |

---

## 3. Site map

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Lab positioning, featured stable release, status summary, recent ATLS, latest activity |
| `/projects` | PRDS catalogue | Filterable project catalogue with status, version, stack, launch/download, follow |
| `/project?id=<id>` | Project detail | Overview, capabilities, development history, related ATLS, metadata, feedback |
| `/pages` | ATLS publications | Typed publication index with filters and archive |
| `/updates` | Release log | Combined chronological feed of project updates and ATLS entries |
| `/feature-requests` | Requests | Feature request form with optional project context |
| `/email` | Contact | Direct message form with optional project context |
| `/404` | Not found | Static 404 page |
| `/login` | Admin sign-in | Unlinked, `noindex` legacy admin sign-in |
| `/admin-messages` | Admin inbox | Unlinked, `noindex` internal message view |
| `/content/articles/<slug>` | Article | Individual ATLS publication |
| `/content/projects/<slug>` | Tool | Runnable project or download page |
| `/content/archive/...` | Archive | Legacy project/article material |

Clean URLs are handled by the existing server rewrite rule. `project.html` uses a query parameter because the detail page is generated client-side from the catalogue.

---

## 4. Page-by-page: new vs old

### Home

**Old**

- Headline: “Tools, experiments, and things worth building.”
- Two directory cards: **Articles** and **Projects**.
- A short status block and three quick links: Request, Contact, Account.
- No featured project, no release log, no status counts, no latest-publications module.
- The page calculated `window.missedUpdates` but did not render a “since last visit” UI.
- Topbar included **ACCOUNT ↗**.

**New**

- Headline: “Ideas become software.”
- Three pillars: **Explore**, **Build**, **Publish**.
- **Latest stable release** module, selected dynamically from stable projects with a release date.
- **Publications** and **Project catalogue** entry cards.
- **Recent publications** list from ATLS.
- **Latest activity / Since your last visit** module using the shared activity feed.
- **Status summary** with live counts: Stable, Experimental, Archived.
- Quick links: Request, Contact, **Ecosystem → Minescout Life**.
- Topbar includes **UPDATES** and no account link.

### PRDS — Project catalogue

**Old**

- One list titled “Projects” generated from `assets/js/filesystem.js`.
- “Active projects” and “Archive” sections only.
- Each row linked straight to the tool or download.
- No status, version, last-updated date, stack, category, preview image, follow state, or detail page.

**New**

- A real catalogue with **7 projects**.
- Status badges: **Stable**, **Experimental**, **Archived**.
- Version, last-updated date, stack, and category on every card.
- Project preview images for Crypto Toolkit, AI Writer, Portfolio Projection, and Vigenère Tool.
- Explicit placeholders for projects without a screenshot (`IN DEVELOPMENT`, `SOURCE ARCHIVE`, `ARCHIVED`).
- Direct **launch/download** action plus **View project & history**.
- **Follow** button per project, stored in `localStorage`.
- Filters: All, Stable, Experimental, Archived, Following, with live counts.
- Separate archive block in the All view.
- Archived projects are clearly marked instead of looking active.

### Project detail — new page

The old site had no project detail pages. Project rows went directly to the software.

The new `/project?id=<id>` page includes:

- Status, version, release date, last-updated date, stack, and category.
- Short overview and “What it is”.
- Capabilities / feature list.
- **Development history** timeline: concept, prototype, release, next step.
- Related ATLS publication.
- Project metadata panel, including source availability.
- Follow / unfollow control.
- **Request a feature** and **Send a message** links that pre-fill the project context.
- “More projects” links.
- Unknown IDs render a proper “project not found” state.

### ATLS — Publications

**Old**

- A single “Articles” index generated from `filesystem.js`.
- Published and archive lists.
- No types, filters, reading times, project cross-links, or scope explanation.

**New**

- Renamed to **Technical publications**.
- Publication types: Release Note, Technical, Design, Research, Tutorial, Retrospective, Archive.
- Type badges and reading-time labels on each entry.
- Type filters with counts.
- Project label on entries that belong to a project.
- Archive kept in its own block.
- Scope strip explaining what ATLS publishes.
- New publication: **Ideas Become Software** (Nov 27, 2026).
- Existing entries keep their original article text but now carry catalogue metadata.

### UPDATES — Release log — new page

The old site had no release log.

The new `/updates` page combines:

- Project updates from each project’s `updates` array.
- ATLS publication entries.
- One chronological feed, newest first.
- Filters: All, Project Updates, ATLS, Following.
- Live counts for each filter.
- Following state shared with the project catalogue.
- Empty states that explain how to follow a project.

This is the page that makes “following a project” visible.

### Requests

**Old**

- Feature request form.
- No project context.

**New**

- Project dropdown populated from the catalogue.
- `?project=<id>` pre-fills the selection.
- The selected project’s title, status, and version are added to the message body.
- Project context also appears in the UI before sending.
- Existing Firebase archive copy remains best-effort; the mail relay remains the delivery path.

### Contact

**Old**

- Direct message form.
- No project context.

**New**

- `?project=<id>` pre-fills the subject with “Regarding …”.
- Project name and ID are added to the message body.
- A project note appears under the subject field.
- Existing Firebase archive copy remains best-effort; the mail relay remains the delivery path.

### Account / login

**Old**

- Public **ACCOUNT ↗** link in the topbar on every page.
- Public login page.
- Homepage quick link labelled **ACCOUNT / Minescout Life**.

**New**

- **ACCOUNT ↗** removed from every public topbar.
- Homepage quick link changed to **ECOSYSTEM / Minescout Life**.
- `/login` is now an unlinked, `noindex` **Admin sign-in** page.
- It remains only because the unlinked admin inbox uses it for authentication.
- No public account entry point remains.

### 404

**Old**

- Existing 404 page.

**New**

- Same 404 design.
- Navigation updated to include UPDATES and remove the account link.
- Topbar now carries the “Independent Software Lab” label.

### Admin inbox

**Old**

- Unlinked admin message page with an `EXIT ↗` link.
- Broken logo path.

**New**

- Still unlinked and internal.
- Marked `noindex,nofollow`.
- Logo path corrected.
- Uses the admin-only sign-in page.

---

## 5. New vs old at a glance

| Area | Old | New |
| --- | --- | --- |
| Identity | “Tools, experiments, and things worth building.” | “Ideas become software.” Independent software lab. |
| Navigation | Home, ATLS, PRDS, Requests, Contact, Account | Home, ATLS, PRDS, **Updates**, Requests, Contact |
| Account | Public login and account link | Removed from public UI; admin-only unlinked sign-in |
| Projects | 5 active + 1 archive, flat list | 7 projects with status, version, dates, stack, previews, follow |
| Project detail | None | Full detail page with history and related ATLS |
| Project status | “Active” / “Archive” only | Stable / Experimental / Archived |
| ATLS | Flat article list | Typed publications with filters, reading time, project links |
| Article pages | Secondary sticky navigation bar | Main topbar plus one **← ATLS / PUBLICATIONS** back link |
| Visual system | Mixed card and panel treatments | Square editorial rules, open lists, shared 1120px measure |
| Release log | None | Combined project + ATLS feed with filters |
| Follow | None | Browser-local follow state, reflected in the release log |
| “Since last visit” | Calculated but not shown | Rendered on the homepage |
| Data model | `assets/js/filesystem.js` | `assets/js/catalog.js` |
| Stylesheet | `style.css?v=12` | `style.css?v=18` |
| Project images | None in the catalogue | Four project screenshots plus placeholders |
| Requests/contact | Generic forms | Project-aware forms with `?project=` prefill |
| Admin pages | Unlinked but indexable | Unlinked, `noindex`, corrected asset path |
| New article | — | “Ideas Become Software” |
| Data fixes | Mismatched article dates; Cognisearch “73 MB” | Dates aligned to article content; package label corrected to **73 KB** |

---

## 6. Data model — `assets/js/catalog.js`

`catalog.js` is the single source of truth for PRDS, ATLS, and the release log. It is loaded by the home, catalogue, project detail, publications, updates, requests, and contact pages.

### Statuses

```js
STATUS = {
  stable:       { label: 'STABLE',       meaning: 'Working, published software' },
  experimental: { label: 'EXPERIMENTAL', meaning: 'Actively being developed or tested' },
  archived:     { label: 'ARCHIVED',     meaning: 'No longer actively maintained' }
}
```

### Publication types

`release`, `technical`, `design`, `research`, `tutorial`, `retrospective`, `archive`.

### Project fields

`id`, `title`, `shortTitle`, `tagline`, `summary`, `status`, `version`, `released`, `updated`, `category`, `stack`, `image`, `launch`, `docs`, `source`, `note`, `features`, `history`, `updates`.

Key distinction:

- `released` = when the current version shipped.
- `updated` = when the catalogue entry last changed.

### Article fields

`id`, `title`, `href`, `date`, `summary`, `types`, `project`, `read`.

### Activity

`activity()` derives a single feed from:

- Every project’s `updates` entries (kind: `project`).
- Every article (kind: `article`).

The feed is sorted newest first. `recentActivity(since, limit)` powers the homepage “since last visit” block.

### Helpers

`formatDate`, `getProject`, `getArticle`, `statusBadge`, `typeBadge`, `followedIds`, `isFollowed`, `toggleFollow`, `activity`, `recentActivity`, `projectsByStatus`.

### Browser storage

| Key | Purpose |
| --- | --- |
| `ms_followed_projects` | Followed project IDs |
| `minescout_last_visit` | Timestamp for “since your last visit” |

There is no server-side account or subscription state.

### Legacy data

`assets/js/filesystem.js` still exists and is used only by the archived AI News Synthesis article. It is no longer the source of truth for the catalogue.

---

## 7. Design and UI

The terminal/archive aesthetic is retained:

- Charcoal surfaces, thin borders, warm orange accent, restrained green.
- JetBrains Mono throughout.
- Dense metadata, numbered rows, terminal-style labels.
- Responsive layout at mobile (390px) and tablet (900px).

UI v14 is the current editorial pass:

- Square edges and open rules replace most rounded cards and dashed panels.
- One topbar and one footer across the public site; content, topbar, and footer share the same 1120px measure.
- The homepage uses a typographic hero, a three-part lab statement, a featured release, and open publication/activity lists.
- Project cards keep a bordered preview because they are catalogue items; project detail pages use open sections and a quiet metadata rail.
- Article pages use the main site topbar plus a single **← ATLS / PUBLICATIONS** back link. There is no second article navigation bar.
- Article typography is a publication layout: generous title scale, a dated rule, readable 70-character body measure, section rules, pull quotes, step lists, and timelines.
- Publication and release-log rows are open lists separated by rules rather than stacked cards.
- Forms are single quiet containers with square fields and full-width primary actions.
- The 404 page is vertically centred and uses the shared footer.
- Project previews were recaptured from the current tools, so no stale **ACCOUNT** control appears in the screenshots.
- `.top-note` label on the right side of the public topbar: **INDEPENDENT SOFTWARE LAB**.
- Mobile rules hide `.top-note`, keep the nav scrollable, and collapse the three-part lab statement and metadata grids.

The stylesheet cache key is now `v=18`; the catalogue script is loaded as `catalog.js?v=2`.

---

## 8. Routing and hosting

- Static site, no build step.
- Clean URLs (`/projects`, `/pages`, `/updates`, `/project?id=…`).
- Existing server rewrite maps extensionless paths to `.html`.
- `_headers` supplies the security headers (CSP, frame options, HSTS, etc.).
- Cloudflare Pages-compatible.
- The preview server mirrors the production clean-URL behaviour and serves `404.html` for unknown paths.

The project detail page is client-rendered from `project.html?id=<id>` because there is no build step or server-side template layer.

---

## 9. Files changed or added

### New files

- `assets/js/catalog.js` — shared catalogue model.
- `project.html` — project detail page.
- `updates.html` — release log.
- `content/articles/ideas-become-software.html` — new direction article.
- `assets/images/projects/crypto-toolkit.png`
- `assets/images/projects/ai-writer.png`
- `assets/images/projects/portfolio-tool.png`
- `assets/images/projects/vigenere-tool.png`

### Reworked pages

- `index.html`
- `pages.html`
- `projects.html`
- `feature-requests.html`
- `email.html`
- `404.html`
- `login.html`
- `admin-messages.html`

### Shared updates

- `assets/css/style.css` — new catalogue, detail, publication, release-log, topbar, and article typography styles.
- `assets/js/article-nav.js` — removed. Articles now use the main topbar and a plain back link; the separate article navigation bar is gone.
- Topbar navigation on every article and project page: added UPDATES, removed ACCOUNT, added the lab label.

### Unchanged legacy files

- `assets/js/filesystem.js`
- `assets/js/terminal-core.js`
- `assets/js/auth.js`
- Existing zip bundles and archived material.

---

## 10. QA / verification

Current checks:

- All key routes return **200**.
- **324** internal links checked, **0** broken. The only non-resolving value is the AI Writer's `about:blank` preview target, which is intentional.
- HTML tag balance clean across all pages.
- Mobile (390px), tablet (900px), and desktop (1280px) topbar/layout checked.
- Article pages checked with and without the removed secondary navigation bar.
- Data integrity: **7 projects**, **8 articles**, **15 activity items**.
- Article dates now match the dates printed inside the articles.
- Cognisearch download label corrected from **73 MB** to **73 KB** to match the actual archive.
- No account link remains in any public topbar or project preview.
- Admin pages are `noindex`.

---

## 11. Current constraints

- Following and “since last visit” are **browser-local**; they do not sync across devices.
- The contact and request forms still rely on the external mail relay at `life.minescout.net/api/mail`; a relay failure shows a send error.
- Firebase archive copies are best-effort and do not block the mail send.
- Project previews are static screenshots, not live embeds.
- The admin sign-in page remains for the internal inbox even though the public account feature is gone.
- Clean URLs require the existing server rewrite; opening raw `.html` files directly will not match production routing.

---

## 12. Quick test path

1. Open `/`.
2. Go to **PRDS**.
3. Open **Minescout Crypto Toolkit**.
4. Press **FOLLOW FOR UPDATES**.
5. Go to **UPDATES** and choose **FOLLOWING**.
6. Return to **ATLS** and filter by **DESIGN**.
7. Open **Ideas Become Software**.
8. Open a project and press **REQUEST A FEATURE** to see the pre-filled project context.
9. Reload the homepage to see the “since your last visit” behaviour.

---

*This document describes the working tree as of November 27, 2026. No commit or GitHub push has been made.*
