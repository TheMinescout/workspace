import crypto from "crypto";
import * as cheerio from "cheerio";

export const USER_COOKIE = "ms_sid";
export const ADMIN_COOKIE = "ms_admin";
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64, maxmem: 64 * 1024 * 1024 };
const LEGACY_SALT = "ms_salt_2026";

export function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, SCRYPT.keylen, SCRYPT).toString("hex");
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt}$${derived}`;
}

function verifyScrypt(password, stored) {
  const parts = String(stored).split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, N, r, p, salt, expected] = parts;
  const keylen = expected.length / 2;
  let derived;
  try {
    derived = crypto.scryptSync(String(password), salt, keylen, {
      N: Number(N), r: Number(r), p: Number(p), maxmem: SCRYPT.maxmem,
    });
  } catch {
    return false;
  }
  return safeEqual(derived.toString("hex"), expected);
}

// Old records are sha256(password + static salt); upgraded on next successful login.
function verifyLegacy(password, stored) {
  const derived = crypto.createHash("sha256").update(String(password) + LEGACY_SALT).digest("hex");
  return safeEqual(derived, stored);
}

export function verifyPassword(password, stored) {
  if (typeof stored !== "string" || !stored) return { ok: false, needsRehash: false };
  if (stored.startsWith("scrypt$")) return { ok: verifyScrypt(password, stored), needsRehash: false };
  const ok = verifyLegacy(password, stored);
  return { ok, needsRehash: ok };
}

export function signSession(secret, data, ttlMs = SESSION_TTL_MS) {
  const payload = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + ttlMs })).toString("base64url");
  const mac = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySession(secret, token) {
  if (!secret || typeof token !== "string") return null;
  const idx = token.lastIndexOf(".");
  if (idx < 1) return null;
  const payload = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(mac, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  if (typeof header !== "string") return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    if (!name) continue;
    try {
      out[name] = decodeURIComponent(part.slice(idx + 1).trim());
    } catch {
      out[name] = part.slice(idx + 1).trim();
    }
  }
  return out;
}

export function serializeCookie(name, value, { maxAge = 0, secure = false } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function isSecureRequest(req) {
  if (req.socket && req.socket.encrypted) return true;
  const proto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  return proto === "https";
}

export function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || (req.socket && req.socket.remoteAddress) || "unknown";
}

export function createRateLimiter({ windowMs, max, name = "rl" }) {
  const buckets = new Map();
  const sweep = () => {
    const now = Date.now();
    for (const [key, entry] of buckets) {
      if (entry.reset <= now) buckets.delete(key);
    }
  };

  return function hit(key) {
    if (buckets.size > 5000) sweep();
    const now = Date.now();
    const id = `${name}:${key}`;
    let entry = buckets.get(id);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      buckets.set(id, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.reset - now) / 1000)) };
    }
    return { allowed: true, retryAfter: 0 };
  };
}

// ── validation ──────────────────────────────────────────────────────────────
export const POST_ID_RE = /^[a-z0-9][a-z0-9-]{0,119}$/;
export const USERNAME_RE = /^[a-z0-9][a-z0-9._@-]{2,63}$/;

export function isPostId(value) {
  return typeof value === "string" && POST_ID_RE.test(value);
}

export function isUsername(value) {
  return typeof value === "string" && USERNAME_RE.test(value);
}

export function cleanText(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max);
}

export function isSafeAssetUrl(value) {
  if (typeof value !== "string" || !value) return false;
  if (value.length > 500) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return /^https?:\/\/[^\s"'<>]+$/i.test(value);
}

// ── HTML sanitizing for post bodies ─────────────────────────────────────────
const DROP_TAGS = ["script", "style", "iframe", "object", "embed", "form", "base", "meta", "link", "svg", "math"];
const URL_ATTRS = ["href", "src", "action", "formaction", "xlink:href", "poster", "data"];
const BAD_URL = /^(javascript|vbscript|data:text\/html|data:application\/javascript)/i;

// A browser strips ASCII whitespace and control characters from a URL before it
// resolves the scheme, so "java\nscript:" is navigated as "javascript:". A scheme
// check must therefore run on the de-obfuscated value, not the raw attribute —
// otherwise the payload passes the test and executes when clicked.
function deobfuscateUrl(value) {
  return String(value).replace(/[\u0000-\u0020\u007F]/g, "");
}

export function sanitizeHtml(html) {
  if (typeof html !== "string" || !html) return "";
  const $ = cheerio.load(html, null, false);

  $(DROP_TAGS.join(",")).remove();

  $("*").each((_, el) => {
    const attribs = el.attribs || {};
    for (const [name, value] of Object.entries(attribs)) {
      const attr = name.toLowerCase();
      if (attr.startsWith("on") || attr === "srcdoc" || attr === "formaction") {
        $(el).removeAttr(name);
        continue;
      }
      if (URL_ATTRS.includes(attr) && BAD_URL.test(deobfuscateUrl(value))) {
        $(el).removeAttr(name);
        continue;
      }
      if (attr === "style" && /expression\s*\(|javascript:/i.test(deobfuscateUrl(value))) {
        $(el).removeAttr(name);
      }
    }
  });

  return $.html();
}
