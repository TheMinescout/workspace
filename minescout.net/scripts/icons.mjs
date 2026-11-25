#!/usr/bin/env node
// Regenerates the site icons and the share card from public/assets/favicon.png.
//
// The favicon used to ship as a 2048x2048, 5.5 MB PNG that was also used as a
// sidebar logo. This script keeps a 512x512 master plus the sizes browsers
// actually ask for. It only ever scales down, so running it twice is a no-op.
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PUBLIC_DIR } from "./seo/discover.mjs";
import { decodePng, encodePng, resize } from "./seo/png.mjs";

const ASSETS = join(PUBLIC_DIR, "assets");
const MASTER = 512;
const ICON_SIZES = [32, 64, 180];

/** ICO container holding PNG payloads (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + pngs.length * 16;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((png) => png.data)]);
}

/** Place a square icon, centred, on a 1200x630 card with a brand accent bar. */
function shareCard(icon, width = 1200, height = 630) {
  const card = { width, height, data: Buffer.alloc(width * height * 4) };
  const background = [0x1a, 0x19, 0x16];
  const accent = [0xff, 0x4d, 0x1c];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const at = (y * width + x) * 4;
      const colour = y >= height - 12 ? accent : background;
      card.data[at] = colour[0];
      card.data[at + 1] = colour[1];
      card.data[at + 2] = colour[2];
      card.data[at + 3] = 255;
    }
  }

  const left = Math.round((width - icon.width) / 2);
  const top = Math.round((height - icon.height) / 2);
  for (let y = 0; y < icon.height; y++) {
    for (let x = 0; x < icon.width; x++) {
      const from = (y * icon.width + x) * 4;
      const alpha = icon.data[from + 3] / 255;
      if (!alpha) continue;
      const to = ((top + y) * width + left + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        card.data[to + channel] = Math.round(icon.data[from + channel] * alpha + card.data[to + channel] * (1 - alpha));
      }
    }
  }
  return card;
}

const source = decodePng(
  // Read through the module's own file helpers so the path stays in one place.
  await import("node:fs").then((fs) => fs.readFileSync(join(ASSETS, "favicon.png"))),
);

const master = source.width > MASTER ? resize(source, MASTER) : source;
const files = [{ name: "favicon.png", image: master }];
for (const size of ICON_SIZES) {
  files.push({ name: `favicon-${size}.png`, image: resize(master, size) });
}
files.push({ name: "apple-touch-icon.png", image: resize(master, 180) });
files.push({ name: "og-image.png", image: shareCard(resize(master, 512)) });

for (const file of files) {
  writeFileSync(join(ASSETS, file.name), encodePng(file.image));
  console.log(`${file.name}  ${file.image.width}x${file.image.height}`);
}

const icoSizes = [16, 32];
writeFileSync(
  join(ASSETS, "favicon.ico"),
  ico(icoSizes.map((size) => ({ size, data: encodePng(resize(master, size)) }))),
);
console.log(`favicon.ico  ${icoSizes.join("+")}`);
