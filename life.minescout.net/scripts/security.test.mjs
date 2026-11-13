// Unit tests for the post-body HTML sanitizer. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml, isSafeAssetUrl } from "../server/security.js";

test("drops script, iframe and other dangerous tags", () => {
  const out = sanitizeHtml('<p>hi</p><script>alert(1)</script><iframe src="//evil"></iframe>');
  assert.ok(!/script/i.test(out));
  assert.ok(!/iframe/i.test(out));
  assert.match(out, /<p>hi<\/p>/);
});

test("strips event handlers and javascript: URLs", () => {
  const out = sanitizeHtml('<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">x</a>');
  assert.ok(!/onerror/i.test(out));
  assert.ok(!/javascript:/i.test(out));
});

// A browser removes ASCII whitespace/control chars from a URL before resolving
// the scheme, so these all navigate as javascript:. The scheme test must catch
// the de-obfuscated form, or the payload survives and fires on click.
test("strips whitespace-obfuscated javascript: URLs", () => {
  for (const scheme of ["java\nscript:", "java\tscript:", "java\rscript:", "java&#10;script:", "java  script:"]) {
    const out = sanitizeHtml(`<a href="${scheme}alert(1)">x</a>`);
    assert.ok(!/href/i.test(out), `href survived for ${JSON.stringify(scheme)}: ${out}`);
  }
});

test("keeps ordinary links and relative asset paths", () => {
  const out = sanitizeHtml('<a href="/post/other">next</a><img src="/assests/images/x.png">');
  assert.match(out, /href="\/post\/other"/);
  assert.match(out, /src="\/assests\/images\/x\.png"/);
});

test("isSafeAssetUrl accepts local and https paths, rejects script/data schemes", () => {
  assert.equal(isSafeAssetUrl("/assests/images/x.png"), true);
  assert.equal(isSafeAssetUrl("https://life.minescout.net/x.png"), true);
  for (const bad of ["javascript:alert(1)", "data:text/html,<script>", "//evil.com/x.png", ""]) {
    assert.equal(isSafeAssetUrl(bad), false, `expected ${JSON.stringify(bad)} to be rejected`);
  }
});
