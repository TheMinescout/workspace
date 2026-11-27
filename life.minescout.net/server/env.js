import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Local secrets can live in one file for the whole workspace: `<repo>/.env`.
 * Both this dev server and the Chop Lab read it, so SMTP is configured once.
 *
 * The workspace is also deployed as separate site folders, each with its own
 * `.env`. To keep the relay working whichever folder holds the SMTP account,
 * the loader reads every site's file too. The app's own `.env` is applied last
 * so it still wins; sibling sites only contribute the mail keys, so a
 * `VITE_`-prefixed value from another site cannot leak into this app. The
 * process environment (how a deploy injects secrets) is the base layer.
 *
 * The parser is deliberately small — comments, blank lines, an optional
 * `export` prefix, and quoted values. Values are taken literally so a password
 * containing `#` or spaces is never mangled.
 */

/** The site folders that may each carry a `.env`. */
export const SITE_DIRS = [
  "minescout.net",
  "beta.minescout.net",
  "life.minescout.net",
  "chop-lab.com",
];

/** The only keys a sibling site's `.env` may contribute to this app. */
export const MAIL_ENV_KEYS = [
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_FROM_NAME",
  "STUDIO_INBOX",
  "STUDIO_EMAIL",
  "STUDIO_PASSCODE",
];

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
 * Merge the layers. Empty values are dropped so an untouched `.env.example`
 * copied to `.env` cannot blank a secret that is already set.
 *
 * Order, lowest to highest: the process environment, the workspace root
 * `.env`, every sibling site's mail keys, then the app's own `.env` last.
 * Reading the sibling files means SMTP keeps working when the account lives in
 * another site's folder; the own file still wins when it sets a value.
 */
export function resolveMailEnv(base, appDir, root = workspaceRoot()) {
  const env = { ...base };
  const apply = (layer, keys) => {
    for (const [key, value] of Object.entries(layer)) {
      if (value === "") continue;
      if (keys && !keys.includes(key)) continue;
      env[key] = value;
    }
  };
  apply(readDotEnv(root));
  for (const name of SITE_DIRS) {
    const dir = join(root, name);
    if (appDir && dir === appDir) continue;
    apply(readDotEnv(dir), MAIL_ENV_KEYS);
  }
  if (appDir) apply(readDotEnv(appDir));
  return env;
}
