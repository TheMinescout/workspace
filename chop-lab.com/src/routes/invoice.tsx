import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/products";
import { money } from "@/lib/utils";
import { checkStudioPasscode, sendInvoiceEmail } from "@/lib/studio-mail";

export const Route = createFileRoute("/invoice")({
  component: InvoicePage,
});

const STUDIO_PASSCODE = "Chop-Lab!!!";

type LineItem = { id: string; label: string; note: string; amount: number };

function InvoicePage() {
  const [unlocked, setUnlocked] = useState(false);

  return unlocked ? <InvoiceGenerator /> : <PasscodeGate onUnlock={() => setUnlocked(true)} />;
}

function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(false);

  const submit = async () => {
    if (!password) return;
    setChecking(true);
    setError(false);

    // Hardcoded studio passcode, checked locally first so the tool works
    // even if the Apps Script auth endpoint is unreachable.
    if (password === STUDIO_PASSCODE) {
      setChecking(false);
      onUnlock();
      return;
    }

    try {
      const result = await checkStudioPasscode({ data: { password } });
      if (result.success) {
        onUnlock();
        return;
      }
    } catch {
      // fall through to error state
    }
    setChecking(false);
    setError(true);
  };

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <img src="/logo-192.png" alt="" className="size-16" />
      <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-fg">
        Studio Engine
      </h1>
      <p className="mt-1 text-sm text-muted">Invoice generator access</p>

      <div className="mt-8 w-full">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter passcode"
          className="input text-center tracking-widest"
          autoFocus
        />
        <Button className="mt-4 w-full" onClick={submit} disabled={checking || !password}>
          {checking ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
          Unlock
        </Button>
        {error ? (
          <p className="mt-3 text-xs font-medium text-red-600">
            Access denied. Incorrect passcode.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function InvoiceGenerator() {
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("Chop Lab Order");
  const [catalogSlug, setCatalogSlug] = useState("");
  const [qty, setQty] = useState(1);
  const [printHrs, setPrintHrs] = useState(0);
  const [designMins, setDesignMins] = useState(60);
  const [extraCost, setExtraCost] = useState(0);
  const [surchargePerHr, setSurchargePerHr] = useState(0);
  const [discountVal, setDiscountVal] = useState(0);
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [venmo, setVenmo] = useState("tmcarleton");
  const [notes, setNotes] = useState(
    "Thanks for trusting The Chop Lab. I can't wait to see the crisp impressions it leaves on your pottery!",
  );
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendError, setSendError] = useState("");

  const catalogItem = PRODUCTS.find((p) => p.slug === catalogSlug);
  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    [],
  );

  const { lineItems, discountAmount, total } = useMemo(() => {
    const items: LineItem[] = [];
    let sub = 0;

    if (catalogItem) {
      const lineTotal = catalogItem.basePrice * qty;
      sub += lineTotal;
      items.push({
        id: "catalog",
        label: catalogItem.name,
        note: `Base product (Qty: ${qty})`,
        amount: lineTotal,
      });
    }

    if (printHrs > 0) {
      items.push({
        id: "print",
        label: "3D Printing",
        note: `Logged machine time: ${printHrs} hrs`,
        amount: 0,
      });
      if (surchargePerHr > 0) {
        const surcharge = surchargePerHr * printHrs;
        sub += surcharge;
        items.push({
          id: "surcharge",
          label: "Material surcharge",
          note: `Auto-applied @ ${money(surchargePerHr)}/hr`,
          amount: surcharge,
        });
      }
    }

    const designHrs = designMins / 60;
    if (designMins > 0) {
      items.push({
        id: "design",
        label: "Design & CAD",
        note: `Time spent: ${designHrs.toFixed(2)} hrs`,
        amount: 0,
      });
    }

    if (extraCost > 0) {
      sub += extraCost;
      items.push({ id: "extra", label: "Hardware / adjustments", note: "", amount: extraCost });
    }

    let discount = 0;
    if (discountVal > 0) {
      discount =
        discountType === "percent" ? sub * (Math.min(discountVal, 100) / 100) : discountVal;
      discount = Math.min(discount, sub);
    }

    return { lineItems: items, discountAmount: discount, total: sub - discount };
  }, [catalogItem, qty, printHrs, surchargePerHr, designMins, extraCost, discountVal, discountType]);

  const venmoHandle = venmo.replace("@", "").trim() || "tmcarleton";
  const venmoUrl = `https://venmo.com/?txn=pay&audience=private&recipients=${venmoHandle}&amount=${total.toFixed(
    2,
  )}&note=${encodeURIComponent(`Invoice for ${title} via Chop Lab`)}`;

  const emailHtml = buildInvoiceEmailHtml({
    customerName: email ? email.split("@")[0] : "Client",
    date: today,
    notes,
    lineItems,
    discountAmount,
    discountLabel:
      discountType === "percent" ? `Discount (${discountVal}%)` : `Discount ($${discountVal.toFixed(2)})`,
    total,
    venmoUrl,
    venmoHandle,
  });

  const handleSend = async () => {
    if (!email) return;
    setSendState("sending");
    setSendError("");
    try {
      const result = await sendInvoiceEmail({
        data: {
          to: [email],
          subject: title,
          htmlBody: emailHtml,
          fromName: "The Chop Lab",
        },
      });
      if (result.success) {
        setSendState("sent");
        setTimeout(() => setSendState("idle"), 4000);
      } else {
        setSendError(result.error ?? "Send failed");
        setSendState("error");
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Send failed");
      setSendState("error");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Studio tools</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
        Invoice generator
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Build a custom invoice, preview it exactly as your customer will see it, and send it
        with a one-tap Venmo link.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[380px_1fr]">
        {/* Controls */}
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wider text-fg">
              Dispatch details
            </h2>
            <Field label="Customer email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="input"
              />
            </Field>
            <Field label="Invoice title">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div>
            <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wider text-fg">
              Catalog selection
            </h2>
            <Field label="Base product">
              <select
                value={catalogSlug}
                onChange={(e) => setCatalogSlug(e.target.value)}
                className="input"
              >
                <option value="">— No base item (custom only) —</option>
                {PRODUCTS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — {money(p.basePrice)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quantity">
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="input"
              />
            </Field>
          </div>

          <div>
            <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wider text-fg">
              Logged hours
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Print hours">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={printHrs}
                  onChange={(e) => setPrintHrs(Number(e.target.value) || 0)}
                  className="input"
                />
              </Field>
              <Field label={`Design mins (${(designMins / 60).toFixed(1)} hrs)`}>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={designMins}
                  onChange={(e) => setDesignMins(Number(e.target.value) || 0)}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Surcharge per print hour ($)">
              <input
                type="number"
                min={0}
                step={0.5}
                value={surchargePerHr}
                onChange={(e) => setSurchargePerHr(Number(e.target.value) || 0)}
                className="input"
              />
            </Field>
            <Field label="Extra costs / hardware ($)">
              <input
                type="number"
                min={0}
                step={1}
                value={extraCost}
                onChange={(e) => setExtraCost(Number(e.target.value) || 0)}
                className="input"
              />
            </Field>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <Field label="Discount">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={discountVal}
                  onChange={(e) => setDiscountVal(Number(e.target.value) || 0)}
                  className="input font-medium text-primary"
                />
              </Field>
              <Field label="Discount type">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "flat" | "percent")}
                  className="input"
                >
                  <option value="flat">Flat amount ($)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </Field>
            </div>
          </div>

          <div>
            <h2 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wider text-fg">
              Payment &amp; notes
            </h2>
            <Field label="Venmo username (without @)">
              <input
                type="text"
                value={venmo}
                onChange={(e) => setVenmo(e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Custom message">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="input resize-none"
              />
            </Field>
          </div>
        </section>

        {/* Preview */}
        <section>
          <div className="overflow-hidden rounded-xl border border-border shadow-lift">
            <div className="flex items-center justify-between bg-bg-warm px-4 py-3">
              <Button size="sm" onClick={handleSend} disabled={!email || sendState === "sending"}>
                {sendState === "sending" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : sendState === "sent" ? (
                  <CheckCircle2 className="size-4" />
                ) : sendState === "error" ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <Send className="size-4" />
                )}
                {sendState === "sending"
                  ? "Sending…"
                  : sendState === "sent"
                    ? "Sent!"
                    : sendState === "error"
                      ? "Failed — retry"
                      : "Send to client"}
              </Button>
              <div className="text-right text-xs">
                <p className="font-semibold uppercase text-muted">
                  To:{" "}
                  <span className="ml-1 rounded bg-surface px-1.5 py-0.5 normal-case text-fg">
                    {email || "customer@example.com"}
                  </span>
                </p>
                <p className="mt-1 font-semibold uppercase text-muted">
                  Subj:{" "}
                  <span className="ml-1 rounded bg-surface px-1.5 py-0.5 normal-case text-fg">
                    {title}
                  </span>
                </p>
              </div>
            </div>

            {sendState === "error" && sendError ? (
              <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700">
                {sendError}
              </div>
            ) : null}

            <div className="bg-[#F0EEE9] p-4 sm:p-10">
              <InvoicePreview
                title={title}
                customerName={email ? email.split("@")[0] : "Client"}
                date={today}
                notes={notes}
                lineItems={lineItems}
                discountAmount={discountAmount}
                discountType={discountType}
                discountVal={discountVal}
                total={total}
                venmoUrl={venmoUrl}
                venmoHandle={venmoHandle}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InvoicePreview({
  title,
  customerName,
  date,
  notes,
  lineItems,
  discountAmount,
  discountType,
  discountVal,
  total,
  venmoUrl,
  venmoHandle,
}: {
  title: string;
  customerName: string;
  date: string;
  notes: string;
  lineItems: LineItem[];
  discountAmount: number;
  discountType: "flat" | "percent";
  discountVal: number;
  total: number;
  venmoUrl: string;
  venmoHandle: string;
}) {
  return (
    <div
      className="mx-auto max-w-xl overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(28,23,18,0.08)]"
      style={{ fontFamily: "'Instrument Sans', Helvetica, Arial, sans-serif" }}
    >
      <div
        className="flex items-center gap-3 px-8 pb-6 pt-8 sm:px-10"
        style={{ borderBottom: "1px solid #EFEAE2" }}
      >
        <img src="/logo-48.png" alt="" className="size-9" />
        <div>
          <p className="m-0 text-[15px] font-semibold uppercase tracking-[1.5px] text-[#1C1712]">
            The Chop Lab
          </p>
          <p className="m-0 text-xs font-medium text-[#D86A46]">CAD meets Clay</p>
        </div>
        <div className="ml-auto text-right">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-[#8A8176]">
            Invoice
          </p>
          <p className="m-0 text-sm font-medium text-[#1C1712]">{date}</p>
        </div>
      </div>

      <div className="px-8 pt-6 sm:px-10">
        <p className="m-0 text-sm text-[#6F665C]">
          <span className="font-semibold text-[#1C1712]">Billed to</span> — {customerName}
        </p>
        <h2 className="mb-0 mt-1 font-display text-xl font-medium text-[#1C1712]">{title}</h2>

        <p className="mt-5 whitespace-pre-wrap rounded-md bg-[#F7F3EB] p-4 text-sm leading-relaxed text-[#3A3F42]">
          {notes}
        </p>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                className="px-0 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8A8176]"
                style={{ borderBottom: "1.5px solid #1C1712" }}
              >
                Description
              </th>
              <th
                className="w-24 px-0 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-[#8A8176]"
                style={{ borderBottom: "1.5px solid #1C1712" }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-0 py-6 text-center text-[#8A8176]">
                  Add a catalog item or logged hours to build the invoice.
                </td>
              </tr>
            ) : (
              lineItems.map((li) => (
                <tr key={li.id} style={{ borderBottom: "1px solid #EFEAE2" }}>
                  <td className="px-0 py-3.5 align-top">
                    <span className="font-medium text-[#1C1712]">{li.label}</span>
                    {li.note ? (
                      <>
                        <br />
                        <span className="text-xs text-[#8A8176]">{li.note}</span>
                      </>
                    ) : null}
                  </td>
                  <td className="px-0 py-3.5 text-right align-top text-[#1C1712]">
                    {li.amount === 0 ? (
                      <span className="text-[#8A8176]">Included</span>
                    ) : (
                      money(li.amount)
                    )}
                  </td>
                </tr>
              ))
            )}
            {discountAmount > 0 ? (
              <tr style={{ borderBottom: "1px solid #EFEAE2" }}>
                <td className="px-0 py-3.5 align-top">
                  <span className="font-medium text-[#1C1712]">
                    {discountType === "percent"
                      ? `Discount (${discountVal}%)`
                      : `Discount ($${discountVal.toFixed(2)})`}
                  </span>
                </td>
                <td className="px-0 py-3.5 text-right align-top text-emerald-600">
                  -{money(discountAmount)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div className="mt-6 flex items-center justify-between rounded-md bg-[#1C1712] px-5 py-4">
          <span className="text-sm font-medium uppercase tracking-wider text-[#F3EEE4]/70">
            Amount due
          </span>
          <span className="text-2xl font-medium text-[#F3EEE4]">{money(total)}</span>
        </div>

        <div className="my-8 rounded-lg border border-[#D6CCBC] bg-[#F7F3EB] p-6 text-center">
          <p className="m-0 text-sm font-medium text-[#3A3F42]">
            Settle this invoice securely via Venmo
          </p>
          <a
            href={venmoUrl}
            target="_blank"
            rel="noreferrer"
            className="my-4 inline-block rounded-full px-7 py-3 text-sm font-semibold text-white no-underline"
            style={{ backgroundColor: "#008CFF" }}
          >
            Pay {money(total)}
          </a>
          <p className="m-0 text-xs text-[#8A8176]">@{venmoHandle}</p>
        </div>
      </div>

      <div className="px-8 pb-8 text-center sm:px-10">
        <p className="m-0 text-xs text-[#8A8176]">Thank you for trusting The Chop Lab.</p>
      </div>
    </div>
  );
}

function buildInvoiceEmailHtml({
  customerName,
  date,
  notes,
  lineItems,
  discountAmount,
  discountLabel,
  total,
  venmoUrl,
  venmoHandle,
}: {
  customerName: string;
  date: string;
  notes: string;
  lineItems: LineItem[];
  discountAmount: number;
  discountLabel: string;
  total: number;
  venmoUrl: string;
  venmoHandle: string;
}) {
  const rows = lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #EFEAE2;vertical-align:top;">
          <span style="font-weight:600;color:#1C1712;">${escapeHtml(li.label)}</span>
          ${li.note ? `<br><span style="font-size:12px;color:#8A8176;">${escapeHtml(li.note)}</span>` : ""}
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #EFEAE2;vertical-align:top;text-align:right;color:${
          li.amount === 0 ? "#8A8176" : "#1C1712"
        };">
          ${li.amount === 0 ? "Included" : money(li.amount)}
        </td>
      </tr>`,
    )
    .join("");

  const discountRow =
    discountAmount > 0
      ? `<tr>
          <td style="padding:14px 0;border-bottom:1px solid #EFEAE2;vertical-align:top;">
            <span style="font-weight:600;color:#1C1712;">${escapeHtml(discountLabel)}</span>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #EFEAE2;vertical-align:top;text-align:right;color:#059669;">
            -${money(discountAmount)}
          </td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
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
          </td>
          <td style="vertical-align:middle;text-align:right;width:100%;">
            <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;">Invoice</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#1C1712;">${escapeHtml(date)}</p>
          </td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 0 40px;">
        <p style="margin:0;font-size:14px;color:#6F665C;"><strong style="color:#1C1712;">Billed to</strong> — ${escapeHtml(customerName)}</p>
        <p style="margin:16px 0 0 0;padding:16px;background-color:#F7F3EB;border-radius:8px;font-size:14px;line-height:1.6;color:#3A3F42;white-space:pre-wrap;">${escapeHtml(notes)}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;font-size:14px;">
          <thead>
            <tr>
              <th align="left" style="padding:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;border-bottom:2px solid #1C1712;">Description</th>
              <th align="right" style="padding:0 0 8px 0;width:100px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8A8176;border-bottom:2px solid #1C1712;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            ${discountRow}
          </tbody>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background-color:#1C1712;border-radius:8px;">
          <tr>
            <td style="padding:16px 20px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(243,238,228,0.7);">Amount due</td>
            <td style="padding:16px 20px;text-align:right;font-size:24px;font-weight:600;color:#F3EEE4;">${money(total)}</td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
          <tr>
            <td style="padding:24px;background-color:#F7F3EB;border:1px solid #D6CCBC;border-radius:10px;text-align:center;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#3A3F42;">Settle this invoice securely via Venmo</p>
              <a href="${venmoUrl}" target="_blank" style="display:inline-block;margin:16px 0;background-color:#008CFF;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:30px;font-weight:700;font-size:14px;">Pay ${money(total)}</a>
              <p style="margin:0;font-size:12px;color:#8A8176;">@${escapeHtml(venmoHandle)}</p>
            </td>
          </tr>
        </table>
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

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block first:mt-3">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
