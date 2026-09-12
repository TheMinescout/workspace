import { useId, useState } from "react";
import { cn } from "@/lib/utils";

// Fonts that ship by default with Windows (10/11) so the preview always
// renders in something the person actually has installed — no web-font
// loading required. A couple of close, freely-licensed matches are used
// where the exact Windows font can't legally be shipped as a webfont; in
// that case the label still names the real Windows font, and the CSS
// stack falls back to it by name on a Windows machine while a similar
// shape renders everywhere else.
export const CHOP_FONTS = [
  { id: "segoe", label: "Segoe UI", stack: "'Segoe UI', 'Segoe UI Variable', system-ui, sans-serif" },
  { id: "calibri", label: "Calibri", stack: "Calibri, Carlito, 'Segoe UI', sans-serif" },
  { id: "cambria", label: "Cambria", stack: "Cambria, Caladea, Georgia, serif" },
  { id: "georgia", label: "Georgia", stack: "Georgia, Cambria, 'Times New Roman', serif" },
  { id: "times", label: "Times New Roman", stack: "'Times New Roman', Times, Liberation Serif, serif" },
  { id: "garamond", label: "Garamond", stack: "Garamond, 'EB Garamond', Georgia, serif" },
  { id: "trebuchet", label: "Trebuchet MS", stack: "'Trebuchet MS', 'Trebuchet MS Web', sans-serif" },
  { id: "consolas", label: "Consolas", stack: "Consolas, 'Courier New', monospace" },
  { id: "impact", label: "Impact", stack: "Impact, 'Arial Black', sans-serif" },
  { id: "comic", label: "Comic Sans MS", stack: "'Comic Sans MS', 'Comic Sans', cursive" },
] as const;

export type ChopFontId = (typeof CHOP_FONTS)[number]["id"];

type ChopPreviewProps = {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Font id from CHOP_FONTS. Defaults to Segoe UI. */
  font?: ChopFontId;
  /** Stamp face diameter in mm — affects how much detail/layer texture reads at this scale. */
  diameterMm?: number;
  /** Show the font picker + diameter control beneath the preview. */
  interactive?: boolean;
  onFontChange?: (font: ChopFontId) => void;
};

const DIM = { sm: "w-28 h-28", md: "w-44 h-44", lg: "w-64 h-64" } as const;

export function ChopPreview({
  text,
  className,
  size = "md",
  font = "segoe",
  diameterMm = 40,
  interactive = false,
  onFontChange,
}: ChopPreviewProps) {
  const [localFont, setLocalFont] = useState<ChopFontId>(font);
  const activeFont = interactive ? localFont : font;
  const uid = useId().replace(/:/g, "");

  const letters = (text.trim() || "TL").slice(0, 4).toUpperCase();
  const fontStack = CHOP_FONTS.find((f) => f.id === activeFont)?.stack ?? CHOP_FONTS[0].stack;

  // Font size scales down as more characters are added so a 4-letter mark
  // still fits the stamp face, and scales down further on a smaller
  // physical stamp (diameterMm) since the same character has to read
  // clearly in less real-world space.
  const lengthScale = letters.length > 3 ? 0.58 : letters.length > 2 ? 0.72 : 1;
  const sizeScale = Math.min(1, Math.max(0.7, diameterMm / 40));
  const fontSize = Math.round(52 * lengthScale * sizeScale);

  // Layer lines: an FDM print builds up in horizontal bands. Smaller
  // stamps (fewer, thicker-looking layers at this scale) vs larger ones
  // (more, finer layers) — approximate with a stripe pitch tied to
  // diameter so the texture reads as physically plausible either way.
  const layerPitch = Math.max(1.4, Math.min(3.2, diameterMm / 14));

  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)}>
      <div className={cn("relative aspect-square overflow-hidden rounded-full shadow-lift", DIM[size])} aria-hidden>
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <radialGradient id={`clayFill-${uid}`} cx="42%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#c9a07a" />
              <stop offset="55%" stopColor="#a67c52" />
              <stop offset="100%" stopColor="#7d5a3a" />
            </radialGradient>
            {/* Horizontal FDM layer-line texture, clipped to the stamp face. */}
            <pattern
              id={`layerLines-${uid}`}
              width={layerPitch}
              height={layerPitch}
              patternUnits="userSpaceOnUse"
            >
              <rect width={layerPitch} height={layerPitch} fill="transparent" />
              <line
                x1="0"
                y1={layerPitch * 0.5}
                x2={layerPitch}
                y2={layerPitch * 0.5}
                stroke="#000000"
                strokeOpacity="0.06"
                strokeWidth={Math.max(0.4, layerPitch * 0.18)}
              />
            </pattern>
            <clipPath id={`faceClip-${uid}`}>
              <circle cx="100" cy="100" r="74" />
            </clipPath>
          </defs>

          <circle cx="100" cy="100" r="100" fill={`url(#clayFill-${uid})`} />
          <circle cx="100" cy="100" r="82" fill="none" stroke="#f3eee4" strokeOpacity="0.35" strokeWidth="2" />
          <circle cx="100" cy="100" r="74" fill="#8f6844" stroke="#6e4e32" strokeWidth="1" />

          <g clipPath={`url(#faceClip-${uid})`}>
            <text
              x="100"
              y="108"
              textAnchor="middle"
              fill="#f3eee4"
              fontFamily={fontStack}
              fontSize={fontSize}
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {letters}
            </text>
            {/* Layer lines sit over the whole face, including the raised text,
                the way real print layers read regardless of what's underneath. */}
            <rect x="26" y="26" width="148" height="148" fill={`url(#layerLines-${uid})`} />
          </g>
        </svg>
      </div>

      {interactive ? (
        <div className="w-full max-w-48 space-y-2">
          <label htmlFor={`chop-font-${uid}`} className="sr-only">
            Font
          </label>
          <select
            id={`chop-font-${uid}`}
            value={localFont}
            onChange={(e) => {
              const next = e.target.value as ChopFontId;
              setLocalFont(next);
              onFontChange?.(next);
            }}
            className="input text-xs"
          >
            {CHOP_FONTS.map((f) => (
              <option key={f.id} value={f.id} style={{ fontFamily: f.stack }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
