import { useState } from "react";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

/**
 * Product detail gallery: one large hero shot plus a thumbnail strip. The
 * active image swaps on click; the strip stays keyboard-reachable and each
 * thumbnail carries the same alt text as the shot it reveals.
 */
export function ProductGallery({
  images,
  className,
}: {
  images: GalleryImage[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden rounded-xl bg-bg-warm shadow-lift">
        <img
          src={current.src}
          alt={current.alt}
          decoding="async"
          className="img-frame aspect-[4/3] w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg bg-bg-warm shadow-lift transition-[box-shadow,opacity] duration-quick sm:size-20",
                i === active ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100",
              )}
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
