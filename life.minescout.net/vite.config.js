import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";
import {
  USER_COOKIE, ADMIN_COOKIE, SESSION_TTL_MS,
  hashPassword, verifyPassword, safeEqual,
  signSession, verifySession, parseCookies, serializeCookie,
  isSecureRequest, clientIp, createRateLimiter,
  isPostId, isUsername, cleanText, isSafeAssetUrl, sanitizeHtml,
} from "./server/security.js";

// The scraper module lives in the gitignored data/ folder, so it may be absent.
async function loadScraper() {
  const file = path.resolve("data/scraping/scraper.js");
  if (!fs.existsSync(file)) return null;
  try {
    return await import(pathToFileURL(file).href);
  } catch (err) {
    console.warn(`[minescout-api] scraper routes unavailable: ${err.message}`);
    return null;
  }
}

// ── helpers ────────────────────────────────────────────────────────────────
function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  try { fs.chmodSync(path.dirname(file), 0o700); } catch {}
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { mode: 0o600 });
  try { fs.chmodSync(file, 0o600); } catch {}
}
function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}

const MAX_BODY_BYTES = 64 * 1024;

function parseBody(req) {
  return new Promise(resolve => {
    let size = 0;
    const chunks = [];
    let done = false;
    const finish = value => { if (!done) { done = true; resolve(value); } };

    let tooLarge = false;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (tooLarge) return finish(null);
      try { finish(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { finish({}); }
    });
    req.on("error", () => finish(null));
  });
}

async function readBody(req, res) {
  const type = String(req.headers["content-type"] || "");
  if (!type.includes("application/json")) {
    json(res, { ok: false, error: "Content-Type must be application/json." }, 415);
    return null;
  }
  const body = await parseBody(req);
  if (body === null) {
    json(res, { ok: false, error: "Request body too large." }, 413);
    return null;
  }
  return body;
}

const ALLOWED_ORIGINS = [
  "http://beta.minescout.net",
  "https://beta.minescout.net",
  "http://minescout.net",
  "https://minescout.net",
  "http://www.minescout.net",
  "https://www.minescout.net",
  "http://life.minescout.net",
  "https://life.minescout.net",
];

function applyCors(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    // The vault is called cross-origin from beta.minescout.net with
    // credentials: "include"; without this header the browser drops the
    // response and the terminal game cannot read its state.
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Same-origin requests and the known sites are the only ones allowed to mutate state.
function isTrustedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try { return new URL(origin).host === req.headers.host; }
  catch { return false; }
}

function rejectUntrustedOrigin(req, res) {
  if (isTrustedOrigin(req)) return false;
  json(res, { ok: false, error: "Origin not allowed." }, 403);
  return true;
}

