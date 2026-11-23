/**
 * The one place every Minescout site sends email from.
 *
 * `minescout.net`, `beta.minescout.net` and `life.minescout.net` are served to
 * the browser, so none of them can hold SMTP credentials or open an SMTP
 * socket. They POST a form here instead, and this module renders the email and
 * sends it over the studio's SMTP account.
 *
 * The browser picks a form, never a recipient. Every address below is decided
 * on the server: an open relay that trusts a client-supplied `to` would let
 * anyone send spam through the studio's Gmail account. Rate limits, a body cap
 * and a required form name are the other guards.
 *
 * SMTP settings come from the environment (see the workspace `.env`):
 *   SMTP_USER, SMTP_PASSWORD  — required, Gmail App Password for the password
 *   SMTP_HOST (smtp.gmail.com), SMTP_PORT (587), SMTP_FROM_NAME
 *   STUDIO_INBOX              — where new leads land
 */
import { clientIp, createRateLimiter } from "./security.js";

const MAX_BODY_BYTES = 64 * 1024;
const DEFAULT_INBOX = "theminescout@minescout.net";

export const FORM_NAMES = [
  "minescout/contact",
  "minescout/studio-consult",
  "minescout/studio-intake",
  "minescout/lawn-care",
  "life/feature-request",
  "beta/inquiry",
  "beta/feature-request",
];

// ── text helpers ───────────────────────────────────────────────────────────

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function safe(value) {
  return esc(value).replace(/\r?\n/g, "<br>");
}

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

class FieldError extends Error {}

/** A trimmed string with a length floor and ceiling, or a `FieldError`. */
function text(fields, key, { label, min = 0, max = 500, required = false } = {}) {
  const raw = fields?.[key];
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value && required) throw new FieldError(`${label ?? key} is required.`);
  if (value && value.length < min) throw new FieldError(`${label ?? key} is too short.`);
  return value.slice(0, max);
}

function email(fields, key, { label = "Email", required = false } = {}) {
  const value = text(fields, key, { label, max: 254, required });
  if (value && !EMAIL_RE.test(value)) throw new FieldError(`${label} is not a valid address.`);
  return value;
}

// ── the card every Minescout email wears ───────────────────────────────────

