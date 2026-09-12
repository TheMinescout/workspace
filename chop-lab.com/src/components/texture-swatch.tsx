import type { TextureId } from "@/lib/textures";
import { TEXTURES } from "@/lib/textures";
import { cn } from "@/lib/utils";

/**
 * Shows the real photographed roller pattern for a given texture id — no
 * procedural/coded pattern generation. Pass `closeup={false}` to show the
 * full roller-and-impression shot instead of the tight detail crop.
 */
export function TextureSwatch({
  id,
  className,
  closeup = true,
}: {
  id: TextureId;
  className?: string;
  active?: boolean;
  closeup?: boolean;
}) {
  const texture = TEXTURES.find((t) => t.id === id);
  if (!texture) return null;
  return (
    <img
      src={closeup ? texture.closeup : texture.image}
      alt={`${texture.name} texture roller pattern`}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
