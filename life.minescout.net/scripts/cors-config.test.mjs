import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const CONFIG = new URL("../../my-sites.conf", import.meta.url);

test("nginx does not pin /api/ CORS to one origin", async () => {
  const conf = await readFile(CONFIG, "utf8");
  const block = conf.match(/location \/api\/ \{[\s\S]*?\n {4}\}/)?.[0] ?? "";
  assert.ok(block, "the /api/ location block is present");
  // A quoted origin here makes every other site fail the preflight. nginx may
  // only echo the allowlisted caller through $cors_origin, and only for OPTIONS;
  // the relay sets the header on proxied responses.
  assert.doesNotMatch(block, /Access-Control-Allow-Origin\s+"https?:/);
  assert.match(block, /Access-Control-Allow-Origin\s+\$cors_origin/);
  assert.match(conf, /map \$http_origin \$cors_origin/);
});
