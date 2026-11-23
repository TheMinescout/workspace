import { createServerFn } from "@tanstack/react-start";

// Legacy Google Apps Script Web App. Its `doPost` (which used to send mail)
// rejects every request, so it is no longer a send path — but `doGet` still
// answers the studio passcode check, so it stays as the fallback for that.
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbz7MJE7mNY1A-SvbdHGV3yI6-ftBElB1wOth4MqEABvJXLI5SNzeqiG2r7PJBpWvcAiOg/exec";

// Where new tool requests get forwarded so Thomas sees them land.
export const STUDIO_EMAIL = "tmcarlston11@gmail.com";

export type MailAttachment = {
  filename: string;
  contentType: string;
  /** Base64 content without a `data:` prefix. */
  content: string;
};

type MailPayload = {
  to: string[];
  subject: string;
  htmlBody: string;
  fromName?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: MailAttachment[];
};

export type SendResult = {
  success: boolean;
  error?: string;
  transport?: "smtp" | "none";
};

const MAX_RECIPIENTS = 5;
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function smtpCredentials() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return user && pass ? { user, pass } : null;
}

const MISSING_SMTP =
  "Order email is not configured on this server. Add SMTP_USER and SMTP_PASSWORD to the workspace .env file and restart the server (see EMAIL-SETUP.md).";

async function sendViaSmtp(
  data: MailPayload,
  creds: { user: string; pass: string },
): Promise<void> {
  let nodemailer: typeof import("nodemailer").default;
  try {
    ({ default: nodemailer } = await import("nodemailer"));
  } catch {
    throw new Error("Mail transport is unavailable on this server (nodemailer is not installed).");
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: creds,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });

  try {
    const attachments = (data.attachments ?? []).map((a) => ({
      filename: a.filename,
      content: a.content,
      encoding: "base64" as const,
      contentType: a.contentType,
    }));

    await transport.sendMail({
      from: `"${data.fromName ?? "The Chop Lab"}" <${creds.user}>`,
      to: data.to.join(", "),
      bcc: data.bcc,
      replyTo: data.replyTo,
      subject: data.subject,
      html: data.htmlBody,
      attachments: attachments.length ? attachments : undefined,
    });
  } finally {
    transport.close();
  }
}

/** Constant-time compare so the passcode cannot be timed out of the response. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const checkStudioPasscode = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const configured = process.env.STUDIO_PASSCODE ?? "";
    if (configured) return { success: safeEqual(data.password, configured) };

    // No passcode in the environment yet: ask the Apps Script, whose doGet
    // still answers. Set STUDIO_PASSCODE to drop this dependency.
    try {
      const res = await fetch(`${GAS_URL}?password=${encodeURIComponent(data.password)}`);
      const json = (await res.json()) as { success?: boolean };
      return { success: Boolean(json.success) };
    } catch {
      return { success: false, error: "Could not reach the studio auth service." };
    }
  });

export const sendStudioEmail = createServerFn({ method: "POST" })
  .validator((data: MailPayload) => data)
  .handler(async ({ data }): Promise<SendResult> => {
    if (!data.to.length || data.to.length > MAX_RECIPIENTS) {
      return { success: false, error: "Invalid recipient list.", transport: "none" };
    }
    const attachmentBytes = (data.attachments ?? []).reduce(
      (sum, a) => sum + Math.ceil(a.content.length * 0.75),
      0,
    );
    if (attachmentBytes > MAX_ATTACHMENT_BYTES) {
      return { success: false, error: "Attachments are too large.", transport: "none" };
    }

    const creds = smtpCredentials();
    if (!creds) return { success: false, error: MISSING_SMTP, transport: "none" };

    try {
      await sendViaSmtp(data, creds);
      return { success: true, transport: "smtp" };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "SMTP send failed.",
        transport: "smtp",
      };
    }
  });

// Back-compat alias — the invoice page was built against this name first.
export const sendInvoiceEmail = sendStudioEmail;

/**
 * Which transport the server will use. The delivery queue shows this so a
 * missing `.env` is visible before the next order fails.
 */
export const mailTransportStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ transport: "smtp" | "unconfigured"; passcodeFromEnv: boolean }> => ({
    transport: smtpCredentials() ? "smtp" : "unconfigured",
    passcodeFromEnv: Boolean(process.env.STUDIO_PASSCODE),
  }),
);
