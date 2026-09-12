import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Unit = "mm" | "in";

const MM_PER_IN = 25.4;

function trim(n: number) {
  return Number.parseFloat(n.toFixed(2)).toString();
}

type UnitsState = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  formatMm: (mm: number) => string;
  toDisplay: (mm: number) => number;
  fromDisplay: (value: number) => number;
};

export const useUnits = create<UnitsState>()(
  persist(
    (set, get) => ({
      unit: "mm",
      setUnit: (unit) => set({ unit }),
      formatMm: (mm: number) => {
        if (get().unit === "in") return `${trim(mm / MM_PER_IN)} in`;
        return `${trim(mm)} mm`;
      },
      toDisplay: (mm: number) => (get().unit === "in" ? mm / MM_PER_IN : mm),
      fromDisplay: (value: number) => (get().unit === "in" ? value * MM_PER_IN : value),
    }),
    { name: "chop-lab-units" },
  ),
);
