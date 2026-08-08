import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import crypto from "crypto";

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
      const DATA = path.resolve("data");
      const USERS_FILE    = path.join(DATA, "users.json");
      const COMMENTS_FILE = path.join(DATA, "comments.json");
      const RATINGS_FILE  = path.join(DATA, "ratings.json");
      const SIDEBAR_FILE  = path.join(DATA, "sidebar-config.json");
      fs.mkdirSync(DATA, { recursive: true });

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
        
        // 🔴 CHANGED: We removed the regex replace() so it keeps the @ and .
        const clean = username.trim().toLowerCase();
        
        // 🔴 CHANGED: Updated the error text to reflect that emails are allowed
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

      // ── AUTH: reset password (NEW) ────────────────────────────────────
server.middlewares.use("/api/reset-password", async (req, res) => {
        if (req.method !== "POST") return json(res, {}, 405);
        const { username, newPassword } = await parseBody(req);
        
        // Preserve standard email casing/symbols while trimming accidental spaces
        const clean = (username || "").trim().toLowerCase();
        
        if (!clean || !newPassword || newPassword.length < 4) {
          return json(res, { ok: false, error: "Invalid request or password too short." });
        }

        const users = readJSON(USERS_FILE, []);
        // Make sure we match against the stored email field cleanly
        const userIndex = users.findIndex(u => (u.username || "").trim().toLowerCase() === clean);

        // If we can't find the email in the file, fail out
        if (userIndex === -1) {
          return json(res, { ok: false, error: "No account found with that email." });
        }

        // Overwrite the old hash with the newly generated hash
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
            // toggle off
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
  server: { port: 3000, host: true, allowedHosts: ["life.minescout.net"] },
});