// Browser-free title-card renderer.
//
// The original renderer photographed the card HTML with a headless browser,
// which fails on a host that is missing the browser's system libraries (for
// example libglib-2.0.so.0) and has no root to install them. This module draws
// the SAME card with no browser at all: satori lays the design out to SVG and
// @resvg/resvg-js rasterizes it. resvg is a prebuilt native library whose only
// runtime dependencies are libc/libm/libgcc — the libraries every host has —
// so it works where Chromium cannot start.
//
// The design here mirrors buildCardHtml() in title-image.js. Keep the two in
// step: the HTML is the human-editable source of record, and this is the
// no-browser path that reproduces it.
import { Resvg } from "@resvg/resvg-js";
import { CARD_WIDTH, CARD_HEIGHT, COLOR_TOKENS, DOT_COLORS, headlineSize, fontBuffers, resolveColor } from "./title-image.js";

const C = COLOR_TOKENS;
const PAD = { x: 104, y: 88 };

function splitHeadline(title, accentWord) {
  const text = String(title || "");
  const word = String(accentWord || "").trim();
  if (!word) return [{ text, accent: false }];
  const idx = text.toLowerCase().indexOf(word.toLowerCase());
  if (idx < 0) return [{ text, accent: false }];
  return [
    { text: text.slice(0, idx), accent: false },
    { text: text.slice(idx, idx + word.length), accent: true },
    { text: text.slice(idx + word.length), accent: false },
  ].filter(part => part.text.length);
}

function headlineEl(card, size) {
  const parts = splitHeadline(card.title, card.accentWord);
  const children = parts.map(part => ({
    type: "span",
    props: { style: part.accent ? { color: C.accent } : {}, children: part.text },
  }));
  return {
    type: "div",
    props: {
      style: {
        fontFamily: "Lora", fontWeight: 700, fontSize: size, lineHeight: 1.02,
        letterSpacing: "-0.022em", color: C.ink, display: "flex", flexWrap: "wrap",
      },
      children,
    },
  };
}

function modelEl(m, i) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex", flexDirection: "column", flex: 1,
        ...(i > 0 ? { borderLeft: `1px solid ${C.rule}`, paddingLeft: 26 } : {}),
        ...(i < 3 ? { paddingRight: 26 } : {}),
      },
      children: [
        { type: "div", props: { style: {
          width: 13, height: 13, borderRadius: 999,
          backgroundColor: resolveColor(m.color, DOT_COLORS[i % DOT_COLORS.length]), marginBottom: 14,
        } } },
        { type: "div", props: { style: { fontSize: 25, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2, color: C.ink }, children: m.name } },
        { type: "div", props: { style: { fontFamily: "JetBrains Mono", fontSize: 16, color: C["ink-4"], marginTop: 7 }, children: m.meta || "" } },
      ],
    },
  };
}

export function cardElement(card) {
  const size = headlineSize(card.title, card.headlineSize);
  const models = Array.isArray(card.models) ? card.models.filter(m => m && m.name).slice(0, 4) : [];

  const footChildren = models.length
    ? [{
        type: "div",
        props: {
          style: { display: "flex", alignItems: "stretch", paddingTop: 26, paddingBottom: 6 },
          children: models.map(modelEl),
        },
      }]
    : (card.caption ? [{
        type: "div",
        props: { style: { paddingTop: 22, fontSize: 15, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C["ink-4"] }, children: card.caption },
      }] : []);

  return {
    type: "div",
    props: {
      style: {
        width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px`,
        // satori defaults to content-box, so without this the 900px height plus
        // the vertical padding would overflow and push the footer off-canvas.
        boxSizing: "border-box",
        display: "flex", flexDirection: "column",
        padding: `${PAD.y}px ${PAD.x}px 80px`,
        backgroundColor: C.paper, color: C.ink, fontFamily: "Inter",
        // The paper grain from buildCardHtml's body::before.
        backgroundImage: "radial-gradient(rgba(26,24,20,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: 16, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: C.accent },
            children: [
              { type: "div", props: { children: `Minescout \u00a0\u00b7\u00a0 ${card.category || "Tech"}` } },
              { type: "div", props: { style: { color: C["ink-4"], fontWeight: 500, letterSpacing: "0.16em" }, children: card.date || "" } },
            ],
          },
        },
        {
          // The middle band grows to fill the space between the topbar and the
          // footer and centres its content — the equivalent of the browser's
          // space-between, expressed the way satori lays out reliably.
          type: "div",
          props: {
            style: { display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" },
            children: [
              headlineEl(card, size),
              ...(card.subtitle ? [{
                type: "div",
                props: { style: { fontFamily: "Lora", fontStyle: "italic", fontWeight: 400, fontSize: 56, color: C["ink-3"], marginTop: 16 }, children: card.subtitle },
              }] : []),
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              { type: "div", props: { style: { height: 1, backgroundColor: C.rule, width: "100%" } } },
              ...footChildren,
            ],
          },
        },
      ],
    },
  };
}

// Render the card to a PNG buffer with no browser. `scale` 2 doubles the output
// to 3200x1800. Returns { png, fontsLoaded }.
export async function renderCardPng(card, scale = 1) {
  const satori = (await import("satori")).default;
  const fonts = fontBuffers();
  const svg = await satori(cardElement(card), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: fonts.map(f => ({ name: f.name, data: f.data, weight: f.weight, style: f.style })),
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH * scale } });
  const png = Buffer.from(resvg.render().asPng());
  // Four faces are needed: Lora 700, Lora italic, Inter, JetBrains Mono. Fewer
  // means a bundled font was unreadable and a fallback face was used.
  const families = new Set(fonts.map(f => `${f.name}/${f.style}`));
  return { png, fontsLoaded: families.size === 4 };
}
