# The Minescout Workspace

This repository contains the web properties and experiments behind **The Minescout**: the main Minescout portfolio and services site, Minescout Life, the Minescout Beta environment, and The Chop Lab.

The workspace is organized as separate site projects rather than a single application. Each site has its own runtime, build process, and deployment shape, while the repository provides a shared home for the ecosystem.

## Sites

| Site | Purpose | Implementation |
| --- | --- | --- |
| [minescout.net](https://minescout.net) | Thomas Carleton’s personal portfolio and project hub. | Static HTML/CSS/JavaScript SPA served from `minescout.net/public` |
| [life.minescout.net](https://life.minescout.net) | Personal publishing and project site for posts, categories, experiments, and administration. | React 19 + Vite + React Router, with Firebase-backed features |
| [beta.minescout.net](https://beta.minescout.net) | Experimental and staging site for testing new Minescout features and interfaces. | Static HTML pages with clean-URL Nginx routing |
| [chop-lab.com](https://chop-lab.com) | The Chop Lab storefront and tooling for custom ceramic tools, 3D-printing work, files, drawings, and consultations. | React + TypeScript + Vite + TanStack Start/Router |

## Repository layout

```text
workspace/
├── minescout.net/       # Main static Minescout site
│   └── public/          # Deployed site files and assets
├── life.minescout.net/  # React/Vite Minescout Life application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       └── pages/
├── beta.minescout.net/  # Static beta/staging site
├── chop-lab.com/        # Chop Lab React/TanStack application
│   ├── public/
│   ├── scripts/
│   ├── server/
│   └── src/
│       ├── components/
│       ├── lib/
│       └── routes/
├── my-sites.conf        # Nginx virtual-host and proxy configuration
└── README.md
```

## Minescout (`minescout.net`)

The main site is a lightweight, asset-based SPA. Its HTML entry point mounts the application at `#app` and loads the client from `public/app.js`; styling, images, and other static resources live alongside it in `public`.

The site presents a personal portfolio and project hub rather than a framework-driven server application. Nginx serves real files from `minescout.net/public` and falls back to `index.html` for application routes. The `/ai/` and `/services/` paths are explicitly supported as SPA routes while static assets receive browser caching headers.

## Minescout Life (`life.minescout.net`)

Minescout Life is now a React application rather than the older collection of injected HTML fragments described by the previous README. It uses Vite for development and production builds, React Router for navigation, Firebase for application data and authentication, and TipTap for rich-text editing.

Current route areas include:

- Home page
- Login and administrator pages
- Individual posts at `/post/:id`
- Category pages for coding projects, tech tips, updates, puppy life, the Minecraft server, beta, stats, and feature requests
- A not-found page for unknown routes

The application source is grouped into reusable components, data helpers, hooks, and page components. The admin area supports managing site content, while the public experience focuses on posts and category browsing.

### Local development

```bash
cd life.minescout.net
npm install
npm run dev
```

Useful checks and build commands:

```bash
npm run lint
npm run build
npm run preview
```

## Minescout Beta (`beta.minescout.net`)

The beta site is a static experimental environment. It includes the terminal-style interface and supporting pages for projects, feature requests, login, email, admin messages, and content. The beta directory also contains shared assets and content data used by those pages.

Nginx provides clean URLs for the beta deployment:

- `/index.html` redirects to `/`
- Legacy `.html` URLs redirect to extensionless paths
- Extensionless paths resolve to their matching `.html` files
- Missing pages use `404.html`

Because beta is an experimental environment, features and page structure may change more frequently than the production sites.

## The Chop Lab (`chop-lab.com`)

The Chop Lab is the most application-heavy project in the workspace. It is a typed React application using TanStack Start/Router, Vite, Tailwind CSS, Radix UI components, and a server/data layer built around Kysely, PostgreSQL, and PGlite. Three.js is included for browser-based 3D and model-preview experiences.

The current route structure includes:

- Home and shared application layout
- About, FAQ, and consultation flows
- Product configuration
- Engineering drawings and file handling
- Invoices
- Tool catalogue and individual tool pages

Reusable UI and domain components include product cards, chop previews, STL thumbnails, texture swatches, blueprint viewers, tool drawings, consultation forms, and preview-host integration. Database migrations and application scripts live in `migrations/` and `scripts/`.

### Local development

```bash
cd chop-lab.com
npm install
npm run dev
```

Available project commands include:

```bash
npm run build
npm run preview
npm run typecheck
npm test
npm run lint
npm run format
```

The development server runs on port `8080` by default. The build also runs the database migration step, so configure the required application/database environment before building a deployment image or release.

## Deployment topology

`my-sites.conf` documents the current Nginx layout:

- **Minescout Life** is proxied to the Vite/application server on port `3000`, including WebSocket support and `/api/` and `/data/` routes.
- **Minescout Beta** is served as static content from `/usr/share/nginx/html/beta.minescout.net` with clean-URL rewrites.
- **The Chop Lab** is proxied to its application server on port `8080`, including Vite HMR/WebSocket headers.
- **Minescout** is served from `/usr/share/nginx/html/minescout.net/public` with SPA fallback behavior.
- Unknown hosts and direct-IP requests are rejected by the default server.

The configuration should be treated as deployment documentation as well as server configuration: local ports, static roots, API behavior, and cross-origin access between Life and Beta are defined there.

## Technology overview

- **Frontend:** JavaScript, React, TypeScript, HTML, and CSS
- **Build tools:** Vite, TanStack Start/Router, TypeScript, Oxlint, ESLint, and Prettier
- **Minescout Life:** React Router, Firebase, and TipTap
- **The Chop Lab:** TanStack Router, Tailwind CSS, Radix UI, Three.js, Kysely, PostgreSQL, and PGlite
- **Hosting/proxying:** Nginx with static hosting and reverse-proxy virtual hosts

## Contributing and maintenance

Each site is independently runnable from its own directory. When changing a site:

1. Work from that site’s directory.
2. Install dependencies with `npm install` if needed.
3. Run its development server and the relevant lint, typecheck, test, or build commands.
4. Check route behavior and deployment assumptions in `my-sites.conf` before releasing.

Dependencies should be installed per project; generated dependency directories such as `node_modules` should not be used as application source.

## Contact

- **Minescout:** thomas@minescout.net
- **The Chop Lab:** thomas@chop-lab.com
- **Minescout Life and Beta:** theminescout@minescout.net

© 2026 The Minescout ecosystem and The Chop Lab.