function card({ brand = "MINESCOUT", kicker, heading, rows = [], body = "", footer = "" }) {
  const rowHtml = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:9px 0;border-bottom:1px solid #ece7de;font-size:12px;color:#8a8175;width:34%;vertical-align:top;">${esc(label)}</td>
          <td style="padding:9px 0;border-bottom:1px solid #ece7de;font-size:13px;color:#1a1916;">${safe(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:28px 14px;background:#efeae1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e8e4dd;">
    <tr>
      <td style="background:#1a1916;padding:20px 28px;">
        <p style="margin:0;font-family:Georgia,serif;font-size:15px;letter-spacing:1.4px;text-transform:uppercase;color:#fff;">${esc(brand)}</p>
        ${kicker ? `<p style="margin:4px 0 0 0;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#ff4d1c;">${esc(kicker)}</p>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding:26px 28px 30px 28px;">
        ${heading ? `<h1 style="margin:0 0 18px 0;font-family:Georgia,serif;font-size:21px;color:#1a1916;">${esc(heading)}</h1>` : ""}
        ${rowHtml ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowHtml}</table>` : ""}
        ${body ? `<div style="margin-top:18px;padding:14px 16px;background:#f9f8f6;border-left:3px solid #ff4d1c;font-size:13px;line-height:1.6;color:#1a1916;">${safe(body)}</div>` : ""}
        ${footer ? `<p style="margin:22px 0 0 0;font-size:11px;color:#8a8175;">${esc(footer)}</p>` : ""}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── one builder per form ───────────────────────────────────────────────────

const BUILDERS = {
  "minescout/contact"(fields, inbox) {
    const name = text(fields, "name", { label: "Name", required: true, max: 120 });
    const from = email(fields, "email", { required: true });
    const message = text(fields, "message", { label: "Message", required: true, max: 5000 });
    return [
      {
        to: [inbox],
        replyTo: from,
        fromName: "Minescout Contact Form",
        subject: `New inquiry from ${name}`,
        html: card({
          kicker: "Minescout Studio / Operations",
          heading: "You have a new message.",
          rows: [["Name", name], ["Email", from]],
          body: message,
          footer: "Reply to this email to answer the sender directly.",
        }),
      },
    ];
  },

  "minescout/studio-consult"(fields, inbox) {
    const name = text(fields, "name", { label: "Name", required: true, max: 120 });
    const from = email(fields, "email", { required: true });
    const notes = text(fields, "notes", { label: "Notes", max: 2000 });
    const transcript = text(fields, "transcript", { label: "Transcript", max: 20000 });
    return [
      {
        to: [inbox],
        replyTo: from,
        fromName: "Minescout Studio",
        subject: `Project spec: ${name} — website consultation`,
        html: card({
          kicker: "Minescout Studio / Project Spec",
          heading: "A client completed the consultation.",
          rows: [["Name", name], ["Email", from], ["Notes", notes || "None"]],
          body: transcript ? `Full consultation transcript:\n\n${transcript}` : "",
          footer: "Reply to this email to answer the client directly.",
        }),
      },
    ];
  },

  "minescout/studio-intake"(fields, inbox) {
    const business = text(fields, "business", { label: "Business", required: true, max: 160 });
    const contact = text(fields, "contact", { label: "Contact", required: true, max: 160 });
    const from = email(fields, "email", { required: true });
    const phone = text(fields, "phone", { label: "Phone", max: 60 });
    const website = text(fields, "website", { label: "Website", max: 300 });
    const faqs = text(fields, "faqs", { label: "FAQs", max: 8000 });
    const pricing = text(fields, "pricing", { label: "Pricing", max: 8000 });
    const logistics = text(fields, "logistics", { label: "Logistics", max: 8000 });
    const tone = text(fields, "tone", { label: "Tone", max: 8000 });
    const details = [
      faqs && `The time-wasters (FAQs):\n${faqs}`,
      pricing && `Pricing structure:\n${pricing}`,
      logistics && `Logistics, hours, and policies:\n${logistics}`,
      tone && `Tone and objectives:\n${tone}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    return [
      {
        to: [inbox],
        replyTo: from,
        fromName: "Minescout Operations",
        subject: `Minescout intelligence file: ${business}`,
        html: card({
          kicker: "Minescout Studio / Intelligence File",
          heading: business,
          rows: [
            ["Primary contact", contact],
            ["Email", from],
            ["Phone", phone],
            ["Website", website],
          ],
          body: details,
          footer: "Auto-generated from the Studio intake form.",
        }),
      },
      {
        to: [from],
        fromName: "Minescout Studio",
        subject: `We received your intelligence file — ${business}`,
        html: card({
          kicker: "Minescout Studio / Received",
          heading: "Your intake is in.",
          rows: [
            ["Business", business],
            ["Contact", contact],
            ["Email", from],
            ["Phone", phone],
            ["Website", website],
          ],
          body: "Thomas has the file and will follow up by email with the next step. Nothing is charged today.",
          footer: "Reply to this email if anything needs correcting.",
        }),
      },
    ];
  },

  "minescout/lawn-care"(fields, inbox) {
    const name = text(fields, "name", { label: "Name", required: true, max: 120 });
    const address = text(fields, "address", { label: "Address", required: true, max: 300 });
    const from = email(fields, "email", { required: true });
    const lotSize = text(fields, "lotSize", { label: "Lot size", max: 40 });
    const quote = text(fields, "quote", { label: "Quote", max: 40 });
    const notes = text(fields, "notes", { label: "Notes", max: 2000 });
    return [
      {
        to: [inbox],
        replyTo: from,
        fromName: "SmartCut Lead Bot",
        subject: `New SmartCut assessment request — ${name}`,
        html: card({
          brand: "SMARTCUT",
          kicker: "SmartCut Neighborhood",
          heading: "New lead generated.",
          rows: [
            ["Client name", name],
            ["Property address", address],
            ["Email", from],
            ["Lot size", lotSize ? `${lotSize} sq ft` : "Not provided"],
            ["Estimated price", quote || "Not calculated"],
            ["Notes", notes || "None provided"],
          ],
          footer: "Submitted through the SmartCut web form. Hit reply to answer the customer directly.",
        }),
      },
    ];
  },

  "life/feature-request"(fields, inbox) {
    const title = text(fields, "title", { label: "Feature title", required: true, max: 160 });
    const name = text(fields, "name", { label: "Name", max: 100 });
    const from = email(fields, "email", { label: "Reply email" });
    const priority = text(fields, "priority", { label: "Priority", max: 20 }) || "Normal";
    const description = text(fields, "description", {
      label: "Description",
      required: true,
      max: 5000,
    });
    return [
      {
        to: [inbox],
        replyTo: from || undefined,
        fromName: "Minescout Life Feature Requests",
        subject: `Minescout Life feature request: ${title}`,
        html: card({
          brand: "MINESCOUT LIFE",
          kicker: "Feature Request",
          heading: title,
          rows: [
            ["Submitted by", name || "Not provided"],
            ["Reply email", from || "Not provided"],
            ["Priority", priority],
          ],
          body: description,
        }),
      },
    ];
  },

  "beta/inquiry"(fields, inbox) {
    const sender = text(fields, "sender", { label: "From", required: true, max: 180 });
    const subject = text(fields, "subject", { label: "Subject", required: true, max: 180 });
    const body = text(fields, "body", { label: "Message", required: true, max: 5000 });
    return [
      {
        to: [inbox],
        fromName: "Minescout Beta / Contact",
        subject: `Beta contact: ${subject}`,
        html: card({
          brand: "MINESCOUT BETA",
          kicker: "Direct Channel",
          heading: subject,
          rows: [["From", sender]],
          body,
          footer: "Sent from beta.minescout.net.",
        }),
      },
    ];
  },

  "beta/feature-request"(fields, inbox) {
    const sender = text(fields, "sender", { label: "Name", max: 120 }) || "Guest";
    const title = text(fields, "title", { label: "Feature title", required: true, max: 180 });
    const priority = text(fields, "priority", { label: "Priority", max: 20 }) || "MED";
    const description = text(fields, "description", {
      label: "Description",
      required: true,
      max: 5000,
    });
    return [
      {
        to: [inbox],
        fromName: "Minescout Beta / Requests",
        subject: `Beta feature request: ${title}`,
        html: card({
          brand: "MINESCOUT BETA",
          kicker: "Feature Request",
          heading: title,
          rows: [["Name", sender], ["Priority", priority]],
          body: description,
        }),
      },
    ];
  },
};

// ── public API ─────────────────────────────────────────────────────────────

/** The SMTP settings for this process, or null when email is not configured. */
export function mailConfig(env = process.env) {
  const user = String(env.SMTP_USER || "").trim();
  const pass = String(env.SMTP_PASSWORD || "").trim();
  if (!user || !pass) return null;
  const port = Number(env.SMTP_PORT || 587);
  return {
    user,
    pass,
    host: String(env.SMTP_HOST || "smtp.gmail.com"),
    port: Number.isFinite(port) ? port : 587,
    fromName: String(env.SMTP_FROM_NAME || "Minescout"),
    inbox: String(env.STUDIO_INBOX || env.STUDIO_EMAIL || DEFAULT_INBOX).trim(),
  };
}

/**
 * Turn a posted form into the messages it should send.
 * Throws `FieldError` with a user-facing message when a field is invalid.
 */
export function buildMessages(env, { form, fields }) {
  const builder = BUILDERS[form];
  if (!builder) throw new FieldError("Unknown form.");
  const config = mailConfig(env);
  const inbox = config ? config.inbox : DEFAULT_INBOX;
  return builder(fields ?? {}, inbox);
}

async function sendOne(config, message) {
  const nodemailer = await import("nodemailer").then((mod) => mod.default);
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  try {
    await transport.sendMail({
      from: `"${message.fromName || config.fromName}" <${config.user}>`,
      to: message.to.join(", "),
      replyTo: message.replyTo,
      subject: message.subject,
      html: message.html,
    });
  } finally {
    transport.close();
  }
}

function readJson(req) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    let tooLarge = false;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (tooLarge) return resolve({ tooLarge: true });
      try {
        resolve({ body: JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") });
      } catch {
        resolve({ invalid: true });
      }
    });
    req.on("error", () => resolve({ invalid: true }));
  });
}

function reply(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(payload));
}

/**
 * The `/api/mail` middleware. Two limits: a short burst limit that stops a
 * single visitor hammering the form, and an hourly cap that bounds the damage
 * from a scripted run.
 */
export function createMailHandler(env) {
  const burst = createRateLimiter({ windowMs: 10 * 60_000, max: 6, name: "mail-10m" });
  const hourly = createRateLimiter({ windowMs: 60 * 60_000, max: 40, name: "mail-1h" });

  return async function mailHandler(req, res) {
    if (req.method === "GET") {
      return reply(res, 200, { ok: true, configured: Boolean(mailConfig(env)) });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return reply(res, 405, { ok: false, error: "Method not allowed." });
    }
    if (!String(req.headers["content-type"] || "").includes("application/json")) {
      return reply(res, 415, { ok: false, error: "Content-Type must be application/json." });
    }

    const ip = clientIp(req);
    for (const limiter of [burst, hourly]) {
      const verdict = limiter(ip);
      if (!verdict.allowed) {
        res.setHeader("Retry-After", String(verdict.retryAfter));
        return reply(res, 429, {
          ok: false,
          error: "Too many messages from this connection. Please wait and try again.",
        });
      }
    }

    const parsed = await readJson(req);
    if (parsed.tooLarge) return reply(res, 413, { ok: false, error: "Message is too large." });
    if (parsed.invalid) return reply(res, 400, { ok: false, error: "Malformed request." });

    const { form, fields, website } = parsed.body ?? {};
    // Honeypot: a real visitor never fills the hidden field.
    if (typeof website === "string" && website.trim()) {
      return reply(res, 200, { ok: true, id: "ignored" });
    }

    const config = mailConfig(env);
    if (!config) {
      console.warn("[mail] SMTP is not configured — add SMTP_USER and SMTP_PASSWORD to .env");
      return reply(res, 503, {
        ok: false,
        error: "Email is not configured on this server yet.",
      });
    }

    let messages;
    try {
      messages = buildMessages(env, { form, fields });
    } catch (err) {
      if (err instanceof FieldError) return reply(res, 400, { ok: false, error: err.message });
      console.error("[mail] could not build message", err);
      return reply(res, 400, { ok: false, error: "Could not build that message." });
    }

    try {
      for (const message of messages) await sendOne(config, message);
    } catch (err) {
      console.error(`[mail] ${form} send failed:`, err?.message || err);
      return reply(res, 502, {
        ok: false,
        error: "The mail server rejected that message.",
      });
    }

    const id = `${form}-${Date.now().toString(36)}`;
    console.log(`[mail] sent ${id} (${messages.length} message${messages.length === 1 ? "" : "s"})`);
    return reply(res, 200, { ok: true, id });
  };
}
