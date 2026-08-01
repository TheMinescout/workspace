import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function apiPlugin() {
  return {
    name: "post-api",
    configureServer(server) {

      // SAVE (create or update)
      server.middlewares.use("/api/save-post", (req, res) => {
        if (req.method !== "POST") { res.statusCode=405; res.end(); return; }
        let body = "";
        req.on("data", d => body += d);
        req.on("end", () => {
          try {
            const post = JSON.parse(body);
            const dir  = path.resolve("public/posts");
            fs.writeFileSync(path.join(dir, `${post.id}.json`), JSON.stringify(post, null, 2));
            _updateManifest(dir, post, false);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch(e) { res.statusCode=500; res.end(JSON.stringify({error:e.message})); }
        });
      });

      // DELETE
      server.middlewares.use("/api/delete-post", (req, res) => {
        if (req.method !== "POST") { res.statusCode=405; res.end(); return; }
        let body = "";
        req.on("data", d => body += d);
        req.on("end", () => {
          try {
            const { id } = JSON.parse(body);
            const dir    = path.resolve("public/posts");
            const file   = path.join(dir, `${id}.json`);
            if (fs.existsSync(file)) fs.unlinkSync(file);
            _updateManifest(dir, { id }, true);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true }));
          } catch(e) { res.statusCode=500; res.end(JSON.stringify({error:e.message})); }
        });
      });
    }
  };
}

function _updateManifest(dir, post, remove) {
  const mp = path.join(dir, "manifest.json");
  let manifest = JSON.parse(fs.readFileSync(mp, "utf8"));
  if (remove) {
    manifest = manifest.filter(p => p.id !== post.id);
  } else {
    const idx = manifest.findIndex(p => p.id === post.id);
    const entry = {
      id: post.id, title: post.title, category: post.category,
      summary: post.summary, heroImage: post.heroImage,
      timestamp: post.timestamp, linkUrl: post.linkUrl || `/post/${post.id}`,
      linkText: post.linkText || "Read Entry", date: post.date,
    };
    if (idx >= 0) manifest[idx] = entry; else manifest.unshift(entry);
    manifest.sort((a, b) => b.timestamp - a.timestamp);
  }
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2));
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: { port: 3000, host: true },
});
