import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import {
  APP_ENV_REL_PATH,
  DOTENV_REL_PATH,
  mergeAppEnv,
  parseAppEnv,
  parseDotEnv,
  projectRoot,
  readAppEnv,
  readDotEnv,
  resolveEnv,
} from "./with-app-env.mjs";

const execFileAsync = promisify(execFile);
const WRAPPER = join(projectRoot(), "scripts/with-app-env.mjs");
const PRINT_FLAG = "process.stdout.write(String(process.env.VITE_AUTH_ENABLED));";

function makeWorkspace(appEnvJson) {
  const root = mkdtempSync(join(tmpdir(), "app-env-"));
  if (appEnvJson !== undefined) {
    mkdirSync(join(root, ".grok"), { recursive: true });
    writeFileSync(join(root, APP_ENV_REL_PATH), appEnvJson);
  }
  return root;
}

test("keeps VITE_-prefixed string entries", () => {
  assert.deepEqual(parseAppEnv('{"VITE_AUTH_ENABLED":"false"}'), {
    VITE_AUTH_ENABLED: "false",
  });
});

test("drops non-VITE keys, non-string values and malformed documents", () => {
  assert.deepEqual(parseAppEnv('{"DATABASE_URL":"postgres://x","VITE_N":1,"VITE_OK":"y"}'), {
    VITE_OK: "y",
  });
  assert.deepEqual(parseAppEnv("not json"), {});
  assert.deepEqual(parseAppEnv('["VITE_AUTH_ENABLED"]'), {});
  assert.deepEqual(parseAppEnv("null"), {});
});

test("a missing app-env.json is a clean no-op", () => {
  assert.deepEqual(readAppEnv(makeWorkspace()), {});
});

test("reads the app env from a workspace", () => {
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"false"}');
  assert.deepEqual(readAppEnv(root), { VITE_AUTH_ENABLED: "false" });
});

test("parses a dotenv file with comments, export and quotes", () => {
  const text = [
    "# local secrets",
    "",
    "SMTP_USER=studio@example.com",
    "export SMTP_PASSWORD='abcd efgh ijkl mnop'",
    'SMTP_HOST="smtp.gmail.com" # inline comment',
    "SMTP_PORT=587 # port",
    "EMPTY=",
    "not a valid line",
  ].join("\n");
  assert.deepEqual(parseDotEnv(text), {
    SMTP_USER: "studio@example.com",
    SMTP_PASSWORD: "abcd efgh ijkl mnop",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "587",
    EMPTY: "",
  });
});

test("dotenv values are literal, so a password is never mangled", () => {
  assert.deepEqual(parseDotEnv('SMTP_PASSWORD="a\\nb"'), {
    SMTP_PASSWORD: "a\\nb",
  });
});

test("a missing .env is a clean no-op", () => {
  assert.deepEqual(readDotEnv(makeWorkspace()), {});
});

test("a .env is read from a workspace", () => {
  const root = makeWorkspace();
  writeFileSync(join(root, DOTENV_REL_PATH), "SMTP_USER=studio@example.com\n");
  assert.deepEqual(readDotEnv(root), { SMTP_USER: "studio@example.com" });
});

test("a non-empty .env beats the process env; empty values are ignored", () => {
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"false"}');
  writeFileSync(
    join(root, DOTENV_REL_PATH),
    ["VITE_AUTH_ENABLED=true", "SMTP_USER=from-dotenv", "SMTP_PASSWORD="].join("\n"),
  );

  const merged = resolveEnv(root, {
    SMTP_USER: "from-process",
    SMTP_PASSWORD: "from-process",
    PATH: "/usr/bin",
  });
  assert.equal(merged.VITE_AUTH_ENABLED, "true");
  assert.equal(merged.SMTP_USER, "from-dotenv");
  assert.equal(merged.SMTP_PASSWORD, "from-process");
  assert.equal(merged.PATH, "/usr/bin");
});

test("a sibling site's .env supplies SMTP when the shared root does not", () => {
  // Chop Lab and the Life relay are deployed as separate folders. Reading the
  // sibling files keeps sending working when the SMTP account lives elsewhere.
  const shared = mkdtempSync(join(tmpdir(), "app-env-sites-"));
  const root = join(shared, "chop-lab.com");
  mkdirSync(root, { recursive: true });
  mkdirSync(join(shared, "life.minescout.net"), { recursive: true });
  writeFileSync(
    join(shared, "life.minescout.net", DOTENV_REL_PATH),
    "SMTP_USER=life@example.com\nSMTP_PASSWORD=life-pass\n",
  );

  const env = resolveEnv(root, { PATH: "/usr/bin" }, shared);
  assert.equal(env.SMTP_USER, "life@example.com");
  assert.equal(env.SMTP_PASSWORD, "life-pass");
});

