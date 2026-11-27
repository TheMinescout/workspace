import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { parseDotEnv, readDotEnv, resolveMailEnv } from "../server/env.js";

function tempDir(files = {}) {
  const dir = mkdtempSync(join(tmpdir(), "mail-env-"));
  for (const [name, text] of Object.entries(files)) {
    const target = join(dir, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
  }
  return dir;
}

test("parses comments, export, quotes and inline comments", () => {
  assert.deepEqual(
    parseDotEnv([
      "# secrets",
      "",
      "SMTP_USER=studio@example.com",
      "export SMTP_PASSWORD='app pass word'",
      'SMTP_HOST="smtp.example.com" # trailing note',
      "SMTP_PORT=465",
      "not a line",
    ].join("\n")),
    {
      SMTP_USER: "studio@example.com",
      SMTP_PASSWORD: "app pass word",
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "465",
    },
  );
});

test("a password keeps characters that look like comments or quotes", () => {
  assert.equal(parseDotEnv("SMTP_PASSWORD=abc#def").SMTP_PASSWORD, "abc#def");
  assert.equal(parseDotEnv("SMTP_PASSWORD='p@ss#word'").SMTP_PASSWORD, "p@ss#word");
});

test("a missing .env is an empty map", () => {
  assert.deepEqual(readDotEnv(tempDir()), {});
});

test("the shared workspace .env configures the app, and an app-local .env wins", () => {
  const root = tempDir({ ".env": "SMTP_USER=shared@example.com\nSMTP_PASSWORD=shared\n" });
  const app = tempDir({ ".env": "SMTP_USER=local@example.com\n" });
  const env = resolveMailEnv({ SMTP_PORT: "587" }, app, root);
  assert.equal(env.SMTP_USER, "local@example.com");
  assert.equal(env.SMTP_PASSWORD, "shared");
  assert.equal(env.SMTP_PORT, "587");
});

test("empty file values never blank a value that is already set", () => {
  const root = tempDir({ ".env": "SMTP_USER=\nSMTP_PASSWORD=\n" });
  const env = resolveMailEnv({ SMTP_USER: "shell@example.com" }, tempDir(), root);
  assert.equal(env.SMTP_USER, "shell@example.com");
});

test("a sibling site's .env supplies SMTP when the root and app do not", () => {
  // The workspace is deployed as separate folders, each with its own .env.
  // The relay must still find the account when it lives in another site.
  const root = tempDir({
    "minescout.net/.env": "SMTP_USER=site@example.com\nSMTP_PASSWORD=site-pass\n",
  });
  const app = join(root, "life.minescout.net");
  const env = resolveMailEnv({}, app, root);
  assert.equal(env.SMTP_USER, "site@example.com");
  assert.equal(env.SMTP_PASSWORD, "site-pass");
});

test("the app's own .env wins over a sibling site's mail keys", () => {
  const root = tempDir({
    "chop-lab.com/.env": "SMTP_USER=sibling@example.com\nSMTP_PASSWORD=sibling\n",
    "life.minescout.net/.env": "SMTP_USER=own@example.com\n",
  });
  const app = join(root, "life.minescout.net");
  const env = resolveMailEnv({}, app, root);
  assert.equal(env.SMTP_USER, "own@example.com");
  assert.equal(env.SMTP_PASSWORD, "sibling");
});

test("a sibling site's .env cannot contribute non-mail keys", () => {
  const root = tempDir({
    "beta.minescout.net/.env": "SMTP_USER=beta@example.com\nVITE_AUTH_ENABLED=false\n",
  });
  const env = resolveMailEnv({ VITE_AUTH_ENABLED: "true" }, join(root, "life.minescout.net"), root);
  assert.equal(env.SMTP_USER, "beta@example.com");
  assert.equal(env.VITE_AUTH_ENABLED, "true");
});

test("the app .env is read from a real workspace layout, not the caller's cwd", () => {
  const root = tempDir({
    ".env": "SMTP_USER=root@example.com\n",
    "life.minescout.net/.env": "SMTP_USER=life@example.com\nSMTP_PASSWORD=life-pass\n",
  });
  const env = resolveMailEnv({}, join(root, "life.minescout.net"), root);
  assert.equal(env.SMTP_USER, "life@example.com");
  assert.equal(env.SMTP_PASSWORD, "life-pass");
});
