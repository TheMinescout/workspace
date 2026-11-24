import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { ChopPreview, CHOP_FONTS, type ChopFontId } from "@/components/chop-preview";
import { Length } from "@/components/length";
import { TextureSwatch } from "@/components/texture-swatch";
import { StlThumbnail } from "@/components/stl-thumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HANDLE_COLORS,
  PRODUCTS,
  SLAB_THICKNESSES_MM,
  getProduct,
  quoteFor,
  type Product,
} from "@/lib/products";
import {
  loadRequests,
  saveRequest,
  undeliveredRequests,
  updateRequest,
  type LabRequest,
} from "@/lib/requests";
import { TEXTURES, type TextureId } from "@/lib/textures";
import { formatLength, trim, useLength } from "@/lib/units";
import { cn, money, requestId } from "@/lib/utils";
import { sendStudioEmail, STUDIO_EMAIL } from "@/lib/studio-mail";
import { buildRequestReceiptEmail, buildStudioNotificationEmail } from "@/lib/request-email";

const STEPS = ["Tool", "Specs", "Studio", "Review"] as const;

const PRINT_MATERIALS = ["PLA Matte", "PETG"] as const;

// Vercel caps server-function request bodies at 4.5 MB; base64 inflates by
// roughly a third, so keep the raw total at 3 MB.
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

type Attachment = {
  filename: string;
  contentType: string;
  /** Base64 content without a `data:` prefix. */
  content: string;
  size: number;
};

function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function readFileBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsDataURL(blob);
  });
}

/** Raster types worth re-encoding when they are too big to attach. */
const SHRINKABLE_IMAGE = /^image\/(png|jpe?g|webp|bmp|avif)$/;

/** Redraw an image at `maxEdge` on its long side, as JPEG. */
async function reencodeImage(file: File, maxEdge: number, quality: number): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality),
    );
  } catch {
    return null;
  }
}

/**
 * A file that fits `budget` bytes, or null. A photo straight off a phone is
 * routinely over the cap, so shrink it rather than drop the customer's sketch.
 */
