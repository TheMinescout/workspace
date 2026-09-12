import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { ChopPreview, CHOP_FONTS, type ChopFontId } from "@/components/chop-preview";
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
import { loadRequests, saveRequest, type LabRequest } from "@/lib/requests";
import { TEXTURES, type TextureId } from "@/lib/textures";
import { useUnits } from "@/lib/units";
import { cn, money, requestId } from "@/lib/utils";
import { sendStudioEmail, STUDIO_EMAIL } from "@/lib/studio-mail";
import { buildRequestReceiptEmail, buildStudioNotificationEmail } from "@/lib/request-email";

const STEPS = ["Tool", "Specs", "Studio", "Review"] as const;

type FormState = {
  productSlug: string;
  mark: string;
  markFont: ChopFontId;
  texture: TextureId;
  customTexture: string;
  handleColor: string;
  lipMm: string;
  thicknessMm: string;
  widthMm: string;
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
  lipMm: "4",
  thicknessMm: "10",
  widthMm: "80",
  name: "",
  email: "",
  studio: "",
  notes: "",
  files: [],
};

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
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Design · {product.estimatedHours} hr × {money(product.hourlyRate)}
          </dt>
          <dd className="tabular-nums">{money(product.hourlyRate * product.estimatedHours)}</dd>
        </div>
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

export function ConsultationForm({ initialSlug }: { initialSlug?: string }) {
  const [step, setStep] = useState(initialSlug ? 1 : 0);
  const [form, setForm] = useState<FormState>({
    ...empty,
    productSlug: initialSlug ?? "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState<LabRequest | null>(null);
  const [sending, setSending] = useState(false);
  const [emailWarning, setEmailWarning] = useState("");
  const [recent] = useState(() => loadRequests());
  const unit = useUnits((s) => s.unit);
  const formatMm = useUnits((s) => s.formatMm);

  const product = form.productSlug ? getProduct(form.productSlug) : undefined;

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

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
    if (product.kind === "basket") s["Bucket lip"] = formatMm(Number(form.lipMm) || 0);
    if (product.kind === "rails") {
      s.Thickness = formatMm(Number(form.thicknessMm) || 0);
      s.Width = formatMm(Number(form.widthMm) || 0);
    }
    return s;
  }, [product, form, formatMm]);

  function next() {
    setError("");
    if (step === 0 && !product) {
      setError("Choose a tool to continue.");
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
    };
    saveRequest(req);
    setDone(req);

    setSending(true);
    setEmailWarning("");
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
            createdAt: niceDate,
          }),
          fromName: "Chop Lab Studio Engine",
        },
      }),
    ]);

    const receiptOk = receiptResult.status === "fulfilled" && receiptResult.value.success;
    const studioOk = studioResult.status === "fulfilled" && studioResult.value.success;
    if (!receiptOk || !studioOk) {
      setEmailWarning(
        "Your request was saved, but the confirmation email couldn't be sent. Thomas still received it — no need to resubmit.",
      );
    }
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
          <p className="mt-4 text-sm text-muted">Sending your confirmation email…</p>
        ) : emailWarning ? (
          <p className="mt-4 text-sm text-primary">{emailWarning}</p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            A confirmation receipt was sent to {done.email}.
          </p>
        )}
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
              setEmailWarning("");
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
                <Input
                  id="lip"
                  inputMode="decimal"
                  value={form.lipMm}
                  onChange={(e) => patch({ lipMm: e.target.value })}
                />
                <p className="text-xs text-muted">
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
                        onClick={() => patch({ thicknessMm: String(mm) })}
                        className={cn(
                          "h-11 rounded-full bg-surface px-3.5 text-sm tabular-nums shadow-lift",
                          form.thicknessMm === String(mm) && "ring-2 ring-primary",
                        )}
                      >
                        {formatMm(mm)}
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
                  <Input
                    id="width"
                    inputMode="decimal"
                    value={form.widthMm}
                    onChange={(e) => patch({ widthMm: e.target.value })}
                  />
                </div>
              </div>
            ) : null}

            {product.kind === "stl" ? (
              <p className="text-sm leading-relaxed text-muted">
                You are purchasing a digital STL to 3D print yourself. Your file
                link and invoice will be emailed. Pricing is a $5 base fee plus $1
                per hour of print time. Maximum build volume is 256 × 256 × 256 mm.
              </p>
            ) : null}

            <FileDrop
              files={form.files}
              onFiles={(names) => patch({ files: [...form.files, ...names] })}
              onClear={() => patch({ files: [] })}
              digital={product.kind === "stl"}
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
            <Button type="button" onClick={submit} disabled={sending}>
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
                  </span>
                  <span className="tabular-nums">{money(r.estimate)}</span>
                </li>
              ))}
            </ul>
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
  onFiles,
  onClear,
  digital,
}: {
  files: string[];
  onFiles: (names: string[]) => void;
  onClear: () => void;
  digital: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="files">{digital ? "Existing STL (optional)" : "Artwork or sketch"}</Label>
      <label
        htmlFor="files"
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl bg-surface px-4 py-6 text-center shadow-lift"
      >
        <Upload className="size-5 text-muted" />
        <span className="mt-2 text-sm text-fg">
          {digital
            ? "Drop an STL, or click to browse"
            : "Drop a sketch, logo, or photo — SVG, PNG, or PDF preferred"}
        </span>
        <span className="mt-1 text-xs text-muted">
          Files stay on this device with your request summary. Max build 256 mm cube.
        </span>
        <input
          id="files"
          type="file"
          multiple
          className="sr-only"
          accept={digital ? ".stl,model/stl" : "image/*,.svg,.pdf"}
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []).map((f) => f.name);
            if (list.length) onFiles(list);
          }}
        />
      </label>
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
