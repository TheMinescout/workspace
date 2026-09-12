import { createFileRoute } from "@tanstack/react-router";
import { ConsultationForm } from "@/components/consultation-form";
import { getProduct } from "@/lib/products";

type ConfigureSearch = {
  product?: string;
};

export const Route = createFileRoute("/configure")({
  validateSearch: (s: Record<string, unknown>): ConfigureSearch => ({
    product: typeof s.product === "string" && getProduct(s.product) ? s.product : undefined,
  }),
  component: ConfigurePage,
});

function ConfigurePage() {
  const { product } = Route.useSearch();
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Tool consultation</p>
      <h1 className="mt-2 font-display text-5xl font-medium tracking-tight">
        Configure to spec.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Send dimensions, a mark, or a sketch. Thomas builds the CAD, emails a
        quote, and only then does production start. No payment is collected here.
      </p>
      <div className="mt-12">
        <ConsultationForm initialSlug={product} />
      </div>
    </main>
  );
}
