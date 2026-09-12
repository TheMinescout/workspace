import { createServerFn } from "@tanstack/react-start";

// Deployed Google Apps Script Web App (doPost sends the email via GmailApp,
// doGet checks the studio passcode). Calling it from a TanStack server
// function avoids browser CORS/preflight issues with Apps Script's
// ContentService responses.
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbz7MJE7mNY1A-SvbdHGV3yI6-ftBElB1wOth4MqEABvJXLI5SNzeqiG2r7PJBpWvcAiOg/exec";

// Where new tool requests get forwarded so Thomas sees them land.
// GmailApp.sendEmail in the Apps Script sends from whichever Google
// account owns that script — this is just the studio's own address for
// the copy. Swap this for the real inbox you want requests to land in.
export const STUDIO_EMAIL = "orders@chop-lab.com";

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
  .validator(
    (data: {
      to: string[];
      subject: string;
      htmlBody: string;
      fromName?: string;
      bcc?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
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
      const json = (await res.json()) as { status?: string; message?: string };
      if (json.status !== "success") {
        return { success: false, error: json.message ?? "Send failed" };
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Could not reach the send service.",
      };
    }
  });

// Back-compat alias — the invoice page was built against this name first.
export const sendInvoiceEmail = sendStudioEmail;
