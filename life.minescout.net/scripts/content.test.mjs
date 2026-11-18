// Unit tests for the post-body render helper. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { wrapContentTables } from "../src/lib/content.js";

test("wraps a table in a scroll container", () => {
  const out = wrapContentTables("<p>hi</p><table><tr><td>x</td></tr></table>");
  assert.equal(out, '<p>hi</p><div class="table-container"><table><tr><td>x</td></tr></table></div>');
});

test("wraps every table, not just the first", () => {
  const out = wrapContentTables("<table><tr><td>a</td></tr></table><p>mid</p><table><tr><td>b</td></tr></table>");
  assert.equal((out.match(/table-container/g) || []).length, 2);
});

test("keeps table attributes", () => {
  const out = wrapContentTables('<table class="x"><tr><td>a</td></tr></table>');
  assert.match(out, /<div class="table-container"><table class="x">/);
});

test("leaves content without tables untouched", () => {
  const html = "<p>no table here</p>";
  assert.equal(wrapContentTables(html), html);
});

test("handles empty and missing input", () => {
  assert.equal(wrapContentTables(""), "");
  assert.equal(wrapContentTables(undefined), undefined);
});
