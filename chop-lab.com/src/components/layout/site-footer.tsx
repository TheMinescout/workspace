import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg-warm">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl font-medium tracking-tight">The Chop Lab</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Custom chops, rollers, and studio tools — engineered in a
            micro-manufacturing lab and printed in PLA Matte for clean clay
            release.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Studio</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/tools" className="text-fg hover:text-primary">
                Tools
              </Link>
            </li>
            <li>
              <Link to="/files" className="text-fg hover:text-primary">
                Digital files
              </Link>
            </li>
            <li>
              <Link to="/configure" className="text-fg hover:text-primary">
                Tool consultation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Lab</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-fg hover:text-primary">
                About Thomas
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-fg hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/engineering-drawings" className="text-fg hover:text-primary">
                Engineering drawings
              </Link>
            </li>
            <li>
              <Link to="/invoice" className="text-fg hover:text-primary">
                Invoice generator
              </Link>
            </li>
            <li className="text-muted">Build volume 256 mm cube</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>The Chop Lab — tools for working clay, not for serving food.</p>
          <p>Invoice after CAD approval. No payment collected today.</p>
        </div>
      </div>
    </footer>
  );
}