test("the app's own .env wins over a sibling site's mail keys", () => {
  const shared = mkdtempSync(join(tmpdir(), "app-env-sites-"));
  const root = join(shared, "chop-lab.com");
  mkdirSync(root, { recursive: true });
  mkdirSync(join(shared, "life.minescout.net"), { recursive: true });
  writeFileSync(
    join(shared, "life.minescout.net", DOTENV_REL_PATH),
    "SMTP_USER=sibling@example.com\nSMTP_PASSWORD=sibling\n",
  );
  writeFileSync(join(root, DOTENV_REL_PATH), "SMTP_USER=own@example.com\n");

  const env = resolveEnv(root, {}, shared);
  assert.equal(env.SMTP_USER, "own@example.com");
  assert.equal(env.SMTP_PASSWORD, "sibling");
});

test("a sibling site's .env cannot contribute non-mail keys", () => {
  const shared = mkdtempSync(join(tmpdir(), "app-env-sites-"));
  const root = join(shared, "chop-lab.com");
  mkdirSync(root, { recursive: true });
  mkdirSync(join(shared, "beta.minescout.net"), { recursive: true });
  writeFileSync(
    join(shared, "beta.minescout.net", DOTENV_REL_PATH),
    "SMTP_USER=beta@example.com\nVITE_AUTH_ENABLED=false\n",
  );

  const env = resolveEnv(root, { VITE_AUTH_ENABLED: "true" }, shared);
  assert.equal(env.SMTP_USER, "beta@example.com");
  assert.equal(env.VITE_AUTH_ENABLED, "true");
});

test("an explicit process-env override wins over the file", () => {
  const merged = mergeAppEnv(
    { VITE_AUTH_ENABLED: "false" },
    { VITE_AUTH_ENABLED: "true", PATH: "/usr/bin" },
  );
  assert.equal(merged.VITE_AUTH_ENABLED, "true");
  assert.equal(merged.PATH, "/usr/bin");
});

test("a workspace app-env can ship auth off and accept an explicit override", () => {
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"false"}');
  assert.deepEqual(readAppEnv(root), { VITE_AUTH_ENABLED: "false" });
  assert.equal(resolveEnv(root, {}).VITE_AUTH_ENABLED, "false");
  assert.equal(resolveEnv(root, { VITE_AUTH_ENABLED: "true" }).VITE_AUTH_ENABLED, "true");
});

test("vite loadEnv resolves the wrapped value", () => {
  // What `import.meta.env.VITE_AUTH_ENABLED` becomes: loadEnv prefix-matches
  // process.env, so the wrapper's merge has to land before Vite starts.
  // Do not `import { loadEnv } from "vite"` here — Vite 8 loads rolldown
  // native bindings that SIGSEGV the test worker under qemu-user.
  const root = makeWorkspace('{"VITE_AUTH_ENABLED":"false"}');
  const merged = mergeAppEnv(readAppEnv(root), { PATH: "/usr/bin" });
  assert.equal(merged.VITE_AUTH_ENABLED, "false");
});

test("the wrapped command receives its explicit process environment", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [WRAPPER, process.execPath, "-e", PRINT_FLAG],
    { env: { ...process.env, VITE_AUTH_ENABLED: "false" } },
  );
  assert.equal(stdout, "false");
});

test("the wrapped command sees an explicit override, not the file value", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [WRAPPER, process.execPath, "-e", PRINT_FLAG],
    { env: { ...process.env, VITE_AUTH_ENABLED: "true" } },
  );
  assert.equal(stdout, "true");
});

test("the wrapper propagates the command's exit code", async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [WRAPPER, process.execPath, "-e", "process.exit(3)"]),
    (err) => err.code === 3,
  );
});

test("a signal-killed command is never reported as success", async () => {
  // The wrapper's own SIGTERM handler must not swallow the re-raised signal:
  // a cancelled build reporting exit 0 is a silently passing gate.
  await assert.rejects(
    execFileAsync(process.execPath, [
      WRAPPER,
      process.execPath,
      "-e",
      "process.kill(process.pid, 'SIGTERM');setTimeout(() => {}, 1000);",
    ]),
    (err) => err.signal === "SIGTERM" || err.code !== 0,
  );
});

test("the CLI still runs when invoked through a symlinked path", async () => {
  // node realpaths import.meta.url but not process.argv[1], so a raw comparison
  // turns the wrapper into a no-op that exits 0 without starting anything.
  const link = join(mkdtempSync(join(tmpdir(), "app-env-link-")), "scripts");
  symlinkSync(join(projectRoot(), "scripts"), link);
  const { stdout } = await execFileAsync(process.execPath, [
    join(link, "with-app-env.mjs"),
    process.execPath,
    "-e",
    PRINT_FLAG,
  ]);
  // The wrapper passes `resolveEnv(...)` through unchanged, so an unset value
  // stays unset: assert the resolved value, not a default it never applies.
  assert.equal(stdout, String(resolveEnv(projectRoot(), process.env).VITE_AUTH_ENABLED));
});
