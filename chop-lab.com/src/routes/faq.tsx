import { createFileRoute, Link } from "@tanstack/react-router";
import { FaqList } from "@/components/faq-list";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">FAQ</p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">
        Frequently asked.
      </h1>
      <p className="mt-4 text-muted">
        Materials, food safety, timing, build volume, and how payment works.
      </p>
      <div className="mt-10">
        <FaqList />
      </div>
      <div className="mt-12 rounded-xl bg-surface p-6 shadow-lift sm:p-8">
        <h2 className="font-display text-2xl font-medium">Still looking?</h2>
        <p className="mt-2 text-sm text-muted">
          Send the request to Thomas through the configurator. He’ll answer with
          the CAD, not a sales thread.
        </p>
        <Button asChild className="mt-5">
          <Link to="/configure">Open a consultation</Link>
        </Button>
      </div>
    </main>
  );
}
