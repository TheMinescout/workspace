import { useLength } from "@/lib/units";

/**
 * Renders a canonical millimetre measurement in the visitor's chosen unit,
 * re-rendering whenever the unit switch changes. Keep all lengths in the app
 * flowing through here (or `useLength`) so nothing displays a stale unit.
 */
export function Length({ mm }: { mm: number }) {
  const { format } = useLength();
  return <>{format(mm)}</>;
}
