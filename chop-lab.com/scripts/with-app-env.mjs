#!/usr/bin/env node
/**
 * Run a command with `.grok/app-env.json` and a local `.env` merged into its
 * environment.
 *
 * `dev`, `build` and `preview` all route through this wrapper, so the dev
 * server, the built bundle and the preview server can never disagree about
 * `VITE_AUTH_ENABLED` — a divergence that only shows up as a built-output
 * mismatch long after the fact. Anything that starts Vite directly bypasses it.
 *
 * `.grok/app-env.json` is a build-flag carrier: only `VITE_`-prefixed keys are
 * honored, because only those reach the browser. A git-ignored `.env` at the
 * workspace root is the local secret store (SMTP credentials today), and every
 * key in it is passed to the child process — server code reads those from
 * `process.env`, and Vite still exposes only the `VITE_`-prefixed ones to the
 * client. The Life dev server reads the same root file (see
 * `life.minescout.net/server/env.js`), so SMTP is configured once for both.
 *
 * Layers, lowest to highest: `.grok/app-env.json`, the process environment, the
 * shared root `.env`, then a `chop-lab.com/.env` next to this app. A non-empty
 * file value wins — that is the file the developer edits. Empty values are
 * ignored so an untouched `.env.example` cannot blank an injected secret. On
 * deploy there are no `.env` files, so the provider's environment is used.
 *
 * Vite picks the values up because `loadEnv` prefix-matches entries already in
 * `process.env`, which is why the merge has to happen before Vite starts.
 */
import { spawn } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { constants as osConstants } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ENV_REL_PATH = ".grok/app-env.json";
export const DOTENV_REL_PATH = ".env";
/** The one file the whole workspace reads: `<repo>/.env`. */
export const SHARED_DOTENV_REL_PATH = "../.env";

const VITE_PREFIX = "VITE_";

/**
 * Parse an app-env document, keeping only `VITE_`-prefixed string entries.
 * Anything unparseable is an empty environment — a workspace without the file
 * must behave exactly like today (auth on, no overrides).
 */
export function parseAppEnv(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {};
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const env = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!key.startsWith(VITE_PREFIX)) continue;
    if (typeof value !== "string") continue;
    env[key] = value;
  }
  return env;
}

/** The app env recorded under `root`, or `{}` when the file is absent. */
export function readAppEnv(root) {
  try {
    return parseAppEnv(readFileSync(join(root, APP_ENV_REL_PATH), "utf8"));
  } catch {
    return {};
  }
}

function dotEnvValue(rawValue) {
  const value = rawValue.trim();
  for (const quote of ['"', "'"]) {
    if (!value.startsWith(quote)) continue;
    const end = value.lastIndexOf(quote);
    if (end > 0) return value.slice(1, end);
  }
  // Unquoted: a `#` after whitespace starts an inline comment.
  return value.replace(/\s+#.*$/, "").trim();
}

/**
 * Parse a dotenv document into a string map.
 *
 * Deliberately small: comments, blank lines, an optional `export` prefix, and
 * single- or double-quoted values. Values are taken literally (no escape
 * expansion) so a password is never mangled. A malformed line is skipped
 * rather than aborting the file, so one typo cannot stop the dev server.
 */
export function parseDotEnv(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    env[key] = dotEnvValue(rawValue);
  }
  return env;
}

/** The local `.env` under `root`, or `{}` when the file is absent. */
export function readDotEnv(root) {
  try {
    return parseDotEnv(readFileSync(join(root, DOTENV_REL_PATH), "utf8"));
  } catch {
    return {};
  }
}

/**
 * The environment a wrapped command runs with: app-env flags, then the real
 * process environment, then the shared root `.env`, then the local `.env`.
 *
 * Non-empty `.env` values win, so the file the user edits is authoritative for
 * their dev server. Empty values are ignored, so copying `.env.example` without
 * filling it in never blanks a secret the platform injected. On deploy there is
 * no `.env` (it is git-ignored), so the provider's environment is used.
 */
export function resolveEnv(root, processEnv, sharedRoot = dirname(root)) {
  const layer = (dir) =>
    Object.fromEntries(Object.entries(readDotEnv(dir)).filter(([, value]) => value !== ""));
  return { ...readAppEnv(root), ...processEnv, ...layer(sharedRoot), ...layer(root) };
}

/** File values under the process environment: an explicit override wins. */
export function mergeAppEnv(appEnv, processEnv) {
  return { ...appEnv, ...processEnv };
}

/**
 * Translate a child's `exit` `(code, signal)` into this process's exit status.
 *
 * Do not re-raise the signal with `process.kill(process.pid, signal)`: under
 * qemu-user (amd64 image builds on an arm host) a self-directed signal is
 * routinely delivered as SIGSEGV to the wrong process, which takes down the
 * test worker and fails the image build. `128 + signo` is what a shell reports
 * for a signal-killed command, so a cancelled `vite build` is still a failure.
 */
export function exitStatusFromChild(code, signal) {
  if (signal) {
    const signo = osConstants.signals[signal];
    return 128 + (typeof signo === "number" ? signo : 1);
  }
  return code ?? 1;
}

/** The workspace root (this file lives in `<root>/scripts/`). */
export function projectRoot() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

/**
 * Whether `moduleUrl` is the script node was asked to run.
 *
 * Both sides are resolved through symlinks: node realpaths `import.meta.url`
 * but leaves `process.argv[1]` as typed, so comparing them raw makes a CLI
 * launched through a symlinked path (`/tmp` on macOS) a silent no-op.
 */
export function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

function main(argv) {
  const [command, ...args] = argv;
  if (!command) {
    console.error("usage: node scripts/with-app-env.mjs <command> [args…]");
    process.exit(2);
  }
  const env = resolveEnv(projectRoot(), process.env);
  const child = spawn(command, args, { stdio: "inherit", env });
  // The dev server is long-running and is stopped by signalling this wrapper.
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("error", (err) => {
    console.error(`[with-app-env] failed to run ${command}:`, err?.message || err);
    process.exit(127);
  });
  child.on("exit", (code, signal) => {
    process.exit(exitStatusFromChild(code, signal));
  });
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}
