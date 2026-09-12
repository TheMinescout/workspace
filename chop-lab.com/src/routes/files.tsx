import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { productsIn } from "@/lib/products";

export const Route = createFileRoute("/files")({
  component: FilesPage,
});

function FilesPage() {
  const files = productsIn("digital");
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-14 sm:px-6 sm:py-20">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Digital files
            </p>
            <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">
              Print it in your own lab.
            </h1>
            <p className="mt-4 max-w-md text-muted leading-relaxed">
              STL downloads of tools we already model in-house. $5 base plus $1
              per hour of quoted print time. The file link and invoice are emailed
              after a short review — nothing is charged on this page.
            </p>
            <p className="mt-4 text-sm text-muted">
              Maximum build volume 256 × 256 × 256 mm. Larger parts need to be
              sliced into interlocking pieces first.
            </p>
            <Button asChild className="mt-8 w-fit">
              <Link to="/configure" search={{ product: "stl-dual-bevel" }}>
                Request a file
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="min-h-72">
            <img
              src="/images/printer-action.jpg"
              alt="Desktop 3D printer running a job, ready to print a downloaded STL"
              className="img-frame h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {files.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
