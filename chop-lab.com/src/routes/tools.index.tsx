import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, productsIn } from "@/lib/products";

export const Route = createFileRoute("/tools/")({
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Studio tools</p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">The bench.</h1>
      <p className="mt-4 max-w-xl text-muted">
        Every tool is modeled parametrically and printed in PLA Matte. Configure
        one and Thomas will send a CAD review and quote — nothing is charged today.
      </p>

      <div className="mt-14 space-y-16">
        {CATEGORIES.filter((c) => c.id !== "digital").map((cat) => {
          const items = productsIn(cat.id);
          return (
            <section key={cat.id}>
              <h2 className="font-display text-3xl font-medium tracking-tight">{cat.name}</h2>
              <p className="mt-2 text-sm text-muted">{cat.blurb}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {items.map((p) => (
                  <div key={p.slug} className={p.bestSeller ? "sm:col-span-2" : undefined}>
                    <ProductCard product={p} featured={p.bestSeller} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
