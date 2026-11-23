import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Local secrets live in one file for the whole workspace: `<repo>/.env`. Both
 * this dev server and the Chop Lab read it, so SMTP is configured once. A
 * `life.minescout.net/.env` next to this app still wins when it exists, and the
 * process environment (how a deploy injects secrets) is the base layer.
 *
 * The parser is deliberately small — comments, blank lines, an optional
 * `export` prefix, and quoted values. Values are taken literally so a password
 * containing `#` or spaces is never mangled.
 */
export function parseDotEnv(text) {
  const env = {};
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    let parsed = value;
    for (const quote of ['"', "'"]) {
      if (value.startsWith(quote)) {
        const end = value.lastIndexOf(quote);
        if (end > 0) {
          parsed = value.slice(1, end);
          break;
        }
      }
    }
    if (parsed === value) parsed = value.replace(/\s+#.*$/, "").trim();
    env[key] = parsed;
  }
  return env;
}

/** The `.env` under `dir`, or `{}` when there is none. */
export function readDotEnv(dir) {
  try {
    return parseDotEnv(readFileSync(join(dir, ".env"), "utf8"));
  } catch {
    return {};
  }
}

/** The repository root (this file lives in `<root>/life.minescout.net/server/`). */
export function workspaceRoot() {
  return dirname(dirname(dirname(fileURLToPath(import.meta.url))));
}

/**
 * Merge the three layers. Empty values are dropped so an untouched
 * `.env.example` copied to `.env` cannot blank a secret that is already set.
 */
export function resolveMailEnv(base, appDir, root = workspaceRoot()) {
  const fileLayers = [readDotEnv(root), appDir ? readDotEnv(appDir) : {}];
  const env = { ...base };
  for (const layer of fileLayers) {
    for (const [key, value] of Object.entries(layer)) {
      if (value !== "") env[key] = value;
    }
  }
  return env;
}
