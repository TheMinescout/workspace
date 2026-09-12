import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolIllustration } from "@/components/tool-drawings";
import { StlThumbnail } from "@/components/stl-thumbnail";
import type { Product } from "@/lib/products";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: product.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-surface shadow-lift",
        "transition-[box-shadow,transform] duration-fast ease-out-smooth",
        "hover:shadow-lift-hover",
        featured && "sm:flex-row sm:min-h-72",
      )}
    >
      <div
        className={cn(
          "relative bg-bg-warm",
          featured ? "sm:w-1/2 min-h-52" : "aspect-[4/3]",
        )}
      >
        {product.image ? (
          <img
            src={product.image}
            alt=""
            className="img-frame h-full w-full object-cover"
          />
        ) : product.stlFile ? (
          <StlThumbnail
            url={product.stlFile}
            className="img-frame h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-44 items-center justify-center p-6 text-muted">
            <ToolIllustration drawing={product.drawing} className="h-44 w-44" />
          </div>
        )}
        {product.bestSeller ? (
          <Badge tone="primary" className="absolute left-3 top-3">
            Best seller
          </Badge>
        ) : product.digital ? (
          <Badge className="absolute left-3 top-3">STL</Badge>
        ) : null}
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "sm:p-8 sm:justify-center")}>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {product.digital ? "Digital file" : "Studio tool"}
          </p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-fg">
            {product.name}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="text-sm tabular-nums text-fg">
            {money(product.basePrice)} base
            <span className="text-muted">
              {" "}
              + {money(product.hourlyRate)}/hr
            </span>
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View
            <ArrowRight className="size-4 transition-transform duration-quick group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
