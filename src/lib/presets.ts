import { DEFAULT_KARL_INCOME } from "./finance";
import type { ScenarioRequest } from "./types";

export interface Preset {
  id: string;
  label: string;
  /** One line shown in the Situation example menu. Fictional composites. */
  summary: string;
  inputs: ScenarioRequest;
}

// Presets set every input. Rents sit inside each parcel's area band (src/lib/rent.ts), and the
// subsidy is chosen so Karl pays 30-35% of his income.
export const PRESETS: Preset[] = [
  {
    id: "linda-karl",
    label: "Linda & Karl",
    summary: "Fullerton homeowner turned down for an ADU loan + a neighbor who needs a stable home.",
    inputs: {
      parcelId: 1,
      buildCost: 220_000,
      partnerUpfront: 60_000,
      monthlyRent: 1_725,
      rentToPaydownPct: 60,
      partnerRentSubsidy: 750,
      karlMonthlyIncome: DEFAULT_KARL_INCOME,
    },
  },
  {
    id: "senior-clt",
    label: "Senior homeowner + land trust",
    summary: "Buena Park senior on a tight budget partners with a community land trust.",
    inputs: {
      parcelId: 8,
      buildCost: 180_000,
      partnerUpfront: 100_000,
      monthlyRent: 1_550,
      rentToPaydownPct: 40,
      partnerRentSubsidy: 600,
      karlMonthlyIncome: DEFAULT_KARL_INCOME,
    },
  },
];