async function prepareAttachment(file: File, budget: number): Promise<Attachment | null> {
  if (budget <= 0) return null;
  if (file.size <= budget) {
    return {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      content: await readFileBase64(file),
      size: file.size,
    };
  }
  if (!SHRINKABLE_IMAGE.test(file.type)) return null;
  for (const [maxEdge, quality] of [
    [2048, 0.85],
    [1600, 0.75],
    [1280, 0.65],
  ] as const) {
    const blob = await reencodeImage(file, maxEdge, quality);
    if (blob && blob.size <= budget) {
      return {
        filename: `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
        contentType: "image/jpeg",
        content: await readFileBase64(blob),
        size: blob.size,
      };
    }
  }
  return null;
}

type FormState = {
  productSlug: string;
  mark: string;
  markFont: ChopFontId;
  texture: TextureId;
  customTexture: string;
  handleColor: string;
  /** Canonical millimetres — display units are applied at render time. */
  lipMm: number;
  thicknessMm: number;
  widthMm: number;
  quantity: number;
  printMaterial: string;
  cadMods: string;
  name: string;
  email: string;
  studio: string;
  notes: string;
  files: string[];
};

const empty: FormState = {
  productSlug: "",
  mark: "",
  markFont: "segoe",
  texture: "hex",
  customTexture: "",
  handleColor: "white",
  lipMm: 4,
  thicknessMm: 10,
  widthMm: 80,
  quantity: 1,
  printMaterial: PRINT_MATERIALS[0],
  cadMods: "",
  name: "",
  email: "",
  studio: "",
  notes: "",
  files: [],
};

/**
 * A numeric length field that always shows (and accepts) the current display
 * unit while the form keeps the canonical millimetre value. Switching units in
 * the header re-labels the field and reformats the number in place.
 */
function LengthInput({
  id,
  valueMm,
  onChangeMm,
  describedBy,
}: {
  id: string;
  valueMm: number;
  onChangeMm: (mm: number) => void;
  describedBy?: string;
}) {
  const { unit, toDisplay, fromDisplay } = useLength();
  const [text, setText] = useState(() => String(toDisplay(valueMm)));
  const unitRef = useRef(unit);

  useEffect(() => {
    if (unitRef.current !== unit) {
      unitRef.current = unit;
      setText(String(toDisplay(valueMm)));
    }
  }, [unit, valueMm, toDisplay]);

  return (
    <Input
      id={id}
      inputMode="decimal"
      aria-describedby={describedBy}
      value={text}
      onChange={(e) => {
        const next = e.target.value;
        setText(next);
        const parsed = Number.parseFloat(next);
        if (Number.isFinite(parsed)) onChangeMm(trim(fromDisplay(parsed)));
      }}
    />
  );
}

function ProductThumb({ product, className }: { product: Product; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt="" className={cn("h-full w-full object-cover", className)} />;
  }
  if (product.stlFile) {
    return <StlThumbnail url={product.stlFile} className={cn("h-full w-full object-cover", className)} />;
  }
  return <div className={cn("h-full w-full bg-bg-warm", className)} />;
}

function Estimate({ product }: { product: Product }) {
  const total = quoteFor(product);
  return (
    <aside className="rounded-xl bg-surface p-5 shadow-lift">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Project estimate</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Base</dt>
          <dd className="tabular-nums">{money(product.basePrice)}</dd>
        </div>
        {product.estimatedHours > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Design · {product.estimatedHours} hr × {money(product.hourlyRate)}
            </dt>
            <dd className="tabular-nums">{money(product.hourlyRate * product.estimatedHours)}</dd>
          </div>
        ) : null}
        {product.printRate ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Print · {product.estimatedPrintHours ?? 0} hr × {money(product.printRate)}
            </dt>
            <dd className="tabular-nums">
              {money(product.printRate * (product.estimatedPrintHours ?? 0))}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-3 font-medium">
          <dt>Quote target</dt>
          <dd className="tabular-nums">{money(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Payment is not collected today. Thomas emails a final invoice once the CAD
        is approved. Typical turnaround is 3–5 business days after that.
      </p>
    </aside>
  );
}

export function ConsultationForm({
  initialSlug,
  initialTexture,
}: {
  initialSlug?: string;
  initialTexture?: TextureId;
}) {
  const [step, setStep] = useState(initialSlug ? 1 : 0);
  const [form, setForm] = useState<FormState>({
    ...empty,
    productSlug: initialSlug ?? "",
    texture: initialTexture ?? empty.texture,
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState<LabRequest | null>(null);
  const [sending, setSending] = useState(false);
  const [delivery, setDelivery] = useState<{ studioOk: boolean; receiptOk: boolean } | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [readingFiles, setReadingFiles] = useState(false);
  const [fileError, setFileError] = useState("");
  /** Picked files that could not be attached, even after shrinking. */
  const [skipped, setSkipped] = useState<string[]>([]);
  const [recent, setRecent] = useState(() => loadRequests());
  const { unit } = useLength();
  const fmt = useCallback((mm: number) => formatLength(mm, unit), [unit]);

  const product = form.productSlug ? getProduct(form.productSlug) : undefined;
  const pendingCount = undeliveredRequests(recent).length;

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  async function addFiles(picked: File[]) {
    if (!picked.length) return;
    setFileError("");
    setReadingFiles(true);
    try {
      const accepted: Attachment[] = [];
      const rejected: string[] = [];
      let total = attachments.reduce((sum, a) => sum + a.size, 0);
      for (const file of picked) {
        const prepared = await prepareAttachment(file, MAX_ATTACHMENT_BYTES - total);
        if (!prepared) {
          rejected.push(file.name);
          continue;
        }
        accepted.push(prepared);
        total += prepared.size;
      }
      if (accepted.length) {
        setAttachments((prev) => [...prev, ...accepted]);
        setForm((f) => ({ ...f, files: [...f.files, ...accepted.map((a) => a.filename)] }));
      }
      if (rejected.length) {
        setSkipped((prev) => [...new Set([...prev, ...rejected])]);
      }
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Could not read that file.");
    } finally {
      setReadingFiles(false);
    }
  }

  const specs = useMemo(() => {
    if (!product) return {};
    const s: Record<string, string> = {};
    if (product.kind === "chop") {
      s.Mark = form.mark || "—";
      s.Font = CHOP_FONTS.find((f) => f.id === form.markFont)?.label ?? form.markFont;
      s["Handle color"] = HANDLE_COLORS.find((c) => c.id === form.handleColor)?.name ?? form.handleColor;
    }
    if (product.kind === "roller") {
      s.Texture = TEXTURES.find((t) => t.id === form.texture)?.name ?? form.texture;
      if (form.customTexture) s["Custom pattern"] = form.customTexture;
    }
    if (product.kind === "basket") s["Bucket lip"] = fmt(form.lipMm);
    if (product.kind === "rails") {
      s.Thickness = fmt(form.thicknessMm);
      s.Width = fmt(form.widthMm);
    }
    if (product.kind === "print") {
      s.Quantity = String(form.quantity);
      s.Material = form.printMaterial;
      if (form.cadMods) s["CAD modifications"] = form.cadMods;
    }
    return s;
  }, [product, form, fmt]);

  function next() {
    setError("");
    if (step === 0 && !product) {
      setError("Choose a tool to continue.");
      return;
    }
    if (readingFiles) {
      setError("Hang on — still reading your file.");
      return;
    }
    if (step === 2) {
      if (!form.name.trim() || !form.email.trim()) {
        setError("Name and email are required so Thomas can send the quote.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError("Enter a valid email address.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  }

  async function submit() {
    if (!product) return;
    const req: LabRequest = {
      id: requestId(),
      createdAt: new Date().toISOString(),
      productSlug: product.slug,
      productName: product.name,
      name: form.name.trim(),
      email: form.email.trim(),
      studio: form.studio.trim(),
      notes: form.notes.trim(),
      specs,
      estimate: quoteFor(product),
      files: form.files,
      attachments: attachments.map(({ filename, contentType, content }) => ({
        filename,
        contentType,
        content,
      })),
    };
    setRecent(saveRequest(req));
    setDone(req);

    setSending(true);
    setDelivery(null);
    const niceDate = new Date(req.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const [receiptResult, studioResult] = await Promise.allSettled([
      sendStudioEmail({
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
      }),
      sendStudioEmail({
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
            skippedFiles: skipped,
            createdAt: niceDate,
          }),
          fromName: "Chop Lab Studio Engine",
          replyTo: req.email,
          attachments: attachments.map(({ filename, contentType, content }) => ({
            filename,
            contentType,
            content,
          })),
        },
      }),
    ]);

    const receiptOk = receiptResult.status === "fulfilled" && receiptResult.value.success;
    const studioOk = studioResult.status === "fulfilled" && studioResult.value.success;
    const studioError =
      studioResult.status === "fulfilled" ? studioResult.value.error : undefined;
    setDelivery({ studioOk, receiptOk });
    setRecent(
      updateRequest(req.id, {
        delivery: {
          studioOk,
          receiptOk,
          at: new Date().toISOString(),
          error: studioOk ? undefined : studioError,
        },
        ...(studioOk ? { attachments: undefined } : {}),
      }),
    );
    setSending(false);
  }

  if (done && product) {
    return (
      <div className="rounded-xl bg-surface p-8 shadow-lift sm:p-10">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">Request received</p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">
          {done.id} is on the bench.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Thomas will review {product.name} for {done.name}, build the CAD, and
          email a quote to {done.email} within one to two days. Nothing is charged
          until you approve the model.
        </p>
        {sending ? (
          <p className="mt-4 text-sm text-muted">Sending your request to the studio…</p>
        ) : delivery && !delivery.studioOk ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-primary">
              Your request is saved on this device, but it couldn't be delivered to the
              studio. Please email {STUDIO_EMAIL} directly so it isn't missed.
            </p>
            <p className="text-sm">
              <Link to="/outbox" className="underline underline-offset-4">
                Open the delivery queue to resend it
              </Link>
            </p>
          </div>
        ) : delivery && !delivery.receiptOk ? (
          <p className="mt-4 text-sm text-primary">
            Thomas received your request, but the confirmation copy to {done.email}{" "}
            couldn't be sent.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            A confirmation receipt was sent to {done.email}.
          </p>
        )}
        {skipped.length ? (
          <p className="mt-4 text-sm text-primary">
            {skipped.join(", ")} could not be attached — too large to send with the
            request. Email {STUDIO_EMAIL} with the file to complete the brief.
          </p>
        ) : null}
        <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Quote target</dt>
            <dd className="mt-1 tabular-nums">{money(done.estimate)}</dd>
          </div>
          <div>
            <dt className="text-muted">Turnaround</dt>
            <dd className="mt-1">3–5 business days after approval</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">Back to the lab</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDone(null);
              setStep(0);
              setForm(empty);
              setAttachments([]);
              setFileError("");
              setSkipped([]);
              setDelivery(null);
            }}
          >
            Start another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <ol className="mb-8 flex gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  if (i < step) setStep(i);
                }}
                className="w-full text-left"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full",
                    i <= step ? "bg-primary" : "bg-border",
                  )}
                />
                <span
                  className={cn(
                    "mt-2 block text-xs font-medium",
                    i === step ? "text-fg" : "text-muted",
                  )}
                >
                  0{i + 1} {label}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {PRODUCTS.filter((p) => !p.digital).map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => patch({ productSlug: p.slug })}
                className={cn(
                  "flex items-center gap-4 rounded-xl bg-surface p-4 text-left shadow-lift transition-[box-shadow] duration-quick",
                  form.productSlug === p.slug && "ring-2 ring-primary",
                )}
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-bg-warm">
                  <ProductThumb product={p} />
                </div>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-1 text-xs text-muted">{p.tagline}</p>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => patch({ productSlug: "stl-dual-bevel" })}
              className={cn(
                "flex items-center gap-4 rounded-xl bg-surface p-4 text-left shadow-lift sm:col-span-2",
                form.productSlug.startsWith("stl-") && "ring-2 ring-primary",
              )}
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-bg-warm">
                <ProductThumb product={getProduct("stl-dual-bevel")!} />
              </div>
              <div>
                <p className="font-medium">Digital STL file</p>
                <p className="mt-1 text-xs text-muted">
                  Print a sponge basket, dual bevel cutter, or slab rails yourself.
                </p>
              </div>
            </button>
            {form.productSlug.startsWith("stl-") ? (
              <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
                {PRODUCTS.filter((p) => p.digital).map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => patch({ productSlug: p.slug })}
                    className={cn(
                      "rounded-lg bg-bg-warm px-3 py-3 text-left text-sm",
                      form.productSlug === p.slug && "ring-2 ring-primary",
                    )}
                  >
                    {p.name.replace(" — STL", "")}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 1 && product ? (
          <div className="space-y-8">
            {product.kind === "chop" ? (
              <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mark">Initials or wordmark</Label>
                    <Input
                      id="mark"
                      value={form.mark}
                      maxLength={8}
                      placeholder="TL"
                      onChange={(e) => patch({ mark: e.target.value })}
                    />
                    <p className="text-xs text-muted">
                      Designs with more than three letters have a higher chance of
                      impression issues. SVG, PNG, or PDF preferred for logos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Handle color</Label>
                    <div className="flex flex-wrap gap-2">
                      {HANDLE_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => patch({ handleColor: c.id })}
                          className={cn(
                            "inline-flex h-11 items-center gap-2 rounded-full bg-surface px-3 text-sm shadow-lift",
                            form.handleColor === c.id && "ring-2 ring-primary",
                          )}
                        >
                          <span className={cn("size-4 rounded-full", c.swatch, c.id === "white" && "shadow-lift")} />
                          {c.name}
                          {c.recommended ? (
                            <span className="text-xs text-muted">rec.</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted">
                      Stamp heads print in Matte White for clay release. We recommend
                      keeping that standard.
                    </p>
                  </div>
                </div>
                <ChopPreview
                  text={form.mark}
                  size="md"
                  className="mx-auto"
                  font={form.markFont}
                  interactive
                  onFontChange={(f) => patch({ markFont: f })}
                />
              </div>
            ) : null}

            {product.kind === "roller" ? (
              <div className="space-y-4">
                <Label>Texture</Label>
                <div className="grid grid-cols-3 gap-3">
                  {TEXTURES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => patch({ texture: t.id })}
                      className={cn(
                        "overflow-hidden rounded-lg shadow-lift",
                        form.texture === t.id && "ring-2 ring-primary",
                      )}
                    >
                      <div className="h-24 sm:h-28">
                        <TextureSwatch id={t.id} />
                      </div>
                      <p className="px-2 py-2 text-left text-xs font-medium">{t.name}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customTexture">Or describe a custom pattern</Label>
                  <Input
                    id="customTexture"
                    value={form.customTexture}
                    placeholder="e.g. my studio’s wave motif"
                    onChange={(e) => patch({ customTexture: e.target.value })}
                  />
                </div>
              </div>
            ) : null}

            {product.kind === "basket" ? (
              <div className="space-y-2">
                <Label htmlFor="lip">Bucket lip thickness ({unit})</Label>
                <LengthInput
                  id="lip"
                  valueMm={form.lipMm}
                  onChangeMm={(mm) => patch({ lipMm: mm })}
                  describedBy="lip-help"
                />
                <p id="lip-help" className="text-xs text-muted">
                  Measure the thickness of your bucket’s top lip. The basket is
                  engineered to hang on a standard pottery water bucket.
                </p>
              </div>
            ) : null}

            {product.kind === "rails" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Slab thickness</Label>
                  <div className="flex flex-wrap gap-2">
                    {SLAB_THICKNESSES_MM.map((mm) => (
                      <button
                        key={mm}
                        type="button"
                        onClick={() => patch({ thicknessMm: mm })}
                        aria-pressed={form.thicknessMm === mm}
                        className={cn(
                          "h-11 rounded-full bg-surface px-3.5 text-sm tabular-nums shadow-lift",
                          form.thicknessMm === mm && "ring-2 ring-primary",
                        )}
                      >
                        {fmt(mm)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted">
                    Rails are 10 inches long as standard. Choose Other in the notes
                    if you need a custom length.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Rail spacing / slab width ({unit})</Label>
                  <LengthInput
                    id="width"
                    valueMm={form.widthMm}
                    onChangeMm={(mm) => patch({ widthMm: mm })}
                  />
                </div>
              </div>
            ) : null}

            {product.kind === "stl" ? (
              <p className="text-sm leading-relaxed text-muted">
                You are purchasing a digital STL to 3D print yourself. Your file
                link and invoice will be emailed. Pricing is a $5 base fee plus $1
                per hour of print time. Maximum build volume is{" "}
                <Length mm={256} /> cubed.
              </p>
            ) : null}

            {product.kind === "print" ? (
              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-muted">
                  Upload your STL below, or describe the part you need modeled.
                  We review the CAD, slice it for the <Length mm={256} /> cube
                  build volume, and send a Venmo invoice after review — nothing is
                  charged here.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={50}
                      value={form.quantity}
                      onChange={(e) => {
                        const next = Number.parseInt(e.target.value, 10);
                        patch({ quantity: Number.isFinite(next) && next > 0 ? next : 1 });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRINT_MATERIALS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => patch({ printMaterial: m })}
                          aria-pressed={form.printMaterial === m}
                          className={cn(
                            "h-11 rounded-full bg-surface px-4 text-sm shadow-lift",
                            form.printMaterial === m && "ring-2 ring-primary",
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted">
                      PLA Matte for detail and studio tools, PETG for structural
                      or heat-exposed parts.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cadMods">Optional CAD modifications</Label>
                  <Textarea
                    id="cadMods"
                    value={form.cadMods}
                    placeholder="Resize a hole, add a mounting tab, split a large part into interlocking pieces…"
                    onChange={(e) => patch({ cadMods: e.target.value })}
                  />
                  <p className="text-xs text-muted">
                    Leave blank to print your STL as uploaded.
                  </p>
                </div>
              </div>
            ) : null}

            <FileDrop
              files={form.files}
              reading={readingFiles}
              error={fileError}
              skipped={skipped}
              onFiles={(picked) => void addFiles(picked)}
              onClear={() => {
                setAttachments([]);
                setFileError("");
                setSkipped([]);
                patch({ files: [] });
              }}
              stl={product.kind === "stl" || product.kind === "print"}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                autoComplete="name"
                onChange={(e) => patch({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(e) => patch({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="studio">Studio name (optional)</Label>
              <Input
                id="studio"
                value={form.studio}
                onChange={(e) => patch({ studio: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Project notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                placeholder="Anything Thomas should know — clay body, preferred depth, a sketch of the mark…"
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </div>
          </div>
        ) : null}

        {step === 3 && product ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-surface p-6 shadow-lift">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Request</p>
              <h3 className="mt-1 font-display text-2xl font-medium">{product.name}</h3>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted">From</dt>
                  <dd className="mt-0.5">
                    {form.name}
                    {form.studio ? ` · ${form.studio}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-0.5">{form.email}</dd>
                </div>
                {Object.entries(specs).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
                {form.files.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Files</dt>
                    <dd className="mt-0.5">{form.files.join(", ")}</dd>
                  </div>
                ) : null}
                {skipped.length ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Not attached</dt>
                    <dd className="mt-0.5 text-primary">
                      {skipped.join(", ")} — too large to send. Email {STUDIO_EMAIL} with
                      the file after you submit.
                    </dd>
                  </div>
                ) : null}
                {form.notes ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Notes</dt>
                    <dd className="mt-0.5 whitespace-pre-wrap">{form.notes}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <p className="text-sm text-muted">
              Finalize and Thomas will pick this up from the queue. You will get a
              CAD review and quote by email — not a charge today.
            </p>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0}
            onClick={() => {
              setError("");
              setStep((s) => Math.max(0, s - 1));
            }}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={next}>
              Continue
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={sending || readingFiles}>
              <Check className="size-4" />
              {sending ? "Submitting…" : "Finalize request"}
            </Button>
          )}
        </div>

        {recent.length > 0 && step === 0 ? (
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Recent requests on this device
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {recent.slice(0, 4).map((r) => (
                <li key={r.id} className="flex justify-between gap-3 text-muted">
                  <span>
                    {r.id} · {r.productName}
                    {!r.delivery?.studioOk ? (
                      <span className="ml-2 text-primary">Not delivered</span>
                    ) : null}
                  </span>
                  <span className="tabular-nums">{money(r.estimate)}</span>
                </li>
              ))}
            </ul>
            {pendingCount > 0 ? (
              <p className="mt-3 text-sm">
                <Link to="/outbox" className="underline underline-offset-4">
                  {pendingCount} request{pendingCount === 1 ? "" : "s"} didn't reach the
                  studio — resend from the delivery queue
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        {product ? <Estimate product={product} /> : (
          <aside className="rounded-xl bg-surface p-5 text-sm text-muted shadow-lift">
            Select a service to see a quote target. Payment is never collected in
            this form.
          </aside>
        )}
      </div>
    </div>
  );
}

function FileDrop({
  files,
  reading,
  error,
  skipped,
  onFiles,
  onClear,
  stl,
}: {
  files: string[];
  reading: boolean;
  error: string;
  skipped: string[];
  onFiles: (files: File[]) => void;
  onClear: () => void;
  stl: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="files">{stl ? "STL file" : "Artwork or sketch"}</Label>
      <label
        htmlFor="files"
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl bg-surface px-4 py-6 text-center shadow-lift"
      >
        <Upload className="size-5 text-muted" />
        <span className="mt-2 text-sm text-fg">
          {stl
            ? "Drop an STL, or click to browse"
            : "Drop a sketch, logo, or photo — SVG, PNG, or PDF preferred"}
        </span>
        <span className="mt-1 text-xs text-muted">
          {reading ? (
            "Reading your file…"
          ) : (
            <>
              Sent with your request — up to {formatBytes(MAX_ATTACHMENT_BYTES)}{" "}
              total. Bigger photos are resized to fit. Max build <Length mm={256} /> cube.
            </>
          )}
        </span>
        <input
          id="files"
          type="file"
          multiple
          className="sr-only"
          accept={stl ? ".stl,model/stl" : "image/*,.svg,.pdf"}
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (picked.length) onFiles(picked);
          }}
        />
      </label>
      {error ? <p className="text-xs text-primary">{error}</p> : null}
      {skipped.length ? (
        <p className="text-xs text-primary">
          {skipped.join(", ")} could not be attached — too large even after resizing.
          Email {STUDIO_EMAIL} with the file so it isn't missed.
        </p>
      ) : null}
      {files.length ? (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{files.join(", ")}</span>
          <button type="button" className="text-primary" onClick={onClear}>
            Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}
