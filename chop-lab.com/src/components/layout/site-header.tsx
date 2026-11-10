import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnits, UNITS } from "@/lib/units";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/tools", label: "Tools" },
  { to: "/files", label: "Digital files" },
  { to: "/engineering-drawings", label: "Drawings" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
] as const;

function ChopMark({ className }: { className?: string }) {
  return <img src="/logo-48.png" alt="" className={className} />;
}

function UnitsToggle() {
  const unit = useUnits((s) => s.unit);
  const setUnit = useUnits((s) => s.setUnit);
  return (
    <div className="unit-switch" role="group" aria-label="Measurement units" data-unit={unit}>
      <span className="unit-switch__thumb" aria-hidden />
      {UNITS.map((u) => (
        <button
          key={u.id}
          type="button"
          onClick={() => setUnit(u.id)}
          aria-pressed={unit === u.id}
          title={u.full}
          className="unit-switch__option"
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-fg" onClick={() => setOpen(false)}>
          <ChopMark className="size-7 rounded-full" />
          <span className="font-display text-lg font-medium tracking-tight">The Chop Lab</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative py-1 text-sm transition-colors duration-quick",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-primary transition-transform duration-fast ease-out-smooth",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <UnitsToggle />
          </div>
          <Button asChild size="sm">
            <Link to="/configure">Configure</Link>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-bg px-4 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center text-base text-fg"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted">Units</span>
              <UnitsToggle />
            </div>
            <Button asChild className="mt-2 w-full">
              <Link to="/configure" onClick={() => setOpen(false)}>
                Configure a tool
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