function apiPlugin(env) {
  return {
    name: "minescout-api",
    async configureServer(server) {
      const SESSION_SECRET = String(env.SESSION_SECRET || "");
      const ADMIN_PASSWORD = String(env.ADMIN_PASSWORD || "");

      if (!SESSION_SECRET) {
        console.warn("[minescout-api] SESSION_SECRET is not set — sessions will not survive a restart.");
      }
      if (!ADMIN_PASSWORD) {
        console.warn("[minescout-api] ADMIN_PASSWORD is not set — admin login is disabled.");
      }

      // Applied to every response, including static assets.
      server.middlewares.use((req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

        // data/ holds password hashes and runtime records; it must never be served.
        const pathname = (req.url || "").split("?")[0];
        if (pathname === "/data" || pathname.startsWith("/data/")) {
          res.statusCode = 404;
          return res.end("Not found");
        }
        next();
      });

      server.middlewares.use((req, res, next) => {
        if ((req.url || "").startsWith("/api/")) {
          applyCors(req, res);
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            return res.end();
          }
        }
        next();
      });

      const runtimeSecret = SESSION_SECRET || crypto.randomBytes(32).toString("hex");

      const cookies = req => parseCookies(req.headers.cookie || "");

      // Logged-out tokens stay here until they expire, so a copied cookie stops working.
      const revoked = new Map();
      const revokeToken = token => {
        if (!token) return;
        const sess = verifySession(runtimeSecret, token);
        if (!sess) return;
        if (revoked.size > 1000) {
          const now = Date.now();
          for (const [key, exp] of revoked) if (exp <= now) revoked.delete(key);
        }
        revoked.set(token, sess.exp);
      };
      const sessionFor = (req, name) => {
        const token = cookies(req)[name];
        if (!token) return null;
        const exp = revoked.get(token);
        if (exp !== undefined) {
          if (exp > Date.now()) return null;
          revoked.delete(token);
        }
        return verifySession(runtimeSecret, token);
      };

      const currentUser = req => {
        const sess = sessionFor(req, USER_COOKIE);
        return sess && sess.role === "user" && isUsername(sess.username) ? sess.username : "";
      };
      const isAdminRequest = req => {
        const sess = sessionFor(req, ADMIN_COOKIE);
        return !!(sess && sess.role === "admin");
      };
      const requireAdmin = (req, res) => {
        if (isAdminRequest(req)) return true;
        json(res, { ok: false, error: "Unauthorized." }, 401);
        return false;
      };
      const setSession = (req, res, name, data, ttl = SESSION_TTL_MS) => {
        res.setHeader("Set-Cookie", serializeCookie(name, signSession(runtimeSecret, data, ttl), {
          maxAge: Math.floor(ttl / 1000),
          secure: isSecureRequest(req),
        }));
      };
      const clearSession = (req, res, name) => {
        res.setHeader("Set-Cookie", serializeCookie(name, "", { maxAge: 0, secure: isSecureRequest(req) }));
      };

      const loginLimiter = createRateLimiter({ name: "login", windowMs: 15 * 60 * 1000, max: 10 });
      const registerLimiter = createRateLimiter({ name: "register", windowMs: 60 * 60 * 1000, max: 5 });
      const adminLoginLimiter = createRateLimiter({ name: "admin-login", windowMs: 15 * 60 * 1000, max: 5 });
      const commentLimiter = createRateLimiter({ name: "comment", windowMs: 10 * 60 * 1000, max: 10 });
      const voteLimiter = createRateLimiter({ name: "vote", windowMs: 10 * 60 * 1000, max: 60 });
      const limited = (res, hit) => {
        if (hit.allowed) return false;
        res.setHeader("Retry-After", String(hit.retryAfter));
        json(res, { ok: false, error: "Too many requests. Try again later." }, 429);
        return true;
      };

      const DATA = path.resolve("data");
      const USERS_FILE    = path.join(DATA, "users.json");
      const COMMENTS_FILE = path.join(DATA, "comments.json");
      const RATINGS_FILE  = path.join(DATA, "ratings.json");
      const SIDEBAR_FILE  = path.join(DATA, "sidebar-config.json");
      fs.mkdirSync(DATA, { recursive: true, mode: 0o700 });

      // ── DATA VAULT: ACCOUNT-BACKED PROGRESSION ──────────────────────────
      const VAULT_MAX_LEVEL = 9;
      const VAULT_MAX_ATTEMPTS = 4;

      const VAULT_WORDS = {
        easy: [
          "DATA", "LOCK", "VAUT", "NODE", "CORE",
          "PASS", "LINK", "COGN", "BASE", "KEYS"
        ],
        medium: [
          "ACCESS", "CYPHER", "MATRIX", "SECTOR",
          "ROUTER", "SERVER", "BUFFER", "BYPASS"
        ],
        hard: [
          "FIREWALL", "TERMINAL", "PROTOCOL",
          "SECURITY", "ENCRYPT", "FIRMWARE", "OVERRIDE"
        ]
      };

      const VAULT_FILE_CONTENT = {
        "README.txt":
`COGNISEARCH DATA VAULT
=======================

This terminal is connected to a restricted
cognitive archive.

Use:
  $ help
  $ ls
  $ ls -a
  $ cat <filename>
  $ hack

Clearance determines which archive segments
can be accessed.

Some records appear to have been deliberately
removed from the public directory.`,

        "vault_status.dat":
`VAULT STATUS
============

CORE: ONLINE
SECURITY: ACTIVE
AUTHENTICATION: ACCOUNT-BOUND
LOCAL PROGRESS STORAGE: DISABLED
MAX GAMEPLAY CLEARANCE: L9
L10: UNAVAILABLE THROUGH GAMEPLAY`,

        "access_L1.txt":
`COGNISEARCH SECURITY ARCHIVE
============================

CLEARANCE: LEVEL 01
STATUS: PARTIAL ACCESS

Initial clearance granted.

The Data Vault contains more than ordinary
records.

[FILE SEGMENT 01]
[ARCHIVE CONTINUES]`,

        "access_L2.txt":
`COGNISEARCH SECURITY ARCHIVE
============================

CLEARANCE: LEVEL 02

A second security layer has been breached.

SYSTEM NOTE:
The archive does not simply store information.

It appears to preserve MEMORY STATES.

[FILE SEGMENT 02]
[DATA INCOMPLETE]`,

        "access_L3.txt":
`COGNISEARCH SECURITY ARCHIVE
============================

CLEARANCE: LEVEL 03
STATUS: RESTRICTED

The Data Vault was not designed as a
conventional storage system.

It was designed to remember.

[FILE SEGMENT 03]
[DATA CORRUPTED]`,

        "access_L4.txt":
`COGNISEARCH SECURITY ARCHIVE
============================

CLEARANCE: LEVEL 04

WARNING:
ARCHIVE INTEGRITY BELOW EXPECTED THRESHOLD

Several records reference an entity
identified only as:

        COGNITIVE INDEX: ████████

[FILE SEGMENT 04]
[ACCESS TRACE DETECTED]`,

        "access_L5.txt":
`COGNISEARCH SECURITY ARCHIVE
============================

CLEARANCE: LEVEL 05
STATUS: CLASSIFIED

The security matrix is not protecting
the archive from you.

It may be protecting the archive
from something else.

AUTOMATED NOTE:
DO NOT ATTEMPT TO ACCESS LEVEL 10.

[FILE SEGMENT 05]
[END OF AUTHORIZED RECORD]`,

        "access_L6.enc":
`████████████████████████████████
ENCRYPTED ARCHIVE SEGMENT

CLEARANCE ACCEPTED: LEVEL 06

Decryption key unavailable.

A partial header was recovered:

  COGNITIVE...
  ROOT...
  MEMORY...

[REMAINDER ENCRYPTED]`,

        "access_L7.enc":
`████████████████████████████████
ENCRYPTED ARCHIVE SEGMENT

CLEARANCE ACCEPTED: LEVEL 07

The archive recognizes your account.

It should not be able to do that.

[IDENTITY TRACE: ACTIVE]
[REMAINDER ENCRYPTED]`,

        "access_L8.enc":
`████████████████████████████████
ENCRYPTED ARCHIVE SEGMENT

CLEARANCE ACCEPTED: LEVEL 08

ROOT FRAGMENT DETECTED.

One final clearance layer remains.

[WARNING]
The next security boundary is not listed
in the public architecture.`,

        "root_fragment.dat":
`COGNISEARCH ROOT ARCHIVE
========================

CLEARANCE: LEVEL 09

ROOT FRAGMENT RECOVERED.

You have reached the maximum clearance
obtainable through the local hacking matrix.

LEVEL 10 IS NOT A GAMEPLAY REWARD.

If this record exists, something outside
the normal clearance system created it.

[ROOT FRAGMENT: 01]
[END OF RECORD]`
      };

      const VAULT_FILE_LEVELS = {
        "README.txt": 0,
        "vault_status.dat": 0,
        "access_L1.txt": 1,
        "access_L2.txt": 2,
        "access_L3.txt": 3,
        "access_L4.txt": 4,
        "access_L5.txt": 5,
        "access_L6.enc": 6,
        "access_L7.enc": 7,
        "access_L8.enc": 8,
        "root_fragment.dat": 9
      };

      const vaultSessions = new Map();

      function vaultDifficulty(level) {
        if (level < 2) return "easy";
        if (level < 5) return "medium";
        return "hard";
      }

      function vaultRandomWords(level) {
        const pool = [...VAULT_WORDS[vaultDifficulty(level)]];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = crypto.randomInt(i + 1);
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, 6);
      }

      function vaultMatches(a, b) {
        let matches = 0;
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (a[i] === b[i]) matches++;
        }
        return matches;
      }

      function vaultNormalize(user) {
        return String(user || "").trim().toLowerCase();
      }

      function vaultGetUser(users, username) {
        const clean = vaultNormalize(username);
        return users.find(
          u => vaultNormalize(u.username) === clean
        );
      }

      function vaultEnsureUser(user) {
        if (!user.vault || typeof user.vault !== "object") {
          user.vault = {};
        }

        user.vault.level =
          Math.max(
            0,
            Math.min(
              VAULT_MAX_LEVEL,
              Number.parseInt(user.vault.level, 10) || 0
            )
          );

        user.vault.highestLevel =
          Math.max(
            user.vault.level,
            Math.min(
              VAULT_MAX_LEVEL,
              Number.parseInt(user.vault.highestLevel, 10) || 0
            )
          );

        if (!Array.isArray(user.vault.unlockedFiles)) {
          user.vault.unlockedFiles = [];
        }

        user.vault.hacksCompleted =
          Number.parseInt(user.vault.hacksCompleted, 10) || 0;

        user.vault.hacksWon =
          Number.parseInt(user.vault.hacksWon, 10) || 0;

        user.vault.hacksLost =
          Number.parseInt(user.vault.hacksLost, 10) || 0;

        for (const [filename, requiredLevel] of Object.entries(VAULT_FILE_LEVELS)) {
          if (
            requiredLevel > 0 &&
            user.vault.highestLevel >= requiredLevel &&
            !user.vault.unlockedFiles.includes(filename)
          ) {
            user.vault.unlockedFiles.push(filename);
          }
        }

        return user.vault;
      }

      function vaultState(vault) {
        return {
          ok: true,
          level: vault.level,
          highestLevel: vault.highestLevel,
          unlockedFiles: [...vault.unlockedFiles],
          hacksCompleted: vault.hacksCompleted,
          hacksWon: vault.hacksWon,
          hacksLost: vault.hacksLost
        };
      }

      function vaultCors(req, res) {
        applyCors(req, res);
      }

      // Identity comes from the signed session cookie only — never from the request body.
      async function vaultIdentity(req) {
        return vaultNormalize(currentUser(req));
      }

      function vaultRequireUser(users, username) {
        if (!username) {
          return {
            error: "Authentication required."
          };
        }

        const user = vaultGetUser(users, username);

        if (!user) {
          return {
            error: "Account not found."
          };
        }

        return { user };
      }

      // GET /api/vault
      server.middlewares.use("/api/vault", async (req, res, next) => {
        vaultCors(req, res);

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (
          req.url.startsWith("/hack") ||
          req.url.startsWith("/files")
        ) {
          return next();
        }

        if (req.method !== "GET") {
          return json(res, {}, 405);
        }

        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req);
        const result = vaultRequireUser(users, username);

        if (result.error) {
          return json(res, { ok: false, error: result.error }, 401);
        }

        const vault = vaultEnsureUser(result.user);
        writeJSON(USERS_FILE, users);

        return json(res, vaultState(vault));
      });

      // POST /api/vault/hack/start
      server.middlewares.use("/api/vault/hack/start", async (req, res) => {
        vaultCors(req, res);

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method !== "POST") {
          return json(res, {}, 405);
        }

        if (rejectUntrustedOrigin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;
        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req);
        const result = vaultRequireUser(users, username);

        if (result.error) {
          return json(res, { ok: false, error: result.error }, 401);
        }

        const user = result.user;
        const vault = vaultEnsureUser(user);

        const requestedStake = Number.parseInt(body.stake, 10);

        if (vault.level >= VAULT_MAX_LEVEL) {
          return json(res, {
            ok: false,
            error: "Maximum gameplay clearance reached."
          }, 400);
        }

        if (
          vault.level === 0 &&
          requestedStake !== 0
        ) {
          return json(res, {
            ok: false,
            error: "Level 0 training requires no stake."
          }, 400);
        }

        if (
          vault.level > 0 &&
          (
            !Number.isInteger(requestedStake) ||
            requestedStake < 1 ||
            requestedStake > vault.level
          )
        ) {
          return json(res, {
            ok: false,
            error: `Invalid stake. Valid range: 1-${vault.level}.`
          }, 400);
        }

        const words = vaultRandomWords(vault.level);
        const secretWord = words[crypto.randomInt(words.length)];
        const sessionId = crypto.randomUUID();

        vaultSessions.set(sessionId, {
          username,
          stake: requestedStake,
          words,
          secretWord,
          attempts: VAULT_MAX_ATTEMPTS,
          createdAt: Date.now()
        });

        return json(res, {
          ok: true,
          sessionId,
          stake: requestedStake,
          attempts: VAULT_MAX_ATTEMPTS,
          words,
          message: "Security matrix loaded. Password candidate list generated."
        });
      });

      // POST /api/vault/hack/guess
      server.middlewares.use("/api/vault/hack/guess", async (req, res) => {
        vaultCors(req, res);

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method !== "POST") {
          return json(res, {}, 405);
        }

        if (rejectUntrustedOrigin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;
        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req);
        const result = vaultRequireUser(users, username);

        if (result.error) {
          return json(res, { ok: false, error: result.error }, 401);
        }

        const sessionId = String(body.sessionId || "");
        const session = vaultSessions.get(sessionId);

        if (!session) {
          return json(res, {
            ok: false,
            error: "Hacking session expired or does not exist."
          }, 400);
        }

        if (session.username !== username) {
          return json(res, {
            ok: false,
            error: "Hacking session belongs to another account."
          }, 403);
        }

        const guess = String(body.guess || "").trim().toUpperCase();

        if (!session.words.includes(guess)) {
          return json(res, {
            ok: false,
            error: "Word is not part of the active matrix."
          }, 400);
        }

        const user = result.user;
        const vault = vaultEnsureUser(user);

        if (guess === session.secretWord) {
          const reward = session.stake === 0 ? 1 : session.stake * 2;

          vault.level = Math.min(
            VAULT_MAX_LEVEL,
            vault.level + reward
          );

          vault.highestLevel = Math.max(
            vault.highestLevel,
            vault.level
          );

          vault.hacksCompleted += 1;
          vault.hacksWon += 1;

          for (
            const [filename, requiredLevel]
            of Object.entries(VAULT_FILE_LEVELS)
          ) {
            if (
              requiredLevel > 0 &&
              vault.highestLevel >= requiredLevel &&
              !vault.unlockedFiles.includes(filename)
            ) {
              vault.unlockedFiles.push(filename);
            }
          }

          writeJSON(USERS_FILE, users);
          vaultSessions.delete(sessionId);

          return json(res, {
            ok: true,
            result: "win",
            level: vault.level,
            highestLevel: vault.highestLevel,
            unlockedFiles: vault.unlockedFiles,
            reward,
            message: `ACCESS GRANTED. Clearance increased to Level ${vault.level}.`
          });
        }

        session.attempts -= 1;
        const matches = vaultMatches(guess, session.secretWord);

        if (session.attempts > 0) {
          return json(res, {
            ok: true,
            result: "incorrect",
            matches,
            attemptsRemaining: session.attempts
          });
        }

        vault.level = Math.max(
          0,
          vault.level - session.stake
        );

        vault.hacksCompleted += 1;
        vault.hacksLost += 1;

        writeJSON(USERS_FILE, users);
        vaultSessions.delete(sessionId);

        return json(res, {
          ok: true,
          result: "loss",
          level: vault.level,
          highestLevel: vault.highestLevel,
          unlockedFiles: vault.unlockedFiles,
          attemptsRemaining: 0,
          penalty: session.stake,
          message: `ACCESS DENIED. Clearance reduced to Level ${vault.level}.`
        });
      });

      // POST /api/vault/hack/abort
      server.middlewares.use("/api/vault/hack/abort", async (req, res) => {
        vaultCors(req, res);

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method !== "POST") {
          return json(res, {}, 405);
        }

        if (rejectUntrustedOrigin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;
        const username = await vaultIdentity(req);
        const sessionId = String(body.sessionId || "");
        const session = vaultSessions.get(sessionId);

        if (session && session.username === username) {
          vaultSessions.delete(sessionId);
        }

        return json(res, {
          ok: true,
          result: "aborted"
        });
      });

      // GET /api/vault/files/:filename
      server.middlewares.use("/api/vault/files", async (req, res) => {
        vaultCors(req, res);

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method !== "GET") {
          return json(res, {}, 405);
        }

        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req);
        const result = vaultRequireUser(users, username);

        if (result.error) {
          return json(res, { ok: false, error: result.error }, 401);
        }

        const rawPath = req.url.split("?")[0].replace(/^\/+/, "");
        const filename = decodeURIComponent(rawPath);
        const required = VAULT_FILE_LEVELS[filename];

        if (required === undefined) {
          return json(res, {
            ok: false,
            error: "File not found."
          }, 404);
        }

        const vault = vaultEnsureUser(result.user);

        const unlocked =
          required === 0 ||
          vault.highestLevel >= required ||
          vault.unlockedFiles.includes(filename);

        if (!unlocked) {
          return json(res, {
            ok: false,
            error: `Level ${required} clearance required.`
          }, 403);
        }

        return json(res, {
          ok: true,
          filename,
          requiredLevel: required,
          content: VAULT_FILE_CONTENT[filename] || ""
        });
      });

      // ── POSTS: save (admin only) ──────────────────────────────────────
      server.middlewares.use("/api/save-post", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (!requireAdmin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;

        const id = cleanText(body.id, 120).trim();
        if (!isPostId(id)) return json(res, { ok: false, error: "Invalid post id." }, 400);
        if (!body.title || !body.summary) {
          return json(res, { ok: false, error: "Title and summary are required." }, 400);
        }

        const dir = path.resolve("public/posts");
        const post = {
          id,
          title: cleanText(body.title, 200),
          category: cleanText(body.category, 40) || "Tech",
          summary: cleanText(body.summary, 400),
          heroImage: isSafeAssetUrl(body.heroImage) ? body.heroImage : "",
          content: sanitizeHtml(typeof body.content === "string" ? body.content : ""),
          linkText: cleanText(body.linkText, 60) || "Read Entry",
          linkUrl: `/post/${id}`,
          date: cleanText(body.date, 80),
          timestamp: Number.isFinite(body.timestamp) ? body.timestamp : Date.now(),
          publishDate: typeof body.publishDate === "string" ? cleanText(body.publishDate, 40) || null : null,
          backLabel: cleanText(body.backLabel, 60),
          backHref: isSafeAssetUrl(body.backHref) ? body.backHref : "/",
        };

        try {
          fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(post, null, 2));
          _updateManifest(dir, post, false);
          json(res, { ok: true });
        } catch (e) {
          console.error("[save-post]", e.message);
          json(res, { ok: false, error: "Could not save post." }, 500);
        }
      });

      // ── POSTS: delete (admin only) ────────────────────────────────────
      server.middlewares.use("/api/delete-post", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (!requireAdmin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;

        const id = cleanText(body.id, 120).trim();
        if (!isPostId(id)) return json(res, { ok: false, error: "Invalid post id." }, 400);

        try {
          const dir = path.resolve("public/posts");
          const file = path.join(dir, `${id}.json`);
          if (fs.existsSync(file)) fs.unlinkSync(file);
          _updateManifest(dir, { id }, true);
          json(res, { ok: true });
        } catch (e) {
          console.error("[delete-post]", e.message);
          json(res, { ok: false, error: "Could not delete post." }, 500);
        }
      });

      // ── SIDEBAR CONFIG ────────────────────────────────────────────────
      function sanitizeSidebar(cfg) {
        if (!cfg || typeof cfg !== "object") return null;
        const items = Array.isArray(cfg.nowBuilding) ? cfg.nowBuilding.slice(0, 20) : [];
        const nowBuilding = items.map(item => ({
          title: cleanText(item && item.title, 80),
          desc: cleanText(item && item.desc, 160),
          color: /^#[0-9a-f]{3,8}$/i.test(String((item && item.color) || "")) ? item.color : "#6366f1",
        })).filter(item => item.title);
        const pct = Number(cfg.eaglePercent);
        return {
          nowBuilding,
          eaglePercent: Number.isFinite(pct) ? Math.min(100, Math.max(0, Math.round(pct))) : 0,
          aiReflectionEnabled: cfg.aiReflectionEnabled !== false,
        };
      }

      server.middlewares.use("/api/sidebar-config", async (req, res) => {
        if (req.method === "GET") {
          const cfg = readJSON(SIDEBAR_FILE, null);
          return json(res, cfg || {});
        }
        if (req.method === "POST") {
          if (rejectUntrustedOrigin(req, res)) return;
          if (!requireAdmin(req, res)) return;
          const body = await readBody(req, res);
          if (!body) return;
          const cfg = sanitizeSidebar(body);
          if (!cfg) return json(res, { ok: false, error: "Invalid sidebar config." }, 400);
          writeJSON(SIDEBAR_FILE, cfg);
          return json(res, { ok: true });
        }
        json(res, {}, 405);
      });

      // ── AUTH: admin session ───────────────────────────────────────────
      const DUMMY_HASH = hashPassword(crypto.randomBytes(32).toString("hex"));
      const digest = value => crypto.createHash("sha256").update(String(value)).digest("hex");

      server.middlewares.use("/api/admin/login", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (limited(res, adminLoginLimiter(clientIp(req)))) return;
        const body = await readBody(req, res);
        if (!body) return;

        if (!ADMIN_PASSWORD) {
          return json(res, { ok: false, error: "Admin login is not configured on this server." }, 503);
        }
        const password = typeof body.password === "string" ? body.password : "";
        if (!safeEqual(digest(password), digest(ADMIN_PASSWORD))) {
          return json(res, { ok: false, error: "Wrong admin password." }, 401);
        }
        setSession(req, res, ADMIN_COOKIE, { role: "admin" });
        json(res, { ok: true });
      });

      server.middlewares.use("/api/admin/session", (req, res) => {
        if (req.method !== "GET") return json(res, {}, 405);
        json(res, { ok: true, isAdmin: isAdminRequest(req) });
      });

      server.middlewares.use("/api/admin/logout", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        revokeToken(cookies(req)[ADMIN_COOKIE]);
        clearSession(req, res, ADMIN_COOKIE);
        json(res, { ok: true });
      });

      // ── AUTH: register ────────────────────────────────────────────────
      server.middlewares.use("/api/register", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (limited(res, registerLimiter(clientIp(req)))) return;
        const body = await readBody(req, res);
        if (!body) return;

        const clean = cleanText(body.username, 64).trim().toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";

        if (!isUsername(clean)) {
          return json(res, { ok: false, error: "Username must be 3-64 characters (letters, numbers, . _ @ -)." });
        }
        if (password.length < 8 || password.length > 200) {
          return json(res, { ok: false, error: "Password must be 8-200 characters." });
        }

        const users = readJSON(USERS_FILE, []);
        if (!Array.isArray(users)) return json(res, { ok: false, error: "Account store unavailable." }, 500);
        if (users.find(u => u.username === clean)) {
          return json(res, { ok: false, error: "Account already exists for that username." });
        }

        users.push({ username: clean, passwordHash: hashPassword(password), createdAt: Date.now() });
        writeJSON(USERS_FILE, users);
        setSession(req, res, USER_COOKIE, { role: "user", username: clean });
        json(res, { ok: true, username: clean });
      });

      // ── AUTH: login ───────────────────────────────────────────────────
      server.middlewares.use("/api/login", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;

        const clean = cleanText(body.username, 64).trim().toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";
        if (limited(res, loginLimiter(`${clientIp(req)}|${clean}`))) return;

        const users = readJSON(USERS_FILE, []);
        const user = Array.isArray(users) ? users.find(u => u.username === clean) : null;
        const verdict = verifyPassword(password, user ? user.passwordHash : DUMMY_HASH);

        if (!user || !verdict.ok) {
          return json(res, { ok: false, error: "Wrong username or password." }, 401);
        }
        if (verdict.needsRehash) {
          user.passwordHash = hashPassword(password);
          writeJSON(USERS_FILE, users);
        }
        setSession(req, res, USER_COOKIE, { role: "user", username: clean });
        json(res, { ok: true, username: clean });
      });

      // ── AUTH: current user / logout ───────────────────────────────────
      server.middlewares.use("/api/me", (req, res) => {
        if (req.method !== "GET") return json(res, {}, 405);
        const username = currentUser(req);
        json(res, username ? { ok: true, username } : { ok: false });
      });

      server.middlewares.use("/api/logout", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        revokeToken(cookies(req)[USER_COOKIE]);
        clearSession(req, res, USER_COOKIE);
        json(res, { ok: true });
      });

      // ── AUTH: reset another account's password (admin only) ───────────
      server.middlewares.use("/api/reset-password", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (!requireAdmin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;

        const clean = cleanText(body.username, 64).trim().toLowerCase();
        const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
        if (!isUsername(clean) || newPassword.length < 8 || newPassword.length > 200) {
          return json(res, { ok: false, error: "Invalid account or password (8-200 characters)." }, 400);
        }

        const users = readJSON(USERS_FILE, []);
        const idx = Array.isArray(users)
          ? users.findIndex(u => String(u.username || "").trim().toLowerCase() === clean)
          : -1;
        if (idx === -1) return json(res, { ok: false, error: "No such account." }, 404);

        users[idx].passwordHash = hashPassword(newPassword);
        writeJSON(USERS_FILE, users);
        json(res, { ok: true });
      });

      // ── COMMENTS ──────────────────────────────────────────────────────
      server.middlewares.use("/api/comments/all", async (req, res) => {
        if (req.method !== "GET") return json(res, {}, 405);
        if (!requireAdmin(req, res)) return;
        const comments = readJSON(COMMENTS_FILE, []);
        json(res, Array.isArray(comments) ? comments : []);
      });

      server.middlewares.use("/api/comments/delete", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        if (rejectUntrustedOrigin(req, res)) return;
        if (!requireAdmin(req, res)) return;
        const body = await readBody(req, res);
        if (!body) return;

        const id = cleanText(body.id, 80);
        if (!id) return json(res, { ok: false, error: "Missing comment id." }, 400);
        const comments = readJSON(COMMENTS_FILE, []);
        writeJSON(COMMENTS_FILE, (Array.isArray(comments) ? comments : []).filter(c => c.id !== id));
        json(res, { ok: true });
      });

      server.middlewares.use("/api/comments", async (req, res) => {
        if (req.method === "GET") {
          const url = new URL(req.url, "http://localhost");
          const postId = url.searchParams.get("postId");
          if (!isPostId(postId)) return json(res, { ok: false, error: "Invalid post id." }, 400);
          const comments = readJSON(COMMENTS_FILE, []);
          return json(res, (Array.isArray(comments) ? comments : []).filter(c => c.postId === postId));
        }
        if (req.method === "POST") {
          if (rejectUntrustedOrigin(req, res)) return;
          const username = currentUser(req);
          if (!username) return json(res, { ok: false, error: "Sign in to comment." }, 401);
          if (limited(res, commentLimiter(`${clientIp(req)}|${username}`))) return;

          const body = await readBody(req, res);
          if (!body) return;
          const postId = cleanText(body.postId, 120);
          const text = cleanText(body.text, 2000).trim();
          if (!isPostId(postId) || !text) return json(res, { ok: false, error: "Missing fields." }, 400);

          const comments = readJSON(COMMENTS_FILE, []);
          const list = Array.isArray(comments) ? comments : [];
          const comment = { id: crypto.randomUUID(), postId, username, text, timestamp: Date.now() };
          list.push(comment);
          writeJSON(COMMENTS_FILE, list);
          return json(res, { ok: true, comment });
        }
        json(res, {}, 405);
      });

      // ── RATINGS ───────────────────────────────────────────────────────
      server.middlewares.use("/api/ratings", async (req, res) => {
        if (req.method === "GET") {
          const url = new URL(req.url, "http://localhost");
          const postId = url.searchParams.get("postId");
          if (!isPostId(postId)) return json(res, { ok: false, error: "Invalid post id." }, 400);
          const ratings = readJSON(RATINGS_FILE, {});
          const r = (ratings && typeof ratings[postId] === "object" && ratings[postId]) || { up: 0, down: 0, votes: {} };
          return json(res, { up: r.up || 0, down: r.down || 0 });
        }
        if (req.method === "POST") {
          if (rejectUntrustedOrigin(req, res)) return;
          const username = currentUser(req);
          if (!username) return json(res, { ok: false, error: "Sign in to vote." }, 401);
          if (limited(res, voteLimiter(`${clientIp(req)}|${username}`))) return;

          const body = await readBody(req, res);
          if (!body) return;
          const postId = cleanText(body.postId, 120);
          const vote = body.vote;
          if (!isPostId(postId) || !["up", "down"].includes(vote)) {
            return json(res, { ok: false, error: "Invalid vote." }, 400);
          }

          const ratings = readJSON(RATINGS_FILE, {});
          const store = ratings && typeof ratings === "object" ? ratings : {};
          if (!store[postId] || typeof store[postId] !== "object") {
            store[postId] = { up: 0, down: 0, votes: {} };
          }
          const r = store[postId];
          r.up = Number(r.up) || 0;
          r.down = Number(r.down) || 0;
          if (!r.votes || typeof r.votes !== "object") r.votes = {};

          const prev = r.votes[username];
          if (prev === vote) {
            r[vote] = Math.max(0, r[vote] - 1);
            delete r.votes[username];
          } else {
            if (prev) r[prev] = Math.max(0, r[prev] - 1);
            r[vote] += 1;
            r.votes[username] = vote;
          }
          writeJSON(RATINGS_FILE, store);
          return json(res, { ok: true, up: r.up, down: r.down, userVote: r.votes[username] || null });
        }
        json(res, {}, 405);
      });

      // The scraper makes outbound requests to third-party sites, so it stays admin-only.
      const requireAdminForScraper = (req, res, next) => {
        if (req.method === "OPTIONS") return next();
        if (!isAdminRequest(req)) return json(res, { ok: false, error: "Unauthorized." }, 401);
        next();
      };
      server.middlewares.use("/api/scrape-car", requireAdminForScraper);
      server.middlewares.use("/api/scrape-debug", requireAdminForScraper);

      const scraper = await loadScraper();
      if (scraper && typeof scraper.registerScrapingRoutes === "function") scraper.registerScrapingRoutes(server);
      if (scraper && typeof scraper.registerDebugRoute === "function") scraper.registerDebugRoute(server);
    }
  };
}

