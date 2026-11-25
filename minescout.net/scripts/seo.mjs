#!/usr/bin/env node
// SEO metadata tooling for minescout.net.
//
//   node scripts/seo.mjs inventory            page inventory and metadata, to stdout
//   node scripts/seo.mjs build                dry run: what would change
//   node scripts/seo.mjs build --write        write public/seo/manifest.json + prerendered pages
//   node scripts/seo.mjs report [--write]     refresh seo/INVENTORY.md
//   node scripts/seo.mjs check                validation + "is the committed output current?" (CI)
//
// Writes are opt-in: without --write nothing on disk changes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import {
  SITE_ROOT,
  discoverPages,
  readIndexHtml,
  readRobots,
  readSitemap,
} from "./seo/discover.mjs";
import { parseHead } from "./seo/html.mjs";
import { buildManifest } from "./seo/metadata.mjs";
import { REPORT_FILE, headDrift, planFiles } from "./seo/plan.mjs";
import { renderReport } from "./seo/report.mjs";
import { summarize, validate } from "./seo/validate.mjs";

const OVERRIDES_FILE = join(SITE_ROOT, "seo/overrides.json");

const args = process.argv.slice(2);
const command = args[0] ?? "check";
const write = args.includes("--write");

function rel(file) {
  return relative(SITE_ROOT, file);
}

async function load() {
  const overrides = JSON.parse(readFileSync(OVERRIDES_FILE, "utf8"));
  const pages = await discoverPages();
  const shellHtml = readIndexHtml();
  const shellHead = parseHead(shellHtml);
  const { manifest, errors } = buildManifest({ pages, overrides, shellHead, site: overrides.site });
  const sitemap = readSitemap();
  const robots = readRobots();
  const issues = validate({ manifest, pages, sitemap, robots, buildErrors: errors });
  return { overrides, pages, manifest, shellHtml, shellHead, sitemap, robots, issues };
}

function printIssues(issues) {
  const { errors, warnings } = summarize(issues);
  for (const entry of errors) console.log(`error  ${entry.path ?? "site"}  ${entry.message}`);
  for (const entry of warnings) console.log(`warn   ${entry.path ?? "site"}  ${entry.message}`);
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  return errors.length;
}

async function main() {
  const state = await load();

  if (command === "inventory") {
    console.log(`${state.manifest.pages.length} pages\n`);
    for (const page of state.manifest.pages) {
      const flag = page.indexable ? (page.released ? "index" : "sched") : "noindex";
      const lengths = `${page.title.length}/${page.description.length}`;
      console.log(`${flag.padEnd(8)} ${page.path.padEnd(44)} ${lengths.padStart(7)}  ${page.source}`);
    }
    printIssues(state.issues);
    return;
  }

  if (command === "report") {
    const text = renderReport({ manifest: state.manifest, pages: state.pages, issues: state.issues, sitemap: state.sitemap });
    if (write) {
      writeFileSync(REPORT_FILE, text);
      console.log(`wrote ${rel(REPORT_FILE)}`);
    } else {
      console.log(text);
    }
    return;
  }

  if (command === "build") {
    const files = planFiles(state);
    const changed = files.filter((entry) => entry.status !== "unchanged");
    console.log(`${state.manifest.pages.length} pages discovered, ${files.length} generated files`);
    for (const entry of changed) console.log(`  ${entry.status.padEnd(7)} ${entry.label.padEnd(8)} ${rel(entry.file)}`);
    if (!changed.length) console.log("  nothing to write");
    printIssues(state.issues);
    if (write) {
      for (const entry of changed) {
        mkdirSync(dirname(entry.file), { recursive: true });
        writeFileSync(entry.file, entry.content);
      }
      console.log(`\nwrote ${changed.length} file(s)`);
    } else {
      console.log("\ndry run: re-run with --write to apply");
    }
    return;
  }

  if (command === "check") {
    const files = planFiles(state);
    const stale = files.filter((entry) => entry.status !== "unchanged");
    const drift = headDrift(state);
    const errors = printIssues(state.issues);

    for (const entry of stale) {
      const verb = entry.status === "create" ? "missing" : "stale";
      console.log(`error  generated  ${rel(entry.file)} is ${verb}; run npm run seo:build`);
    }
    for (const problem of drift) console.log(`error  document  ${problem}`);
    if (stale.length || drift.length) {
      console.log(`\n${stale.length} stale generated file(s), ${drift.length} document problem(s)`);
    }

    if (errors || stale.length || drift.length) process.exitCode = 1;
    else console.log("\nmetadata checks passed");
    return;
  }

  console.error(`unknown command "${command}"`);
  process.exitCode = 2;
}

await main();
