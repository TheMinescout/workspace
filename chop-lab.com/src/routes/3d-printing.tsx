import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Length } from "@/components/length";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/lib/products";
import { pageHead, SITE_URL } from "@/lib/seo";

const USE_CASES = [
  {
    title: "Custom pottery tools",
    body: "Chops, maker's marks, texture rollers, and slab rails engineered from your artwork or dimensions — the same parametric workflow behind the studio catalog.",
  },
  {
    title: "Replacement parts",
    body: "A broken bracket, a discontinued knob, a missing clip. Send the part or a photo with measurements and we model a drop-in replacement.",
  },
  {
    title: "Rapid prototypes",
    body: "One-off enclosures, fixtures, and mechanical prototypes printed in a day or two so you can test the fit before committing to a mold or a machined run.",
  },
  {
    title: "Studio jigs & fixtures",
    body: "Molds, gauges, trimming spinners, and one-off helpers sized to your wheel, your bucket, and the way you actually work.",
  },
] as const;

const MATERIALS = [
  {
    name: "PLA Matte",
    best: "Detail & studio tools",
    body: "High detail, low friction, and a matte surface that lets go of clay. The default for pottery tools and display prototypes.",
  },
  {
    name: "PETG",
    best: "Structural & heat-resistant parts",
    body: "Tougher and more heat-resistant than PLA. Used for brackets, fixtures, and parts that see load or warm cars.",
  },
] as const;

export const Route = createFileRoute("/3d-printing")({
  head: () =>
    pageHead({
      title: "Custom 3D Printing & Rapid Prototyping — Sammamish, WA",
      description:
        "Custom 3D printing and rapid prototyping in Sammamish and the Eastside, WA. PLA Matte and PETG parts — pottery tools, replacement parts, and one-off prototypes. Send specs for a quote.",
      path: "/3d-printing",
      ld: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "The Chop Lab",
        url: SITE_URL,
        image: `${SITE_URL}/og.jpg`,
        description:
          "Custom 3D printing and rapid prototyping for pottery tools, replacement parts, and one-off prototypes in Sammamish and the Eastside, WA.",
        email: "thomas@chop-lab.com",
        priceRange: "$3–$100",
        areaServed: [
          { "@type": "City", name: "Sammamish" },
          { "@type": "City", name: "Redmond" },
          { "@type": "City", name: "Issaquah" },
          { "@type": "City", name: "Bellevue" },
          { "@type": "AdministrativeArea", name: "Eastside, Washington" },
        ],
        knowsAbout: [
          "3D printing",
          "Rapid prototyping",
          "Pottery tools",
          "CAD modeling",
          "Replacement parts",
        ],
      },
    }),
  component: PrintingPage,
});

function PrintingPage() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Custom 3D printing · Sammamish & the Eastside, WA
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">
              Custom 3D printing and{" "}
              <span className="italic text-primary">rapid prototyping.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              A micro-manufacturing lab on the Eastside. Send a sketch, a broken
              part, or an STL and get a CAD model, a quote, and a printed part —
              PLA Matte for detail, PETG for structure.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/configure">
                  Request a quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/tools">See studio tools</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Local pickup around Sammamish, or shipped anywhere in the US.
            </p>
          </div>
          <div className="relative min-h-72 lg:min-h-full">
            <img
              src="/images/printer-action.jpg"
              alt="A desktop 3D printer running a custom prototyping job in the Chop Lab"
              width={1536}
              height={1024}
              decoding="async"
              className="img-frame h-full w-full object-cover lg:absolute lg:inset-0"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            ["Material", "PLA Matte / PETG"],
            ["Build volume", <span key="bv"><Length mm={256} /> cube</span>],
            ["Turnaround", "1–5 days"],
            ["Payment", "Invoice after CAD"],
          ].map(([k, v], i) => (
            <div key={i} className="bg-bg px-4 py-5 sm:px-6">
              <p className="text-xs uppercase tracking-wider text-muted">{k}</p>
              <p className="mt-1 font-display text-lg font-medium">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">What we print</p>
        <h2 className="mt-2 max-w-2xl font-display text-4xl font-medium tracking-tight">
          From pottery tools to one-off prototypes.
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {USE_CASES.map((item) => (
            <article key={item.title}>
              <h3 className="font-display text-2xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-bg-warm py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Materials</p>
          <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
            The right plastic for the job.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {MATERIALS.map((m) => (
              <article key={m.name} className="rounded-xl bg-surface p-6 shadow-lift sm:p-8">
                <h3 className="font-display text-2xl font-medium tracking-tight">{m.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">
                  {m.best}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            Maximum build volume is a <Length mm={256} /> cube. Larger parts are
            sliced into interlocking pieces so they still come off the printer
            true.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">How it works</p>
            <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Specs in, printed part out.
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                ["Send specs", "A sketch, an STL, a photo with dimensions, or a broken part."],
                ["CAD & quote", "Thomas models the part and emails an exact quote in one to two days."],
                ["Print & finish", "Approved parts print in-lab, then ship or get picked up locally."],
              ].map(([title, body], i) => (
                <li key={title} className="flex gap-4">
                  <span className="font-display text-sm text-primary">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild className="mt-8">
              <Link to="/configure">
                Open the configurator
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="rounded-xl bg-surface p-6 shadow-lift sm:p-8">
            <h2 className="font-display text-2xl font-medium">Common questions</h2>
            <dl className="mt-5 space-y-4">
              {FAQS.slice(0, 4).map((item) => (
                <div key={item.q}>
                  <dt className="text-sm font-medium text-fg">{item.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
            <Button asChild variant="secondary" className="mt-6">
              <Link to="/faq">All questions</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-kiln text-kiln-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-medium tracking-tight">
            Have a part to print?
          </h2>
          <p className="mt-3 max-w-lg text-kiln-fg/70">
            Send the file, the sketch, or the broken part. Thomas emails the CAD
            and a quote — nothing is charged today.
          </p>
          <Button asChild variant="kiln" className="mt-8">
            <Link to="/configure">
              Request a quote
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
