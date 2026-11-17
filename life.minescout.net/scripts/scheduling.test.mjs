// Unit tests for the shared post-scheduling logic. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseShowDate, publishTime, isPublished, isScheduled } from "../src/lib/scheduling.js";

const NOW = new Date(2026, 10, 11, 12, 0, 0).getTime(); // Nov 11 2026, local noon

test("parseShowDate accepts the formats the site stores", () => {
  assert.equal(parseShowDate("November 14, 2026"), new Date(2026, 10, 14).getTime());
  assert.equal(parseShowDate("Aug. 11, 2026"), new Date(2026, 7, 11).getTime());
  assert.equal(parseShowDate("Nov 3, 2026"), new Date(2026, 10, 3).getTime());
  assert.equal(parseShowDate("March 1st, 2025"), new Date(2025, 2, 1).getTime());
});

test("parseShowDate reads the other shapes a post date may take", () => {
  const at = (y, mo, d) => new Date(y, mo, d).getTime();
  assert.equal(parseShowDate("14 November 2026"), at(2026, 10, 14));
  assert.equal(parseShowDate("14th Nov, 2026"), at(2026, 10, 14));
  assert.equal(parseShowDate("2026-11-14"), at(2026, 10, 14));
  assert.equal(parseShowDate("2026/11/14"), at(2026, 10, 14));
  assert.equal(parseShowDate("11/14/2026"), at(2026, 10, 14));
  assert.equal(parseShowDate("11-14-2026"), at(2026, 10, 14));
  // A first number above 12 can only be a day, so read it day-first.
  assert.equal(parseShowDate("25/12/2026"), at(2026, 11, 25));
});

test("parseShowDate rejects impossible calendar days", () => {
  assert.equal(parseShowDate("November 31, 2026"), null);
  assert.equal(parseShowDate("February 29, 2025"), null);
  assert.equal(parseShowDate("2026-13-01"), null);
  assert.equal(parseShowDate("2026-00-10"), null);
});

test("a future date in any readable format is scheduled", () => {
  for (const date of ["November 25, 2026", "25 November 2026", "2026-11-25", "11/25/2026"]) {
    assert.equal(isScheduled({ date }, NOW), true, date);
  }
});

test("parseShowDate returns null for anything it cannot read", () => {
  assert.equal(parseShowDate("Summer 2026"), null);
  assert.equal(parseShowDate(""), null);
  assert.equal(parseShowDate(undefined), null);
  assert.equal(parseShowDate("Smarch 40, 2026"), null);
});

test("publishTime is the later of publishDate and the show date", () => {
  assert.equal(publishTime({ date: "November 14, 2026" }), new Date(2026, 10, 14).getTime());
  assert.equal(publishTime({ publishDate: "2026-11-03T07:34" }), new Date(2026, 10, 3, 7, 34).getTime());
  assert.equal(
    publishTime({ date: "November 14, 2026", publishDate: "2026-11-03T07:34" }),
    new Date(2026, 10, 14).getTime()
  );
  assert.equal(publishTime({ title: "no dates" }), 0);
  assert.equal(
    publishTime({ date: "Summer 2026", publishDate: "2026-11-03T07:34" }),
    new Date(2026, 10, 3, 7, 34).getTime()
  );
});

test("a future show date schedules a post even with no publishDate", () => {
  assert.equal(isPublished({ date: "November 14, 2026" }, NOW), false);
  assert.equal(isScheduled({ date: "November 14, 2026" }, NOW), true);
});

test("a past or same-day show date is live", () => {
  assert.equal(isPublished({ date: "November 7, 2026" }, NOW), true);
  assert.equal(isPublished({ date: "November 11, 2026" }, NOW), true);
});

test("the later of the two dates wins", () => {
  assert.equal(isPublished({ publishDate: "2026-11-03T07:34", date: "November 14, 2026" }, NOW), false);
  assert.equal(isPublished({ publishDate: "2030-01-01T00:00", date: "November 7, 2026" }, NOW), false);
});

test("a post with no usable dates is always live", () => {
  assert.equal(isPublished({ title: "x" }, NOW), true);
  assert.equal(isPublished({ date: "Summer 2026" }, NOW), true);
});
