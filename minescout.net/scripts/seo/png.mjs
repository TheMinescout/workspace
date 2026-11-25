// Minimal PNG decode/encode so icons can be resized with no image tooling
// installed. Supports the 8-bit, non-interlaced RGB/RGBA files the site ships.
import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = -1;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/** Decode an 8-bit RGB/RGBA PNG into { width, height, data } with RGBA pixels. */
export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error("not a PNG file");

  let offset = 8;
  let header = null;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!header) throw new Error("PNG has no IHDR chunk");
  if (header.bitDepth !== 8) throw new Error(`unsupported bit depth ${header.bitDepth}`);
  if (header.interlace !== 0) throw new Error("interlaced PNGs are not supported");
  const channels = { 2: 3, 6: 4 }[header.colorType];
  if (!channels) throw new Error(`unsupported color type ${header.colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const { width, height } = header;
  const stride = width * channels;
  const pixels = Buffer.alloc(width * height * 4);
  const line = Buffer.alloc(stride);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const src = raw.subarray(pos, pos + stride);
    pos += stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? line[x - channels] : 0;
      const up = y > 0 ? line[x] : 0;
      const upLeft = y > 0 && x >= channels ? line[x - channels] : 0;
      let value = src[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) value += paeth(left, up, upLeft);
      else if (filter !== 0) throw new Error(`unsupported row filter ${filter}`);
      line[x] = value & 0xff;
    }
    for (let x = 0; x < width; x++) {
      const from = x * channels;
      const to = (y * width + x) * 4;
      pixels[to] = line[from];
      pixels[to + 1] = line[from + 1];
      pixels[to + 2] = line[from + 2];
      pixels[to + 3] = channels === 4 ? line[from + 3] : 255;
    }
  }

  return { width, height, data: pixels };
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Encode RGBA pixels as a PNG. */
export function encodePng({ width, height, data }) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Area-average downscale to width x height, preserving the alpha channel. */
export function resize({ width, height, data }, targetWidth, targetHeight = targetWidth) {
  const out = Buffer.alloc(targetWidth * targetHeight * 4);
  const scaleX = width / targetWidth;
  const scaleY = height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const y0 = Math.floor(y * scaleY);
    const y1 = Math.min(height, Math.max(y0 + 1, Math.ceil((y + 1) * scaleY)));
    for (let x = 0; x < targetWidth; x++) {
      const x0 = Math.floor(x * scaleX);
      const x1 = Math.min(width, Math.max(x0 + 1, Math.ceil((x + 1) * scaleX)));
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let weight = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const from = (sy * width + sx) * 4;
          const alpha = data[from + 3];
          // Weight colour by alpha so transparent pixels do not darken the edge.
          const w = alpha / 255;
          r += data[from] * w;
          g += data[from + 1] * w;
          b += data[from + 2] * w;
          a += alpha;
          weight += w;
        }
      }
      const to = (y * targetWidth + x) * 4;
      const alpha = Math.round(a / ((y1 - y0) * (x1 - x0)));
      // A pixel that rounds to fully transparent must carry no colour, or the
      // output stops being a fixed point of resize().
      const colour = weight && alpha ? 1 / weight : 0;
      out[to] = Math.round(r * colour);
      out[to + 1] = Math.round(g * colour);
      out[to + 2] = Math.round(b * colour);
      out[to + 3] = alpha;
    }
  }
  return { width: targetWidth, height: targetHeight, data: out };
}

/** Read the pixel dimensions out of a PNG header without decoding the image. */
export function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
