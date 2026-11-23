import { createServerFn } from "@tanstack/react-start";

// Legacy Google Apps Script Web App (doPost sends the email via GmailApp,
// doGet checks the studio passcode). Kept as a fallback for deployments with
// no SMTP credentials. Its current doPost rejects every request with
// "Unauthorized", so SMTP is the primary transport whenever it is configured.
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
  transport?: "smtp" | "apps-script";
};

const MAX_RECIPIENTS = 5;
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function smtpCredentials() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  return user && pass ? { user, pass } : null;
}

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

async function sendViaAppsScript(data: MailPayload): Promise<SendResult> {
  if (data.attachments?.length) {
    return {
      success: false,
      error:
        "Attachments need SMTP. Add SMTP_USER and SMTP_PASSWORD to .env (or the server environment) and restart.",
      transport: "apps-script",
    };
  }
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: data.to,
        subject: data.subject,
        htmlBody: data.htmlBody,
        fromName: data.fromName ?? "The Chop Lab",
        bcc: data.bcc,
      }),
    });
    // The deployment redirects to an HTML error page when doPost rejects the
    // request, so a blind res.json() would surface "Unexpected token '<'".
    let json: { status?: string; message?: string } | null = null;
    try {
      json = (await res.json()) as { status?: string; message?: string };
    } catch {
      json = null;
    }
    if (!json) {
      return {
        success: false,
        error: `The Apps Script send service returned an unexpected response (HTTP ${res.status}). Add SMTP_USER and SMTP_PASSWORD to .env to send over SMTP.`,
        transport: "apps-script",
      };
    }
    if (json.status !== "success") {
      return {
        success: false,
        error: json.message ?? "Send failed",
        transport: "apps-script",
      };
    }
    return { success: true, transport: "apps-script" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not reach the send service.",
      transport: "apps-script",
    };
  }
}

export const checkStudioPasscode = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const url = `${GAS_URL}?password=${encodeURIComponent(data.password)}`;
    try {
      const res = await fetch(url);
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
      return { success: false, error: "Invalid recipient list." };
    }
    const attachmentBytes = (data.attachments ?? []).reduce(
      (sum, a) => sum + Math.ceil(a.content.length * 0.75),
      0,
    );
    if (attachmentBytes > MAX_ATTACHMENT_BYTES) {
      return { success: false, error: "Attachments are too large." };
    }

    const creds = smtpCredentials();
    if (!creds) return sendViaAppsScript(data);

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
  async (): Promise<{ transport: "smtp" | "apps-script" }> => ({
    transport: smtpCredentials() ? "smtp" : "apps-script",
  }),
);
