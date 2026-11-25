// Turns a manifest entry into real head tags, and a shell document into a
// prerendered page. index.html stays the hand-written document shell; every
// other route is that shell with its own metadata swapped in, so a crawler
// gets the page's title, description, canonical, robots and structured data
// without running the SPA.
import { join } from "node:path";

import { PUBLIC_DIR, PRERENDER_MARKER } from "./discover.mjs";

/** Head tags this tooling owns. index.html keeps everything else. */
const OWNED_TAGS = [
  /<title[^>]*>[\s\S]*?<\/title>\s*/gi,
  /<meta[^>]*name=["']description["'][^>]*>\s*/gi,
  /<meta[^>]*name=["']robots["'][^>]*>\s*/gi,
  /<meta[^>]*property=["']og:[a-zA-Z_:]+["'][^>]*>\s*/gi,
  /<meta[^>]*name=["']twitter:[a-zA-Z_:]+["'][^>]*>\s*/gi,
  /<link[^>]*rel=["']canonical["'][^>]*>\s*/gi,
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
];

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Serialize JSON-LD without letting "</script>" end the block early. */
function escapeJsonLd(value) {
  return JSON.stringify(value, (key, item) => (item === undefined ? undefined : item)).replace(/<\//g, "<\\/");
}

/** The metadata block for one page, in a fixed order. */
export function renderHead(page) {
  const lines = [
    `<title>${escapeAttribute(page.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(page.description)}" />`,
    `<meta name="robots" content="${escapeAttribute(page.robots)}" />`,
    `<link rel="canonical" href="${escapeAttribute(page.canonical)}" />`,
    `<meta property="og:type" content="${escapeAttribute(page.ogType)}" />`,
    `<meta property="og:site_name" content="${escapeAttribute(page.siteName ?? "Minescout")}" />`,
    `<meta property="og:title" content="${escapeAttribute(page.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttribute(page.ogDescription)}" />`,
    `<meta property="og:url" content="${escapeAttribute(page.url)}" />`,
    `<meta property="og:image" content="${escapeAttribute(page.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (page.jsonLd) {
    lines.push(`<script type="application/ld+json">${escapeJsonLd(page.jsonLd)}</script>`);
  }
  return lines.join("\n  ");
}

/** Strip the tags this tooling owns, leaving the rest of the shell untouched. */
export function stripOwnedHead(html) {
  return OWNED_TAGS.reduce((out, pattern) => out.replace(pattern, ""), html);
}

/**
 * Build the prerendered document for a page: the shell with its metadata block
 * replaced. Output is deterministic, so `--check` can compare byte for byte.
 */
export function renderShell(shellHtml, page) {
  const stripped = stripOwnedHead(shellHtml);
  const close = stripped.toLowerCase().lastIndexOf("</head>");
  if (close === -1) throw new Error("shell has no </head>");
  const before = stripped.slice(0, close).replace(/\s+$/, "");
  const after = stripped.slice(close);
  // Metadata goes last so the shell's charset and viewport stay first.
  return `${before}\n\n  <!-- ${PRERENDER_MARKER} path=${page.path} -->\n  ${renderHead(page)}\n${after}`;
}

/** Where a route's prerendered document lives, relative to public/. */
export function shellFile(path) {
  if (path === "/") return null;
  if (path.endsWith(".html")) return path.replace(/^\//, "");
  return join(path.replace(/^\//, ""), "index.html");
}

export function shellPath(path) {
  const file = shellFile(path);
  return file ? join(PUBLIC_DIR, file) : null;
}
