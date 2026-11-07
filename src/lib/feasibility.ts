export type Zoning = "R1" | "R2" | "Historic";

export interface Parcel {
  id: number;
  address: string;
  city: string;
  zoning: Zoning;
  lotSqFt: number;
  existingHomeSqFt: number;
  currentMortgageBalance: number;
  currentInterestRate: number; // percent, e.g. 4.1
  estimatedAduRent: number; // $/month
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

/** Midpoint of the $150k-$350k build cost range used for rent coverage. */
const MIDPOINT_COST = 250_000;
/** Gross annual rent / midpoint cost at which rent coverage earns its full 20 points (24%). */
const FULL_RENT_COVERAGE = 0.24;

export function calculateFeasibility(parcel: Parcel): Feasibility {
  const yardSqFt = parcel.lotSqFt - parcel.existingHomeSqFt;
  const yardPoints = yardSqFt > 1200 ? 50 : yardSqFt >= 800 ? 30 : 0;
  const zoningPoints = parcel.zoning === "Historic" ? 10 : 30;

  const coverage = (parcel.estimatedAduRent * 12) / MIDPOINT_COST;
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
