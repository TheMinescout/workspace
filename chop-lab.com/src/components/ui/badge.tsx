import { cn } from "@/lib/utils";

function Badge({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"span"> & { tone?: "default" | "primary" | "kiln" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
        tone === "default" && "bg-bg-warm text-fg",
        tone === "primary" && "bg-primary text-primary-fg",
        tone === "kiln" && "bg-kiln text-kiln-fg",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
