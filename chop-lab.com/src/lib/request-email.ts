import { money } from "@/lib/utils";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CARD_OPEN = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:32px 16px;background-color:#EDE7DC;font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(28,23,18,0.08);">
    <tr>
      <td style="padding:32px 40px 24px 40px;border-bottom:1px solid #EFEAE2;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:12px;">
            <img src="https://chop-lab.com/logo-48.png" width="36" height="36" alt="The Chop Lab" style="display:block;" />
          </td>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:15px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1C1712;">The Chop Lab</p>
            <p style="margin:0;font-size:12px;font-weight:600;color:#D86A46;">CAD meets Clay</p>
          </td>`;

function specRows(specs: Record<string, string>) {
  return Object.entries(specs)
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #EFEAE2;font-size:13px;color:#8A8176;width:42%;">${escapeHtml(k)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #EFEAE2;font-size:13px;color:#1C1712;font-weight:500;">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");
}

/**
 * Receipt-style confirmation sent to the customer after they submit a
 * request — "here's what we received," not step-by-step instructions.
 */
export function buildRequestReceiptEmail({
  requestId,
  customerName,
  productName,
  estimate,
  specs,
  notes,
  createdAt,
}: {
  requestId: string;
  customerName: string;
  productName: string;
  estimate: number;
  specs: Record<string, string>;
  notes: string;
  createdAt: string;
}) {
  return `${CARD_OPEN}
          <td style="vertical-align:middle;text-align:right;width:100%;">
            <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;">Receipt</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#1C1712;">${escapeHtml(requestId)}</p>
          </td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <p style="margin:0;font-size:14px;color:#6F665C;">Hi ${escapeHtml(customerName || "there")},</p>
        <p style="margin:12px 0 0 0;font-size:14px;line-height:1.6;color:#3A3F42;">
          This confirms we received your request. Nothing has been charged —
          Thomas will review the specs below, build the CAD model, and follow
          up with a final quote by email before any production starts.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#F7F3EB;border-radius:8px;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;">Item</p>
              <p style="margin:0;font-size:17px;font-weight:600;color:#1C1712;">${escapeHtml(productName)}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;font-size:14px;">
          ${specRows(specs)}
          ${notes ? `<tr><td style="padding:10px 0;font-size:13px;color:#8A8176;width:42%;vertical-align:top;">Notes</td><td style="padding:10px 0;font-size:13px;color:#3A3F42;white-space:pre-wrap;">${escapeHtml(notes)}</td></tr>` : ""}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#1C1712;border-radius:8px;">
          <tr>
            <td style="padding:16px 20px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(243,238,228,0.7);">Quote target</td>
            <td style="padding:16px 20px;text-align:right;font-size:22px;font-weight:600;color:#F3EEE4;">${money(estimate)}</td>
          </tr>
        </table>

        <p style="margin:24px 0 0 0;font-size:12px;color:#8A8176;">Submitted ${escapeHtml(createdAt)}. Typical turnaround is 3–5 business days after you approve the CAD.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px 40px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8176;">Thank you for trusting The Chop Lab.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Internal notification sent to the studio inbox so a new request doesn't
 * get missed — includes contact info the customer copy omits.
 */
export function buildStudioNotificationEmail({
  requestId,
  customerName,
  customerEmail,
  studio,
  productName,
  estimate,
  specs,
  notes,
  files,
  createdAt,
}: {
  requestId: string;
  customerName: string;
  customerEmail: string;
  studio: string;
  productName: string;
  estimate: number;
  specs: Record<string, string>;
  notes: string;
  files: string[];
  createdAt: string;
}) {
  const contactSpecs: Record<string, string> = {
    Customer: customerName || "—",
    Email: customerEmail,
    ...(studio ? { Studio: studio } : {}),
    ...specs,
    ...(files.length ? { Files: files.join(", ") } : {}),
  };

  return `${CARD_OPEN}
          <td style="vertical-align:middle;text-align:right;width:100%;">
            <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;">New request</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#1C1712;">${escapeHtml(requestId)}</p>
          </td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <p style="margin:0;font-size:14px;line-height:1.6;color:#3A3F42;">
          A new tool request came in through the site configurator.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background-color:#F7F3EB;border-radius:8px;">
          <tr>
            <td style="padding:20px;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;">Item</p>
              <p style="margin:0;font-size:17px;font-weight:600;color:#1C1712;">${escapeHtml(productName)}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;font-size:14px;">
          ${specRows(contactSpecs)}
          ${notes ? `<tr><td style="padding:10px 0;font-size:13px;color:#8A8176;width:42%;vertical-align:top;">Notes</td><td style="padding:10px 0;font-size:13px;color:#3A3F42;white-space:pre-wrap;">${escapeHtml(notes)}</td></tr>` : ""}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#1C1712;border-radius:8px;">
          <tr>
            <td style="padding:16px 20px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(243,238,228,0.7);">Quote target</td>
            <td style="padding:16px 20px;text-align:right;font-size:22px;font-weight:600;color:#F3EEE4;">${money(estimate)}</td>
          </tr>
        </table>

        <p style="margin:24px 0 0 0;font-size:12px;color:#8A8176;">Submitted ${escapeHtml(createdAt)}.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px 40px 40px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#8A8176;">Reply directly to ${escapeHtml(customerEmail)} to follow up.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
