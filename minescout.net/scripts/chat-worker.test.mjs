// Guards the contract the sites share with the thomas-chat Cloudflare Worker.
// Every case here is a real production failure (Nov 2026): the sites were still
// sending a v6 payload to a v7 worker, and the smoke test stubs the worker, so
// CI could not see it.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), "utf8");

/** Every file in the repo that talks to the worker. */
const CALLERS = {
  "minescout.net/public/app.js": read("minescout.net/public/app.js"),
  "minescout.net/public/studio/chat-config/index.html": read(
    "minescout.net/public/studio/chat-config/index.html",
  ),
  "life.minescout.net/src/components/Sidebar.jsx": read("life.minescout.net/src/components/Sidebar.jsx"),
  "life.minescout.net/src/pages/Admin.jsx": read("life.minescout.net/src/pages/Admin.jsx"),
  "beta.minescout.net/assets/js/terminal-core.js": read("beta.minescout.net/assets/js/terminal-core.js"),
  "beta.minescout.net/content/projects/js/ai-writer.js": read(
    "beta.minescout.net/content/projects/js/ai-writer.js",
  ),
};

const WORKER = "thomas-chat.tmcarleton11.workers.dev";

/** The tasks the worker has a SYSTEM_PROMPTS entry (and a token budget) for. */
const TASKS = new Set([
  "cms-chat",
  "studio-builder",
  "pricing-quiz",
  "roi-analysis",
  "site-coder",
  "life-insight",
]);

for (const [file, source] of Object.entries(CALLERS)) {
  test(`${file} speaks the worker's v7 contract`, async (t) => {
    await t.test("does not send a client-supplied system prompt or client_id", () => {
      assert.equal(
        /system_override/.test(source),
        false,
        "the worker answers 400 to `system_override`; fold it into the leading user message",
      );
      assert.equal(
        /\bclient_id\b/.test(source),
        false,
        "the worker answers 403 unless the id is in ALLOWED_CLIENT_IDS and STUDIO_KV holds its record",
      );
    });

    await t.test("only ever POSTs to the worker", () => {
      assert.match(source, new RegExp(WORKER), "expected a worker URL in this file");
      assert.match(
        source,
        /method:\s*['"]POST['"]/,
        "a worker call without an explicit POST is a GET, which answers 405",
      );
      // A prompt smuggled through the query string means a GET.
      assert.equal(/(?:holo|ask|\/)\?prompt=/.test(source), false);
    });

    await t.test("checks res.ok before parsing the body", () => {
      assert.match(
        source,
        /(?:res|response|r)\.ok/,
        "a 400 body has no `.content`; the status has to be checked, not parsed",
      );
    });

    await t.test("reads the worker's `content` field", () => {
      assert.match(source, /\.content/);
    });
  });
}

test("the pricing quiz asks for task=pricing-quiz", () => {
  const app = CALLERS["minescout.net/public/app.js"];
  assert.match(app, /task:\s*['"]pricing-quiz['"]/);
});

test("the ROI verdict asks for task=roi-analysis", () => {
  const app = CALLERS["minescout.net/public/app.js"];
  assert.match(app, /task:\s*['"]roi-analysis['"]/);
});

test("the site builder asks for task=studio-builder", () => {
  const app = CALLERS["minescout.net/public/app.js"];
  assert.match(app, /task:\s*['"]studio-builder['"]/);
});

test("every task the sites ask for exists in the worker", () => {
  for (const [file, source] of Object.entries(CALLERS)) {
    const found = [...source.matchAll(/task:\s*['"]([a-z-]+)['"]/g)].map((m) => m[1]);
    for (const task of found) {
      assert.ok(TASKS.has(task), `${file} asks for unsupported task "${task}"`);
    }
  }
});

test("a failed worker call is never dressed up as a real answer", () => {
  const app = CALLERS["minescout.net/public/app.js"];
  // The ROI page used to print "strong return on investment" no matter what the
  // numbers said, because it was the `data.content || …` fallback.
  assert.equal(
    /selected plan offers a strong return on investment/.test(app),
    false,
    "the ROI fallback must respect the sign of the projected net",
  );
  assert.match(app, /isNegative\s*\?/);
});
