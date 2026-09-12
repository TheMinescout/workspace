import type { ToolDrawing } from "@/lib/products";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function ChopDrawing({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-fg", className)} fill="none" aria-hidden>
      <circle cx="100" cy="132" r="48" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="132" r="38" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="90" y="42" width="20" height="52" rx="6" stroke="currentColor" strokeWidth="1.5" />
      <rect x="86" y="34" width="28" height="12" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="100"
        y="138"
        textAnchor="middle"
        className="font-display"
        fill="currentColor"
        fontSize="18"
        fontFamily="Fraunces, serif"
      >
        TL
      </text>
    </svg>
  );
}

export function RollerDrawing({ className, compact }: Props & { compact?: boolean }) {
  const w = compact ? 110 : 160;
  const x = (200 - w) / 2;
  return (
    <svg viewBox="0 0 200 200" className={cn("text-fg", className)} fill="none" aria-hidden>
      <rect x={x} y="78" width={w} height="44" rx="22" stroke="currentColor" strokeWidth="1.5" />
      {Array.from({ length: compact ? 5 : 8 }).map((_, i) => {
        const cx = x + 18 + i * (compact ? 18 : 17);
        return (
          <g key={i} opacity="0.7">
            <polygon
              points={`${cx},90 ${cx + 7},96 ${cx + 7},104 ${cx},110 ${cx - 7},104 ${cx - 7},96`}
              stroke="currentColor"
              strokeWidth="1"
            />
          </g>
        );
      })}
      <circle cx={x} cy="100" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={x + w} cy="100" r="8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function BasketDrawing({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-fg", className)} fill="none" aria-hidden>
      <path d="M48 86h104v52a18 18 0 0 1-18 18H66a18 18 0 0 1-18-18V86Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 86h120" stroke="currentColor" strokeWidth="1.5" />
      <path d="M58 70c0-8 8-16 18-16h48c10 0 18 8 18 16v16H58V70Z" stroke="currentColor" strokeWidth="1.5" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const ox = row % 2 === 0 ? 0 : 8;
          const x = 64 + col * 16 + ox;
          const y = 96 + row * 12;
          if (x > 140) return null;
          return (
            <polygon
              key={`${row}-${col}`}
              points={`${x},${y} ${x + 6},${y + 3.5} ${x + 6},${y + 8.5} ${x},${y + 12} ${x - 6},${y + 8.5} ${x - 6},${y + 3.5}`}
              stroke="currentColor"
              strokeWidth="0.9"
              opacity="0.7"
            />
          );
        }),
      )}
    </svg>
  );
}

export function RailsDrawing({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-fg", className)} fill="none" aria-hidden>
      <rect x="28" y="64" width="144" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="28" y="118" width="144" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M44 82v36M156 82v36" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <path d="M28 73h12l-6 9h-6V73Zm144 0h-12l6 9h6V73Z" fill="currentColor" opacity="0.35" />
      <path d="M28 127h12l-6-9h-6v9Zm144 0h-12l6-9h6v9Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function CutterDrawing({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={cn("text-fg", className)} fill="none" aria-hidden>
      <rect x="88" y="36" width="24" height="70" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M64 108h72l-12 48H76L64 108Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M100 108v48" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M78 128h44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function ToolIllustration({
  drawing,
  className,
}: {
  drawing: ToolDrawing;
  className?: string;
}) {
  switch (drawing) {
    case "chop":
      return <ChopDrawing className={className} />;
    case "roller-10":
      return <RollerDrawing className={className} />;
    case "roller-4":
      return <RollerDrawing className={className} compact />;
    case "basket":
      return <BasketDrawing className={className} />;
    case "rails":
      return <RailsDrawing className={className} />;
    case "cutter":
      return <CutterDrawing className={className} />;
  }
}
