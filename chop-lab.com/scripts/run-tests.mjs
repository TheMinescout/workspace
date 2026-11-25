#!/usr/bin/env node
/**
 * Run both Chop Lab test stages even when one stage fails.
 *
 * The script tests currently carry a documented baseline. Chaining the stages
 * with "&&" meant those failures prevented the app tests from running at all.
 * CI applies the baseline policy; local npm test still reports both suites.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const stages = [
  {
    name: "script tests",
    args: ["--test", "--test-reporter=tap", "scripts/**/*.test.mjs"],
  },
  {
    name: "app tests",
    args: ["--experimental-strip-types", "--test", "src/lib/**/*.test.ts"],
  },
];

let failed = false;
for (const stage of stages) {
  console.log(`\n=== Chop Lab ${stage.name} ===\n`);
  const result = spawnSync(process.execPath, stage.args, {
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
