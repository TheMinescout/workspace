import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { registerScrapingRoutes, registerDebugRoute } from "./data/scraping/scraper.js";

// ── helpers ────────────────────────────────────────────────────────────────
function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw + "ms_salt_2026").digest("hex");
}

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
function parseBody(req) {
  return new Promise(res => {
    let b = "";
    req.on("data", d => b += d);
    req.on("end", () => { try { res(JSON.parse(b)); } catch { res({}); } });
  });
}
function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function apiPlugin() {
  return {
    name: "minescout-api",
    configureServer(server) {
      // Global CORS and preflight handler for all /api/ requests
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith("/api/")) {
          const origin = req.headers.origin || "";
          const allowed = [
            "http://beta.minescout.net",
            "https://beta.minescout.net",
            "http://minescout.net",
            "https://minescout.net",
            "http://www.minescout.net",
            "https://www.minescout.net",
            "http://life.minescout.net",
            "https://life.minescout.net"
          ];

          if (allowed.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Vary", "Origin");
          }
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.setHeader("Access-Control-Allow-Credentials", "true");

          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            return res.end();
          }
        }
        next();
      });
      const DATA = path.resolve("data");
      const USERS_FILE    = path.join(DATA, "users.json");
      const COMMENTS_FILE = path.join(DATA, "comments.json");
      const RATINGS_FILE  = path.join(DATA, "ratings.json");
      const SIDEBAR_FILE  = path.join(DATA, "sidebar-config.json");
      fs.mkdirSync(DATA, { recursive: true });

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
        const origin = req.headers.origin || "";
        const allowed = [
          "http://beta.minescout.net",
          "https://beta.minescout.net",
          "http://minescout.net",
          "https://minescout.net",
          "http://www.minescout.net",
          "https://www.minescout.net",
          "http://life.minescout.net",
          "https://life.minescout.net"
        ];

        if (allowed.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Vary", "Origin");
        }

        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }

      async function vaultIdentity(req, body = {}) {
        const url = new URL(req.url, "http://localhost");
        return vaultNormalize(
          body.username ||
          url.searchParams.get("username") ||
          ""
        );
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

        const body = await parseBody(req);
        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req, body);
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

        const body = await parseBody(req);
        const users = readJSON(USERS_FILE, []);
        const username = await vaultIdentity(req, body);
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

        const body = await parseBody(req);
        const username = await vaultIdentity(req, body);
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

      // ── POSTS: save ───────────────────────────────────────────────────
      server.middlewares.use("/api/save-post", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const post = await parseBody(req);
        try {
          const dir = path.resolve("public/posts");
          fs.writeFileSync(path.join(dir, `${post.id}.json`), JSON.stringify(post, null, 2));
          _updateManifest(dir, post, false);
          json(res, { ok: true });
        } catch(e) { json(res, { error: e.message }, 500); }
      });

      // ── POSTS: delete ─────────────────────────────────────────────────
      server.middlewares.use("/api/delete-post", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { id } = await parseBody(req);
        try {
          const dir  = path.resolve("public/posts");
          const file = path.join(dir, `${id}.json`);
          if (fs.existsSync(file)) fs.unlinkSync(file);
          _updateManifest(dir, { id }, true);
          json(res, { ok: true });
        } catch(e) { json(res, { error: e.message }, 500); }
      });

      // ── SIDEBAR CONFIG ────────────────────────────────────────────────
      server.middlewares.use("/api/sidebar-config", async (req, res) => {
        if (req.method === "GET") {
          const cfg = readJSON(SIDEBAR_FILE, null);
          return json(res, cfg || {});
        }
        if (req.method === "POST") {
          const cfg = await parseBody(req);
          writeJSON(SIDEBAR_FILE, cfg);
          return json(res, { ok: true });
        }
        json(res, {}, 405);
      });

      // ── AUTH: register ────────────────────────────────────────────────
      server.middlewares.use("/api/register", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { username, password } = await parseBody(req);
        if (!username || !password) return json(res, { ok: false, error: "Username and password required." });
        
        const clean = username.trim().toLowerCase();
        
        if (clean.length < 2) return json(res, { ok: false, error: "Account email must be valid." });
        if (password.length < 4) return json(res, { ok: false, error: "Password must be at least 4 characters." });
        
        const users = readJSON(USERS_FILE, []);
        if (users.find(u => u.username === clean)) return json(res, { ok: false, error: "Account already exists for that email." });
        
        users.push({ username: clean, passwordHash: hashPassword(password), createdAt: Date.now() });
        writeJSON(USERS_FILE, users);
        json(res, { ok: true, username: clean });
      });

      // ── AUTH: login ───────────────────────────────────────────────────
      server.middlewares.use("/api/login", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { username, password } = await parseBody(req);
        const clean = (username || "").trim().toLowerCase();
        const users = readJSON(USERS_FILE, []);
        const user  = users.find(u => u.username === clean);
        if (!user || user.passwordHash !== hashPassword(password)) {
          return json(res, { ok: false, error: "Wrong username or password." });
        }
        json(res, { ok: true, username: clean });
      });

      // ── AUTH: reset password ──────────────────────────────────────────
      server.middlewares.use("/api/reset-password", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { username, newPassword } = await parseBody(req);
        
        const clean = (username || "").trim().toLowerCase();
        
        if (!clean || !newPassword || newPassword.length < 4) {
          return json(res, { ok: false, error: "Invalid request or password too short." });
        }

        const users = readJSON(USERS_FILE, []);
        const userIndex = users.findIndex(u => (u.username || "").trim().toLowerCase() === clean);

        if (userIndex === -1) {
          return json(res, { ok: false, error: "No account found with that email." });
        }

        users[userIndex].passwordHash = hashPassword(newPassword);
        writeJSON(USERS_FILE, users);

        json(res, { ok: true });
      });

      // ── COMMENTS: get by post ─────────────────────────────────────────
      server.middlewares.use("/api/comments/all", async (req, res) => {
        if (req.method !== "GET") return json(res, {}, 405);
        const comments = readJSON(COMMENTS_FILE, []);
        json(res, comments);
      });

      server.middlewares.use("/api/comments/delete", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { id } = await parseBody(req);
        let comments = readJSON(COMMENTS_FILE, []);
        comments = comments.filter(c => c.id !== id);
        writeJSON(COMMENTS_FILE, comments);
        json(res, { ok: true });
      });

      server.middlewares.use("/api/comments", async (req, res) => {
        if (req.method === "GET") {
          const url = new URL(req.url, "http://localhost");
          const postId = url.searchParams.get("postId");
          const comments = readJSON(COMMENTS_FILE, []);
          return json(res, postId ? comments.filter(c => c.postId === postId) : comments);
        }
        if (req.method === "POST") {
          const { postId, username, text } = await parseBody(req);
          if (!postId || !username || !text?.trim()) return json(res, { ok: false, error: "Missing fields." });
          const comments = readJSON(COMMENTS_FILE, []);
          const comment = { id: crypto.randomUUID(), postId, username, text: text.trim(), timestamp: Date.now() };
          comments.push(comment);
          writeJSON(COMMENTS_FILE, comments);
          return json(res, { ok: true, comment });
        }
        json(res, {}, 405);
      });

      // ── RATINGS ───────────────────────────────────────────────────────
      server.middlewares.use("/api/ratings", async (req, res) => {
        if (req.method === "GET") {
          const url = new URL(req.url, "http://localhost");
          const postId = url.searchParams.get("postId");
          const ratings = readJSON(RATINGS_FILE, {});
          const r = ratings[postId] || { up: 0, down: 0, votes: {} };
          return json(res, { up: r.up || 0, down: r.down || 0 });
        }
        if (req.method === "POST") {
          const { postId, username, vote } = await parseBody(req);
          if (!postId || !username || !["up","down"].includes(vote)) return json(res, { ok: false });
          const ratings = readJSON(RATINGS_FILE, {});
          if (!ratings[postId]) ratings[postId] = { up: 0, down: 0, votes: {} };
          const r = ratings[postId];
          const prev = r.votes[username];
          if (prev === vote) {
            r[vote] = Math.max(0, (r[vote] || 0) - 1);
            delete r.votes[username];
          } else {
            if (prev) r[prev] = Math.max(0, (r[prev] || 0) - 1);
            r[vote] = (r[vote] || 0) + 1;
            r.votes[username] = vote;
          }
          writeJSON(RATINGS_FILE, ratings);
          return json(res, { ok: true, up: r.up, down: r.down, userVote: r.votes[username] || null });
        }
        json(res, {}, 405);
      });

      registerScrapingRoutes(server);
      registerDebugRoute(server);
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

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: { 
    port: 3000, 
    host: true, 
    allowedHosts: ["life.minescout.net"],
    cors: {
      origin: ['http://beta.minescout.net', 'https://beta.minescout.net'],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  },
});