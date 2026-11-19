import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Check, Wrench } from "lucide-react";
import { Length } from "@/components/length";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaqList } from "@/components/faq-list";
import { BUSINESS, LOCAL_BUSINESS_LD, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/3d-printing")({
  head: () =>
    pageHead({
      title: "Local 3D Printing & Custom Prototyping — Sammamish, WA",
      description:
        "Custom 3D printing, CAD design, and rapid prototyping in Sammamish, WA. Pottery tools, replacement parts, and one-off prototypes, quoted after a CAD review — serving the Eastside.",
      path: "/3d-printing",
      ld: LOCAL_BUSINESS_LD,
    }),
  component: LocalPrintingPage,
});

const USE_CASES = [
  {
    icon: Wrench,
    title: "Custom pottery tools",
    body: "Maker's marks, chops, texture rollers, slab rails, and sponge baskets for your wheel. Every dimension comes from your studio, not a guess.",
    link: { to: "/tools", label: "Browse the tool catalog" },
  },
  {
    icon: Boxes,
    title: "Replacement parts",
    body: "A broken clip, a discontinued knob, a bracket that never quite fit — reverse-engineered from a photo and a measurement, then printed to match.",
    link: { to: "/configure", label: "Describe the part" },
  },
  {
    icon: Check,
    title: "Rapid prototypes",
    body: "Have an idea for a jig, mold, or small product? Send a sketch or STL and get a printable model plus a quote in one to two days.",
    link: { to: "/engineering-drawings", label: "See drawing tools" },
  },
] as const;

const MATERIALS = [
  {
    name: "PLA Matte",
    best: "Pottery tools and detail work",
    body: "High detail, low friction, and a matte surface that releases clay instead of dragging it.",
  },
  {
    name: "PETG",
    best: "Structural and warm parts",
    body: "More heat resistance and toughness for clips, brackets, and anything that holds a load.",
  },
  {
    name: "Resin (on request)",
    best: "Fine-detail masters",
    body: "For very fine positives when a master is needed. Availability is confirmed during the quote.",
  },
] as const;

function LocalPrintingPage() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
            <p className="rise-in text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Local 3D printing · {BUSINESS.locality}, {BUSINESS.region}
            </p>
            <h1 className="rise-in-2 mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">
              Custom 3D printing
              <span className="italic text-primary"> on the Eastside.</span>
            </h1>
            <p className="rise-in-3 mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              One-off parts, custom pottery tools, and rapid prototypes, printed
              in a micro-manufacturing lab in {BUSINESS.locality}. Send a CAD
              file, a sketch, or a measurement and get a quote after a CAD
              review — nothing is charged today.
            </p>
            <div className="rise-in-4 mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/configure">
                  Start a quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/tools">Browse pottery tools</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted">
              Serving {BUSINESS.areaServed.slice(0, 5).join(", ")}, and the wider
              Eastside — local handoff or shipping.
            </p>
          </div>
          <div className="relative min-h-72 lg:min-h-full">
            <img
              src="/images/printer-action.jpg"
              alt="A desktop FDM 3D printer running a custom part in The Chop Lab"
              width={1536}
              height={1024}
              loading="eager"
              decoding="async"
              className="img-frame h-full w-full object-cover lg:absolute lg:inset-0"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            ["Location", `${BUSINESS.locality}, ${BUSINESS.region}`],
            ["Material", "PLA Matte / PETG"],
            ["Build volume", <span key="bv"><Length mm={256} /> cube</span>],
            ["Turnaround", "3–5 days"],
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
          From a broken bracket to a better tool for the wheel.
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <article key={useCase.title} className="rounded-xl bg-surface p-6 shadow-lift">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-bg-warm text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">
                  {useCase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{useCase.body}</p>
                <Button asChild variant="ghost" className="mt-4 -ml-3">
                  <Link to={useCase.link.to}>
                    {useCase.link.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-bg-warm py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Materials</p>
              <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
                The right plastic for the part.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted">
              Pick by use, not by buzzword. If the material is wrong for your
              part, the quote says so.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MATERIALS.map((material) => (
              <article key={material.name} className="rounded-xl bg-surface p-6 shadow-lift">
                <Badge tone={material.name === "Resin (on request)" ? "default" : "primary"}>
                  {material.name}
                </Badge>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted">
                  {material.best}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{material.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">How it works</p>
          <h2 className="mt-2 font-display text-4xl font-medium tracking-tight">
            Send the file. Get the CAD and a quote.
          </h2>
          <ol className="mt-8 space-y-5">
            {[
              ["Send the details", "An STL, a sketch, a photo, or exact dimensions through the configurator."],
              ["CAD review + quote", "Thomas models the part and emails an exact quote within one to two days."],
              ["Fabricate", "Printed in PLA Matte or PETG and checked before it leaves the bench."],
              ["Handoff or ship", "Local pickup around the Eastside, or shipped to your door."],
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
        </div>
        <div className="overflow-hidden rounded-xl shadow-lift">
          <img
            src="/images/chop-complex-cad.jpg"
            alt="A CAD model open in the Chop Lab, ready for a custom 3D print"
            loading="lazy"
            decoding="async"
            className="img-frame aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight">Questions, answered.</h2>
        <div className="mt-8">
          <FaqList />
        </div>
      </section>

      <section className="bg-kiln text-kiln-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-medium tracking-tight">
            Send a part to the bench.
          </h2>
          <p className="mt-3 max-w-lg text-kiln-fg/70">
            A file, a sketch, or a measurement is enough to start. Thomas emails
            the CAD and a quote — nothing is charged today.
          </p>
          <Button asChild variant="kiln" className="mt-8">
            <Link to="/configure">
              Open the quote configurator
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
