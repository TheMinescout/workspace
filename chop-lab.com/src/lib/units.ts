import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Unit = "mm" | "in";

export const MM_PER_IN = 25.4;

export const UNITS: { id: Unit; label: string; full: string }[] = [
  { id: "mm", label: "mm", full: "Millimeters" },
  { id: "in", label: "in", full: "Inches" },
];

/** Round to two decimals and drop trailing zeros, so 25.40 reads as 25.4. */
export function trim(n: number) {
  return Number.parseFloat(n.toFixed(2));
}

export function mmToUnit(mm: number, unit: Unit) {
  return unit === "in" ? mm / MM_PER_IN : mm;
}

export function unitToMm(value: number, unit: Unit) {
  return unit === "in" ? value * MM_PER_IN : value;
}

/** Format a canonical millimetre value in the given unit. */
export function formatLength(mm: number, unit: Unit, withUnit = true) {
  const value = trim(mmToUnit(mm, unit));
  return withUnit ? `${value} ${unit}` : `${value}`;
}

type UnitsState = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  toggle: () => void;
};

export const useUnits = create<UnitsState>()(
  persist(
    (set, get) => ({
      unit: "mm",
      setUnit: (unit) => set({ unit }),
      toggle: () => set({ unit: get().unit === "mm" ? "in" : "mm" }),
    }),
    { name: "chop-lab-units" },
  ),
);

/**
 * Length helpers bound to the current unit. Values are stored canonically in
 * millimetres everywhere; this is the only place display units enter or leave
 * the app, so a unit switch really re-renders every measurement.
 */
export function useLength() {
  const unit = useUnits((s) => s.unit);
  return {
    unit,
    toDisplay: (mm: number) => trim(mmToUnit(mm, unit)),
    fromDisplay: (value: number) => unitToMm(value, unit),
    format: (mm: number) => formatLength(mm, unit),
  };
}
