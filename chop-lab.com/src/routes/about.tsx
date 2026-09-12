import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">The lab technician</p>
        <h1 className="mt-2 max-w-3xl font-display text-5xl font-medium tracking-tight sm:text-6xl">
          A robotics bench that learned to speak clay.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Hi, I’m Thomas. I’m a robotics student, CAD designer, and the
          technician behind The Chop Lab. What started as a project to print
          better pottery tools for my mom’s studio has evolved into a full-scale
          micro-manufacturing lab.
        </p>
      </section>

      <section className="border-y border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <img
            src="/images/thomas-maker.jpg"
            alt="Thomas, the lab technician behind The Chop Lab, working at the pottery wheel"
            className="img-frame h-full min-h-72 w-full object-cover"
          />
          <div className="flex flex-col justify-center px-4 py-12 sm:px-8">
            <h2 className="font-display text-3xl font-medium tracking-tight">
              Parametric, then printed.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every chop, roller, and rail is modeled so the dimensions are
              exact — not approximated in a sculpting tool and hoped for. By
              utilizing parametric modeling and advanced FDM printing, every
              part is mathematically precise and structurally sound.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Pottery tools print in PLA Matte: high detail, low friction, a
              surface that lets go of clay instead of dragging it. Structural
              parts that need heat resistance can be run in PETG.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3">
        {[
          {
            t: "For the studio, not the table",
            b: "FDM prints have layer lines that can harbor bacteria. These tools are for raw clay — not for food or drink.",
          },
          {
            t: "Invoice after the CAD",
            b: "You send specs. Thomas engineers the model and emails a quote. Production starts when you approve it. Nothing is charged in the configurator.",
          },
          {
            t: "256 mm cube",
            b: "That is the maximum build volume. Larger parts are sliced into interlocking pieces so they still come off the printer true.",
          },
        ].map((item) => (
          <article key={item.t}>
            <h3 className="font-display text-2xl font-medium tracking-tight">{item.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.b}</p>
          </article>
        ))}
      </section>

      <section className="bg-kiln text-kiln-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-medium tracking-tight">
            Send something to the bench.
          </h2>
          <p className="mt-3 max-w-lg text-kiln-fg/70">
            A logo, three initials, a bucket lip measurement — enough to start
            a model.
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
