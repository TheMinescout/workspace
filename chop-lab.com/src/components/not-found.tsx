import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Scrapped part.</h1>
      <p className="mt-4 text-muted">
        The requested asset has been removed or does not exist. Return to the lab
        floor and pick a tool that is still on the bench.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Return to the lab</Link>
      </Button>
    </main>
  );
}