function _updateManifest(dir, post, remove) {
  const mp = path.join(dir, "manifest.json");
  let manifest = readJSON(mp, []);
  if (remove) {
    manifest = manifest.filter(p => p.id !== post.id);
  } else {
    const idx = manifest.findIndex(p => p.id === post.id);
    const entry = {
      id: post.id, title: post.title, category: post.category,
      summary: post.summary, heroImage: post.heroImage,
      timestamp: post.timestamp, linkUrl: post.linkUrl || `/post/${post.id}`,
      linkText: post.linkText || "Read Entry", date: post.date,
      publishDate: post.publishDate || null,
    };
    if (idx >= 0) manifest[idx] = entry; else manifest.unshift(entry);
    manifest.sort((a, b) => b.timestamp - a.timestamp);
  }
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2));
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), apiPlugin(env)],
    server: {
      port: 3000,
      // Behind nginx the dev server only needs to listen locally; override with DEV_HOST if needed.
      host: env.DEV_HOST || "127.0.0.1",
      allowedHosts: ["life.minescout.net"],
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      // Never serve runtime records, secrets or certificates over HTTP.
      fs: {
        deny: [".env", ".env.*", "data/**", "**/data/**", "*.{crt,pem,key}", "**/.git/**"],
      },
    },
  };
});
 