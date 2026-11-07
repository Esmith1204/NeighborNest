import { rentBandFor } from "./rent";

export type Zoning = "R1" | "R2" | "Historic";

/** A SYNTHETIC parcel. No real addresses, owners or parcel facts. */
export interface Parcel {
  id: number;
  label: string;
  city: string;
  zoning: Zoning;
  lotSqFt: number;
  existingHomeSqFt: number;
  currentMortgageBalance: number;
  currentInterestRate: number; // percent, e.g. 4.1
}

export interface FeasibilityBreakdown {
  yardSqFt: number;
  yardPoints: number; // max 50
  zoningPoints: number; // max 30
  rentPoints: number; // max 20
}

export interface Feasibility {
  score: number; // 0-100
  breakdown: FeasibilityBreakdown;
  label: string;
}

export const FEASIBILITY_FOOTNOTE =
  "Simplified demo scoring; real eligibility depends on local rules and permits.";

/** ASSUMPTION: midpoint of the $150k-$350k build cost range used for rent coverage. */
export const MIDPOINT_COST = 250_000;
/** ASSUMPTION: a year of rent covering 16% of the midpoint cost (about a 6-year simple payback) earns the full 20 points. */
export const FULL_RENT_COVERAGE = 0.16;

export function calculateFeasibility(parcel: Parcel): Feasibility {
  const yardSqFt = parcel.lotSqFt - parcel.existingHomeSqFt;
  const yardPoints = yardSqFt > 1200 ? 50 : yardSqFt >= 800 ? 30 : 0;
  const zoningPoints = parcel.zoning === "Historic" ? 10 : 30;

  // Scored on the area's typical program rent, so the score describes the parcel, not the slider.
  const coverage = (rentBandFor(parcel.city).typical * 12) / MIDPOINT_COST;
  const rentPoints = Math.round(Math.min(20, Math.max(0, (coverage / FULL_RENT_COVERAGE) * 20)));

  const score = yardPoints + zoningPoints + rentPoints;
  const label =
    score >= 75
      ? "Eligible for Fast-Track Co-Financing"
      : score >= 50
        ? "Possible with conditions"
        : "Not feasible yet";

  return { score, breakdown: { yardSqFt, yardPoints, zoningPoints, rentPoints }, label };
}
