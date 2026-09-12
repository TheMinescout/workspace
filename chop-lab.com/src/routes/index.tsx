import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ChopPreview, type ChopFontId } from "@/components/chop-preview";
import { FaqList } from "@/components/faq-list";
import { ProductCard } from "@/components/product-card";
import { TextureSwatch } from "@/components/texture-swatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROCESS, PRODUCTS } from "@/lib/products";
import { TEXTURES, type TextureId } from "@/lib/textures";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [mark, setMark] = useState("TL");
  const [markFont, setMarkFont] = useState<ChopFontId>("segoe");
  const [texture, setTexture] = useState<TextureId>("hex");
  const featured = PRODUCTS.find((p) => p.bestSeller)!;
  const top = PRODUCTS.filter((p) => !p.digital).slice(0, 6);

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
            <p className="rise-in text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Custom engineered pottery tools
            </p>
            <h1 className="rise-in-2 mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Your signature
              <span className="italic text-primary"> in clay.</span>
            </h1>
            <p className="rise-in-3 mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              We extract high-fidelity detail from logos or initials and engineer
              them into custom chops, rollers, and studio tools — printed in PLA
              Matte for clean, low-friction release.
            </p>
            <div className="rise-in-4 mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/configure">
                  Configure a chop
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/tools">Browse tools</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <ChopPreview
                text={mark}
                size="sm"
                font={markFont}
                interactive
                onFontChange={setMarkFont}
              />
              <div className="min-w-0 flex-1">
                <label htmlFor="hero-mark" className="text-xs font-medium uppercase tracking-wider text-muted">
                  Try your mark
                </label>
                <Input
                  id="hero-mark"
                  value={mark}
                  maxLength={4}
                  className="mt-2 max-w-40"
                  onChange={(e) => setMark(e.target.value)}
                />
                <p className="mt-2 text-xs text-muted">
                  Live impression · 1–4 characters · any font, any font size
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-72 lg:min-h-full">
            <img
              src="/images/chop-complex.jpg"
              alt="A custom Chop Lab stamp and its crisp impression pressed into leather-hard clay"
              className="img-frame h-full w-full object-cover lg:absolute lg:inset-0"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            ["Material", "PLA Matte"],
            ["Build volume", "256 mm cube"],
            ["Turnaround", "3–5 days"],
            ["Payment", "Invoice after CAD"],
          ].map(([k, v]) => (
            <div key={k} className="bg-bg px-4 py-5 sm:px-6">
              <p className="text-xs uppercase tracking-wider text-muted">{k}</p>
              <p className="mt-1 font-display text-lg font-medium">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-xl bg-bg-warm shadow-lift">
            <img
              src="/images/chop-simple.jpg"
              alt=""
              className="img-frame aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Best seller</p>
            <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
              The signature custom chop.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">{featured.longDescription}</p>
            <ul className="mt-6 space-y-3">
              {featured.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8">
              <Link to="/tools/$slug" params={{ slug: featured.slug }}>
                Configure this tool
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-bg-warm py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Catalog</p>
              <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
                Tools potters reach for.
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link to="/tools">View all</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">How ordering works</p>
        <h2 className="mt-2 max-w-xl font-display text-4xl font-medium tracking-tight">
          Zero back-and-forth emails. Precision manufacturing on demand.
        </h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step) => (
            <li key={step.n}>
              <p className="font-display text-sm text-primary">{step.n}</p>
              <h3 className="mt-2 font-display text-xl font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Texture library</p>
              <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
                Patterns that tile.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              {TEXTURES.find((t) => t.id === texture)?.note}. Rollers are modeled so
              the repeat is seamless across a slab.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl shadow-lift">
            <div className="h-40 text-fg sm:h-56">
              <TextureSwatch id={texture} closeup={false} className="h-full w-full" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {TEXTURES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTexture(t.id)}
                className={`overflow-hidden rounded-lg shadow-lift ${texture === t.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className="h-28 sm:h-36">
                  <TextureSwatch id={t.id} className="h-full w-full" />
                </div>
                <p className="px-2 py-2 text-left text-xs">{t.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">The lab technician</p>
          <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">Hi, I’m Thomas.</h2>
          <p className="mt-5 leading-relaxed text-muted">
            I’m a robotics student, CAD designer, and the technician behind The
            Chop Lab. What started as a project to print better pottery tools for
            my mom’s studio has evolved into a full-scale micro-manufacturing lab.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            By utilizing parametric modeling and advanced FDM printing, I ensure
            every part — whether it’s a clay stamp or a custom mechanical gear —
            is mathematically precise and structurally sound.
          </p>
          <Button asChild variant="secondary" className="mt-8">
            <Link to="/about">The full story</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl shadow-lift">
          <img
            src="/images/thomas-maker.jpg"
            alt="Thomas, the lab technician behind The Chop Lab, trimming a piece on the wheel"
            className="img-frame aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl font-medium tracking-tight">Questions, answered.</h2>
        <div className="mt-8">
          <FaqList />
        </div>
      </section>

      <section className="bg-kiln text-kiln-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-medium tracking-tight">
            Send a mark to the bench.
          </h2>
          <p className="mt-3 max-w-lg text-kiln-fg/70">
            A logo, three initials, or a bucket lip measurement is enough to start
            a model. Thomas emails the CAD and a quote — nothing is charged today.
          </p>
          <Button asChild variant="kiln" className="mt-8">
            <Link to="/configure">
              Configure a tool
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
