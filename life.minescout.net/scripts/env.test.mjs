import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseDotEnv, readDotEnv, resolveMailEnv } from "../server/env.js";

function tempDir(files = {}) {
  const dir = mkdtempSync(join(tmpdir(), "mail-env-"));
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
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
