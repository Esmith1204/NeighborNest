import { rentBandFor } from "./rent.js";

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

/** ASSUMPTION: yard size (lot minus home) where yard points start (30) and where they max out (50). */
export const YARD_MIN_SQFT = 800;
export const YARD_FULL_SQFT = 1_600;

/** ASSUMPTION: midpoint of the $150k-$350k build cost range used for rent coverage. */
export const MIDPOINT_COST = 250_000;
/** ASSUMPTION: a year of rent covering 16% of the midpoint cost (about a 6-year simple payback) earns the full 20 points. */
export const FULL_RENT_COVERAGE = 0.16;

export function calculateFeasibility(parcel: Parcel): Feasibility {
  const yardSqFt = parcel.lotSqFt - parcel.existingHomeSqFt;
  // ASSUMPTION: 0 points under 800 sq ft of yard; 30 at 800, rising evenly to the full 50 at 1,600+.
  const yardPoints =
    yardSqFt < YARD_MIN_SQFT
      ? 0
      : Math.round(Math.min(50, 30 + (20 * (yardSqFt - YARD_MIN_SQFT)) / (YARD_FULL_SQFT - YARD_MIN_SQFT)));
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
