// Unit tests for the browser-free title-card renderer. Run with: npm test
//
// The renderer exists so a card can be produced on a host where Chromium cannot
// start (missing system libraries, no root). These tests assert the properties
// that failure mode depends on: it renders without any browser, at the right
// size, with the bundled fonts, and with the card's content actually present.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PNG } from "pngjs";
import { renderCardPng, cardElement } from "../server/title-image-render.js";
import { CARD_WIDTH, CARD_HEIGHT, pngSize } from "../server/title-image.js";

const CARD = {
  title: "Argon and Carbon",
  accentWord: "Carbon",
  subtitle: "The periodic table inside Gemini 4",
  category: "Tech",
  date: "November 2026",
  models: [
    { name: "Gemini 4 Argon", meta: "1M tokens", color: "accent" },
    { name: "Gemini 4 Carbon", meta: "AA 59", color: "blue" },
  ],
};

// Fraction of "inked" pixels in a horizontal band, compositing over white so a
// transparent background is not mistaken for black. Used to prove a band is not
// blank and is roughly as busy as the browser render.
function inkFraction(png, y0, y1) {
  let dark = 0, total = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < png.width; x++) {
      const o = (y * png.width + x) * 4;
      const a = png.data[o + 3] / 255;
      const r = png.data[o] * a + 255 * (1 - a);
      const g = png.data[o + 1] * a + 255 * (1 - a);
      const b = png.data[o + 2] * a + 255 * (1 - a);
      total++;
      if (0.299 * r + 0.587 * g + 0.114 * b < 140) dark++;
    }
  }
  return dark / total;
}

test("renderCardPng returns a 1600x900 PNG with no browser", async () => {
  const { png, fontsLoaded } = await renderCardPng(CARD);
  assert.ok(Buffer.isBuffer(png), "returns a buffer");
  const size = pngSize(png);
  assert.deepEqual(size, { width: CARD_WIDTH, height: CARD_HEIGHT });
  assert.equal(fontsLoaded, true, "all bundled font faces loaded");
});

test("renderCardPng honours scale 2", async () => {
  const { png } = await renderCardPng(CARD, 2);
  assert.deepEqual(pngSize(png), { width: CARD_WIDTH * 2, height: CARD_HEIGHT * 2 });
});

test("the card is not blank and every band has content", async () => {
  const { png } = await renderCardPng(CARD);
  const image = PNG.sync.read(png);
  // Topbar, headline, subtitle and footer bands must each contain ink. If the
  // layout ever overflows again (for example by dropping box-sizing), the
  // footer band goes empty and this catches it.
  assert.ok(inkFraction(image, 80, 140) > 0.002, "topbar has ink");
  assert.ok(inkFraction(image, 300, 470) > 0.05, "headline has ink");
  assert.ok(inkFraction(image, 480, 560) > 0.005, "subtitle has ink");
  assert.ok(inkFraction(image, 730, 870) > 0.003, "footer has ink");
});

test("cardElement splits the accent word into its own coloured span", () => {
  const el = cardElement(CARD);
  const spans = el.props.children[1].props.children[0].props.children;
  assert.equal(spans.length, 2);
  assert.equal(spans[0].props.children, "Argon and ");
  assert.equal(spans[1].props.children, "Carbon");
  assert.equal(spans[1].props.style.color, "#2d6a4f");
});

test("cardElement uses the caption line when there are no models", () => {
  const el = cardElement({ title: "Solo", caption: "One line" });
  const foot = el.props.children[2];
  assert.equal(foot.props.children.length, 2);
  assert.match(JSON.stringify(foot.props.children[1]), /One line/);
});
