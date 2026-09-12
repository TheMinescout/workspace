import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ChopPreview } from "@/components/chop-preview";
import { ProductCard } from "@/components/product-card";
import { ToolIllustration } from "@/components/tool-drawings";
import { StlThumbnail } from "@/components/stl-thumbnail";
import { Button } from "@/components/ui/button";
import { getProduct, PRODUCTS, quoteFor } from "@/lib/products";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/tools/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) throw notFound();

  const related = PRODUCTS.filter(
    (p) => p.slug !== product.slug && (p.category === product.category || p.kind === product.kind),
  ).slice(0, 3);
  const estimate = quoteFor(product);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        <Link to="/tools" className="hover:text-fg">
          Tools
        </Link>
        <span className="px-2">/</span>
        {product.name}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-xl bg-bg-warm shadow-lift">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="img-frame aspect-[4/3] w-full object-cover"
            />
          ) : product.stlFile ? (
            <StlThumbnail
              url={product.stlFile}
              alt={product.name}
              className="img-frame aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-muted">
              <ToolIllustration drawing={product.drawing} className="h-48 w-48" />
            </div>
          )}
        </div>

        <div>
          {product.bestSeller ? (
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Best seller</p>
          ) : null}
          <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{product.longDescription}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
            <div>
              <p className="text-muted">Quote target</p>
              <p className="mt-1 font-display text-2xl tabular-nums">{money(estimate)}</p>
              <p className="mt-1 text-xs text-muted">
                {money(product.basePrice)} base + {money(product.hourlyRate)}/hr · ~
                {product.estimatedHours} hr
              </p>
            </div>
            <div>
              <p className="text-muted">Turnaround</p>
              <p className="mt-1 font-display text-2xl">3–5 days</p>
              <p className="mt-1 text-xs text-muted">After artwork is approved</p>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-3 gap-3 text-sm">
            {product.specs.map((s) => (
              <div key={s.label} className="rounded-lg bg-surface p-3 shadow-lift">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="mt-1">{s.value}</dd>
              </div>
            ))}
          </dl>

          {product.kind === "chop" ? (
            <div className="mt-8 flex items-center gap-4">
              <ChopPreview text="TL" size="sm" />
              <p className="text-sm text-muted">
                Type your mark in the configurator to preview the impression before
                you send it.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/configure" search={{ product: product.slug }}>
                Configure this tool
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {product.digital ? null : (
              <Button asChild size="lg" variant="secondary">
                <Link to="/files">Need the STL instead?</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-medium tracking-tight">Also on the bench</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
