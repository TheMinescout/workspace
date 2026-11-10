import { createFileRoute } from "@tanstack/react-router";
import { ConsultationForm } from "@/components/consultation-form";
import { getProduct } from "@/lib/products";
import { pageHead } from "@/lib/seo";
import { TEXTURES, type TextureId } from "@/lib/textures";

type ConfigureSearch = {
  product?: string;
  texture?: TextureId;
};

function isTextureId(v: unknown): v is TextureId {
  return typeof v === "string" && TEXTURES.some((t) => t.id === v);
}

export const Route = createFileRoute("/configure")({
  head: () =>
    pageHead({
      title: "Configure a tool — The Chop Lab",
      description:
        "Send a logo, sketch, or exact dimensions. Thomas builds the CAD and emails a quote — no payment is collected in the configurator.",
      path: "/configure",
    }),
  validateSearch: (s: Record<string, unknown>): ConfigureSearch => ({
    product: typeof s.product === "string" && getProduct(s.product) ? s.product : undefined,
    texture: isTextureId(s.texture) ? s.texture : undefined,
  }),
  component: ConfigurePage,
});

function ConfigurePage() {
  const { product, texture } = Route.useSearch();
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
        <ConsultationForm initialSlug={product} initialTexture={texture} />
      </div>
    </main>
  );
}
