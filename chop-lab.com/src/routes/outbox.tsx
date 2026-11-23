import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  loadRequests,
  removeRequest,
  undeliveredRequests,
  updateRequest,
  type LabRequest,
} from "@/lib/requests";
import { buildRequestReceiptEmail, buildStudioNotificationEmail } from "@/lib/request-email";
import { pageHead } from "@/lib/seo";
import { sendStudioEmail, STUDIO_EMAIL, type SendResult } from "@/lib/studio-mail";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/outbox")({
  head: () => {
    const base = pageHead({
      title: "Delivery queue — The Chop Lab",
      description:
        "Resend a Chop Lab request that was saved on this device but did not reach the studio.",
      path: "/outbox",
    });
    return {
      ...base,
      meta: [...base.meta, { name: "robots", content: "noindex, nofollow" }],
    };
  },
  component: OutboxPage,
});

function statusLabel(req: LabRequest) {
  if (!req.delivery) return "Delivery not confirmed";
  if (!req.delivery.studioOk) return "Didn't reach the studio";
  if (!req.delivery.receiptOk) return "Studio has it — receipt failed";
  return "Delivered";
}

function OutboxPage() {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setRequests(undeliveredRequests(loadRequests()));
    setLoaded(true);
  }, []);

  async function resend(req: LabRequest) {
    setBusy(req.id);
    setNotes((n) => ({ ...n, [req.id]: "" }));

    const needStudio = !req.delivery?.studioOk;
    const needReceipt = !req.delivery?.receiptOk;
    const niceDate = new Date(req.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    try {
      const [studioResult, receiptResult] = await Promise.allSettled([
        needStudio
          ? sendStudioEmail({
              data: {
                to: [STUDIO_EMAIL],
                subject: `New request — ${req.productName} (${req.id})`,
                htmlBody: buildStudioNotificationEmail({
                  requestId: req.id,
                  customerName: req.name,
                  customerEmail: req.email,
                  studio: req.studio,
                  productName: req.productName,
                  estimate: req.estimate,
                  specs: req.specs,
                  notes: req.notes,
                  files: req.files,
                  createdAt: niceDate,
                }),
                fromName: "Chop Lab Studio Engine",
                replyTo: req.email,
                attachments: req.attachments,
              },
            })
          : Promise.resolve<SendResult>({ success: true }),
        needReceipt
          ? sendStudioEmail({
              data: {
                to: [req.email],
                subject: `Your Chop Lab request — ${req.id}`,
                htmlBody: buildRequestReceiptEmail({
                  requestId: req.id,
                  customerName: req.name,
                  productName: req.productName,
                  estimate: req.estimate,
                  specs: req.specs,
                  notes: req.notes,
                  createdAt: niceDate,
                }),
                fromName: "The Chop Lab",
              },
            })
          : Promise.resolve<SendResult>({ success: true }),
      ]);

      const studioOk = studioResult.status === "fulfilled" && studioResult.value.success;
      const receiptOk = receiptResult.status === "fulfilled" && receiptResult.value.success;
      const studioError =
        studioResult.status === "fulfilled" ? studioResult.value.error : undefined;
      const updated = updateRequest(req.id, {
        delivery: {
          studioOk,
          receiptOk,
          at: new Date().toISOString(),
          error: studioOk ? undefined : studioError,
        },
        ...(studioOk ? { attachments: undefined } : {}),
      });
      setRequests(undeliveredRequests(updated));

      const message =
        studioOk && receiptOk
          ? "Sent to the studio."
          : !studioOk
            ? `Still couldn't reach the studio. Email ${STUDIO_EMAIL} directly.`
            : "The studio has it, but the receipt still failed.";
      if (studioOk) setFlash(`${req.id} sent to the studio.`);
      setNotes((n) => ({ ...n, [req.id]: message }));
    } finally {
      setBusy(null);
    }
  }

  async function resendAll() {
    for (const req of [...requests]) {
      await resend(req);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">On this device</p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">Delivery queue</h1>
      <p className="mt-4 max-w-xl text-muted">
        Requests are saved in this browser before they are emailed. If one didn&apos;t reach
        the studio, resend it here — any files saved with it go along too.
      </p>

      {flash ? (
        <p className="mt-10 text-sm text-primary" role="status">
          {flash}
        </p>
      ) : null}

      {loaded && requests.length === 0 ? (
        <p className="mt-10 rounded-xl bg-surface p-6 text-sm text-muted shadow-lift">
          Nothing waiting. Every request saved on this device has reached the studio.
        </p>
      ) : (
        <>
          <div className="mt-10 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {requests.length} request{requests.length === 1 ? "" : "s"} waiting
            </p>
            {requests.length > 1 ? (
              <Button variant="secondary" onClick={resendAll} disabled={busy !== null}>
                Resend all
              </Button>
            ) : null}
          </div>
          <ul className="mt-4 space-y-3">
            {requests.map((req) => (
              <li key={req.id} className="rounded-xl bg-surface p-5 shadow-lift">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {req.productName} · {req.id}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {req.name} · {req.email}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(req.createdAt).toLocaleString()} · {money(req.estimate)} ·{" "}
                      {statusLabel(req)}
                    </p>
                    {req.delivery?.error ? (
                      <p className="mt-1 text-xs text-primary">Last error: {req.delivery.error}</p>
                    ) : null}
                    {req.files.length ? (
                      <p className="mt-1 text-xs text-muted">Files: {req.files.join(", ")}</p>
                    ) : null}
                    {req.attachmentsOmitted ? (
                      <p className="mt-1 text-xs text-primary">
                        The file was too large to keep on this device, so a resend goes
                        without it.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => resend(req)} disabled={busy !== null}>
                      {busy === req.id
                        ? "Sending…"
                        : req.delivery?.studioOk
                          ? "Resend receipt"
                          : "Resend"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy !== null}
                      onClick={() => setRequests(undeliveredRequests(removeRequest(req.id)))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {notes[req.id] ? (
                  <p className="mt-3 text-sm text-muted">{notes[req.id]}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-10 text-sm">
        <Link to="/configure" className="underline underline-offset-4">
          Back to the configurator
        </Link>
        <span className="mx-2 text-muted">·</span>
        <Link to="/" className="underline underline-offset-4">
          Back to the lab
        </Link>
      </p>
    </main>
  );
}
