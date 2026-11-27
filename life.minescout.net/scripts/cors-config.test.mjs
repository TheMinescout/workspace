import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const CONFIG = new URL("../../my-sites.conf", import.meta.url);

test("nginx leaves /api/ CORS to the relay", async () => {
  const conf = await readFile(CONFIG, "utf8");
  const block = conf.match(/location \/api\/ \{[\s\S]*?\n {4}\}/)?.[0] ?? "";
  assert.ok(block, "the /api/ location block is present");
  // A fixed origin here makes every other site fail the preflight; the relay
  // echoes the caller's origin from ALLOWED_ORIGINS instead.
  assert.doesNotMatch(block, /Access-Control-Allow-Origin/);
});
