#!/usr/bin/env node
/**
 * Run every Chop Lab script and app test file.
 *
 * Keep the stages separate and continue after a failure so a red script suite
 * cannot prevent the app suites from running (or vice versa). Discover files
 * explicitly so a misspelled or empty glob cannot turn into a zero-test pass.
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function discoverTests(directory, suffix) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return discoverTests(path, suffix);
      return entry.isFile() && entry.name.endsWith(suffix) ? [relative(ROOT, path)] : [];
    })
    .sort();
}

const stages = [
  {
    name: "script tests",
    files: discoverTests(join(ROOT, "scripts"), ".test.mjs"),
    args: ["--test", "--test-reporter=tap"],
  },
  {
    name: "app tests",
    files: discoverTests(join(ROOT, "src/lib"), ".test.ts"),
    args: ["--experimental-strip-types", "--test"],
  },
];

let failed = false;
for (const stage of stages) {
  console.log(`\n=== Chop Lab ${stage.name} ===\n`);
  if (stage.files.length === 0) {
    console.error(`No ${stage.name} files were discovered.`);
    failed = true;
    continue;
  }

  const result = spawnSync(process.execPath, [...stage.args, ...stage.files], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`Could not start ${stage.name}:`, result.error);
    failed = true;
  } else if (result.status !== 0) {
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
