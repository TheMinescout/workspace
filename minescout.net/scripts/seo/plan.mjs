// Works out which generated files the site needs and whether the committed
// copies still match. Shared by the CLI and the test suite so "is it current?"
// means the same thing in both.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PUBLIC_DIR, SITE_ROOT } from "./discover.mjs";
import { renderShell, shellPath } from "./prerender.mjs";

export const MANIFEST_FILE = join(PUBLIC_DIR, "seo/manifest.json");
export const REPORT_FILE = join(SITE_ROOT, "seo/INVENTORY.md");

export function manifestText(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function status(file, content) {
  if (!existsSync(file)) return "create";
  return readFileSync(file, "utf8") === content ? "unchanged" : "update";
}

/**
 * The manifest plus one prerendered document per SPA route. Standalone
 * documents already ship real HTML, so they are validated, never rewritten.
 */
export function planFiles({ manifest, shellHtml }) {
  const files = [{ file: MANIFEST_FILE, content: manifestText(manifest), label: "manifest" }];
  for (const page of manifest.pages) {
    if (page.kind === "studio-app" || page.path === "/" || page.path === "/404") continue;
    if (page.sourceFile?.endsWith(".html")) continue;
    const file = shellPath(page.path);
    if (!file) continue;
    files.push({
      file,
      content: renderShell(shellHtml, { ...page, siteName: manifest.site.name }),
      label: "page",
    });
  }
  return files.map((entry) => ({ ...entry, status: status(entry.file, entry.content) }));
}

/**
 * Places where a hand-written document has to agree with the manifest: the
 * home page head in index.html, and the head of every standalone page.
 */
export function headDrift({ manifest, pages, shellHead }) {
  const problems = [];
  const compare = (where, label, expected, actual) => {
    if (expected !== actual) problems.push(`${where} ${label}: manifest "${expected}", document "${actual}"`);
  };

  const home = manifest.pages.find((page) => page.path === "/");
  compare("index.html", "title", home.title, shellHead.title);
  compare("index.html", "description", home.description, shellHead.description);
  compare("index.html", "canonical", home.canonical, shellHead.canonical);
  compare("index.html", "robots", home.robots, shellHead.robots);
  compare("index.html", "og:title", home.ogTitle, shellHead.ogTitle);
  compare("index.html", "og:description", home.ogDescription, shellHead.ogDescription);
  compare("index.html", "og:url", home.url, shellHead.ogUrl);

  for (const page of manifest.pages) {
    const source = pages.find((entry) => entry.path === page.path);
    if (!source?.head) continue;
    compare(page.path, "title", page.title, source.head.title);
    compare(page.path, "description", page.description, source.head.description);
    compare(page.path, "canonical", page.canonical, source.head.canonical);
    compare(page.path, "robots", page.robots, source.head.robots);
  }

  return problems;
}
