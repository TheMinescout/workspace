import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import { buildMessages, createMailHandler, mailConfig, FORM_NAMES } from "../server/mail.js";

const SMTP = { SMTP_USER: "studio@example.com", SMTP_PASSWORD: "app-password" };

/** A request that ends immediately with `body`, as the middleware expects. */
function fakeReq({ method = "POST", body, headers = {}, ip = "203.0.113.7" } = {}) {
  const req = new EventEmitter();
  req.method = method;
  req.url = "/api/mail";
  req.socket = { remoteAddress: ip };
  req.headers = {
    "content-type": "application/json",
    "x-forwarded-for": ip,
    ...headers,
  };
  if (method === "POST") {
    process.nextTick(() => {
      req.emit("data", Buffer.from(typeof body === "string" ? body : JSON.stringify(body ?? {})));
      req.emit("end");
    });
  }
  return req;
}

function fakeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    end(chunk) {
      this.payload = chunk ? JSON.parse(chunk) : null;
    },
  };
  return res;
}

async function call(handler, options) {
  const req = fakeReq(options);
  const res = fakeRes();
  await handler(req, res);
  return res;
}

const valid = {
  "minescout/contact": { name: "Ada", email: "ada@example.com", message: "Hello there." },
  "minescout/studio-consult": {
    name: "Ada",
    email: "ada@example.com",
    notes: "Wants a storefront",
    transcript: "user: hi\nassistant: hello",
  },
  "minescout/studio-intake": {
    business: "Ada Clay",
    contact: "Ada",
    email: "ada@example.com",
    phone: "555-0100",
    website: "adaclay.example",
    faqs: "Open weekends?",
    pricing: "$40/hour",
    logistics: "Studio visits by appointment",
    tone: "Warm and plain",
  },
  "minescout/lawn-care": {
    name: "Ada",
    address: "1 Main St",
    email: "ada@example.com",
    lotSize: "5000",
    quote: "$25.00 / cut",
    notes: "Side gate sticks",
  },
  "life/feature-request": {
    title: "Dark mode",
    name: "Ada",
    email: "ada@example.com",
    priority: "High",
    description: "Please add a dark theme.",
  },
  "beta/inquiry": { sender: "Ada", subject: "Hello", body: "Quick question." },
  "beta/feature-request": {
    sender: "Ada",
    title: "Keyboard shortcuts",
    priority: "MED",
    description: "Add j/k navigation.",
  },
};

test("every form builds at least one message addressed to the studio inbox", () => {
  for (const form of FORM_NAMES) {
    const messages = buildMessages({ ...SMTP, STUDIO_INBOX: "inbox@example.com" }, {
      form,
      fields: valid[form],
    });
    assert.ok(messages.length >= 1, `${form} built nothing`);
    for (const message of messages) {
      assert.ok(message.to.length >= 1, `${form} has no recipient`);
      assert.ok(message.subject.length > 0, `${form} has no subject`);
      assert.match(message.html, /<html>/);
    }
    assert.ok(
      messages.some((m) => m.to.includes("inbox@example.com")),
      `${form} never reaches the studio inbox`,
    );
  }
});

test("the browser cannot choose a recipient", () => {
  const messages = buildMessages(SMTP, {
    form: "minescout/contact",
    fields: { ...valid["minescout/contact"], to: "victim@example.com", bcc: "victim@example.com" },
  });
  assert.deepEqual(messages[0].to, ["theminescout@minescout.net"]);
});

test("the intake form confirms to the client in a separate message", () => {
  const messages = buildMessages(SMTP, {
    form: "minescout/studio-intake",
    fields: valid["minescout/studio-intake"],
  });
  assert.equal(messages.length, 2);
  assert.ok(!messages[0].to.includes("ada@example.com"), "the report leaks the client address");
  assert.deepEqual(messages[1].to, ["ada@example.com"]);
});

test("form input is escaped into the html", () => {
  const messages = buildMessages(SMTP, {
    form: "minescout/contact",
    fields: {
      name: "Ada <script>alert(1)</script>",
      email: "ada@example.com",
      message: "<img src=x onerror=alert(1)>",
    },
  });
  assert.ok(!messages[0].html.includes("<script>"));
  assert.ok(!messages[0].html.includes("<img src=x"));
  assert.ok(messages[0].html.includes("&lt;script&gt;"));
});

test("missing and malformed fields are rejected with a readable message", () => {
  assert.throws(
    () => buildMessages(SMTP, { form: "minescout/contact", fields: { name: "Ada" } }),
    /Email is required/,
  );
  assert.throws(
    () =>
      buildMessages(SMTP, {
        form: "minescout/contact",
        fields: { name: "Ada", email: "not-an-email", message: "hi" },
      }),
    /not a valid address/,
  );
  assert.throws(() => buildMessages(SMTP, { form: "nope/nope", fields: {} }), /Unknown form/);
});

test("mailConfig needs both credentials and defaults to Gmail", () => {
  assert.equal(mailConfig({}), null);
  assert.equal(mailConfig({ SMTP_USER: "a@b.c" }), null);
  const config = mailConfig({ SMTP_USER: "a@b.c", SMTP_PASSWORD: "x" });
  assert.equal(config.host, "smtp.gmail.com");
  assert.equal(config.port, 587);
  assert.equal(config.inbox, "theminescout@minescout.net");
});

test("GET reports whether email is configured", async () => {
  const unset = await call(createMailHandler({}), { method: "GET" });
  assert.deepEqual(unset.payload, { ok: true, configured: false });

  const set = await call(createMailHandler(SMTP), { method: "GET" });
  assert.deepEqual(set.payload, { ok: true, configured: true });
});

test("an unconfigured server answers 503 instead of pretending to send", async () => {
  const res = await call(createMailHandler({}), {
    body: { form: "minescout/contact", fields: valid["minescout/contact"] },
  });
  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.ok, false);
});

test("a filled honeypot is accepted and dropped", async () => {
  const res = await call(createMailHandler(SMTP), {
    body: {
      form: "minescout/contact",
      fields: valid["minescout/contact"],
      website: "http://spam.example",
    },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.id, "ignored");
});

test("validation failures answer 400 before any send", async () => {
  const res = await call(createMailHandler(SMTP), {
    body: { form: "minescout/contact", fields: { name: "Ada", email: "ada@example.com" } },
  });
  assert.equal(res.statusCode, 400);
  assert.match(res.payload.error, /Message is required/);
});

test("wrong method, wrong content type and oversized bodies are refused", async () => {
  const handler = createMailHandler(SMTP);
  const wrongMethod = await call(handler, { method: "PUT" });
  assert.equal(wrongMethod.statusCode, 405);

  const wrongType = await call(handler, {
    body: { form: "minescout/contact", fields: {} },
    headers: { "content-type": "text/plain" },
  });
  assert.equal(wrongType.statusCode, 415);

  const oversized = await call(handler, { body: "x".repeat(70 * 1024) });
  assert.equal(oversized.statusCode, 413);
});

test("the burst limit stops a scripted run from the same address", async () => {
  // Unconfigured on purpose: the limiter runs before the config check, so this
  // exercises the limit without opening a real SMTP connection.
  const handler = createMailHandler({});
  const body = { form: "minescout/contact", fields: valid["minescout/contact"] };
  let last;
  for (let i = 0; i < 7; i += 1) last = await call(handler, { body });
  assert.equal(last.statusCode, 429);
  assert.ok(last.headers["retry-after"]);

  const other = await call(handler, { body, ip: "198.51.100.9" });
  assert.equal(other.statusCode, 503);
});
