import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { BlueprintViewer } from "@/components/blueprint-viewer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/engineering-drawings")({
  component: EngineeringDrawingsPage,
});

const LIBRARY = [
  { label: "Bevel Cutter", file: "bevel-cutter.stl" },
  { label: "Interlocking Slab Rails", file: "interlocking-slab-rails.stl" },
  { label: "Mug Handle Slump Mold", file: "mug-handle-slump-mold.stl" },
  { label: "Sponge Basket", file: "sponge-basket.stl" },
  { label: "The Origin Square", file: "origin-square.stl" },
  { label: "TCL Trimming Spinner", file: "trimming-spinner.stl" },
  { label: "TCL Trinity", file: "tcl-trinity.stl" },
  { label: "Throwing Gauge", file: "throwing-gauge.stl" },
] as const;

function EngineeringDrawingsPage() {
  const [selected, setSelected] = useState<string>(LIBRARY[0].file);
  const [customFile, setCustomFile] = useState<{ url: string; name: string } | null>(null);

  const active = useMemo(() => {
    if (customFile) return { url: customFile.url, label: customFile.name };
    const item = LIBRARY.find((l) => l.file === selected) ?? LIBRARY[0];
    return { url: `/files/${item.file}`, label: item.label };
  }, [customFile, selected]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomFile({ url, name: file.name.replace(/\.stl$/i, "") });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Studio tools</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">
        Engineering drawings
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Pick any tool from the library or upload your own STL to generate orthographic
        front, top, and side views with dimensions — plus an isometric render. Export any
        panel as a PNG for your records or a client.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <label
            htmlFor="stl-upload"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-4 py-8 text-center transition-colors duration-quick hover:border-primary/50"
          >
            <UploadCloud className="size-6 text-muted" />
            <span className="text-sm font-medium text-fg">Upload your own STL</span>
            <span className="text-xs text-muted">Rendered locally in your browser</span>
          </label>
          <input
            id="stl-upload"
            type="file"
            accept=".stl"
            className="hidden"
            onChange={handleUpload}
          />

          <p className="label-text mt-8 text-xs font-medium uppercase tracking-wider text-muted">
            Or choose from the library
          </p>
          <div className="mt-3 flex flex-col gap-1">
            {LIBRARY.map((item) => (
              <button
                key={item.file}
                type="button"
                onClick={() => {
                  setCustomFile(null);
                  setSelected(item.file);
                }}
                className={cn(
                  "rounded-md px-3 py-2 text-left text-sm transition-colors duration-quick",
                  !customFile && selected === item.file
                    ? "bg-primary text-primary-fg"
                    : "text-fg hover:bg-bg-warm",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section>
          <h2 className="font-display text-xl font-medium text-fg">{active.label}</h2>
          <div className="mt-4">
            <BlueprintViewer key={active.url} url={active.url} label={active.label} />
          </div>
        </section>
      </div>
    </main>
  );
}
