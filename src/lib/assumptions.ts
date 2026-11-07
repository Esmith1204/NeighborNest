// Every number the app did not compute from a formula, with where it came from.
// Shown in the UI's "Assumptions and sources" panel and repeated in the README.
import { FULL_RENT_COVERAGE, MIDPOINT_COST } from "./feasibility.js";
import {
  ADU_LOAN_RATE_PCT,
  ADU_LOAN_YEARS,
  AFFORDABLE_RENT_SHARE,
  CA_MIN_WAGE_2026,
  DEFAULT_KARL_INCOME,
  INPUT_RANGES,
  MORTGAGE_REMAINING_YEARS,
} from "./finance.js";
import { AREA_TIERS, MARKET_RENT_REFERENCE } from "./rent.js";

export type AssumptionKind = "SOURCE" | "ASSUMPTION" | "SYNTHETIC";

export interface Assumption {
  item: string;
  value: string;
  kind: AssumptionKind;
  basis: string;
  url?: string;
  checked?: string;
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;
const tierText = Object.values(AREA_TIERS)
  .map((t) => `${t.label} ${pct(t.minShare)}-${pct(t.maxShare)}`)
  .join(", ");

export const ASSUMPTIONS: Assumption[] = [
  {
    item: "Parcels, mortgages and personas",
    value: "8 sample parcels; Linda and Karl",
    kind: "SYNTHETIC",
    basis: "Made up for the demo. Real city names only; no real addresses, owners or people.",
  },
  {
    item: "Market rent reference (studio)",
    value: `${usd(MARKET_RENT_REFERENCE.monthly)}/month`,
    kind: "SOURCE",
    basis: `${MARKET_RENT_REFERENCE.label}. ${MARKET_RENT_REFERENCE.caveat}`,
    url: MARKET_RENT_REFERENCE.url,
    checked: MARKET_RENT_REFERENCE.checked,
  },
  {
    item: "Program rent band by area",
    value: tierText,
    kind: "ASSUMPTION",
    basis:
      "Share of the HUD studio rent that the homeowner accepts in exchange for the partner's upfront cash. City tiers are team judgment; next step is HUD Small Area FMRs by ZIP.",
  },
  {
    item: "Karl's monthly income",
    value: `${usd(DEFAULT_KARL_INCOME)}/month`,
    kind: "ASSUMPTION",
    basis: `Full time (40 h x 52 weeks) at the 2026 California minimum wage of $${CA_MIN_WAGE_2026.toFixed(2)}/hour (DIR release 2025-118).`,
    url: "https://www.dir.ca.gov/DIRNews/2025/2025-118.html",
    checked: "2026-11-07",
  },
  {
    item: "Affordable rent threshold",
    value: `${pct(AFFORDABLE_RENT_SHARE)} of income`,
    kind: "ASSUMPTION",
    basis:
      "The event brief's \"around 30 to 35 percent\" housing-cost guideline (docs/background.md), applied to rent. Over 50% is shown as severe.",
  },
  {
    item: "ADU loan rate and term",
    value: `${ADU_LOAN_RATE_PCT}%, ${ADU_LOAN_YEARS} years`,
    kind: "ASSUMPTION",
    basis:
      "Rounded from the Freddie Mac 30-year average of 7.18% (week of 2026-11-05) listed in lanes/3-fund-it/data/DATA-SOURCES.md. Real ADU loan terms vary by lender.",
    url: "https://www.freddiemac.com/pmms",
  },
  {
    item: "Mortgage years remaining",
    value: `${MORTGAGE_REMAINING_YEARS} years`,
    kind: "ASSUMPTION",
    basis: "Same for every sample parcel, to keep the payoff chart comparable.",
  },
  {
    item: "ADU build cost range",
    value: `${usd(INPUT_RANGES.buildCost.min)}-${usd(INPUT_RANGES.buildCost.max)}`,
    kind: "ASSUMPTION",
    basis: "No current, free Orange County ADU cost source was verified. Confirm with builders.",
  },
  {
    item: "Rent subsidy flow",
    value: "Paid to the homeowner",
    kind: "ASSUMPTION",
    basis:
      "The partner pays its subsidy to the homeowner on the tenant's behalf, so the homeowner receives the full program rent.",
  },
  {
    item: "Feasibility scoring",
    value: `Yard 50, zoning 30, rent 20 points`,
    kind: "ASSUMPTION",
    basis: `Simplified demo scoring. Rent points: a year of typical area rent vs a ${usd(MIDPOINT_COST)} build, full points at ${pct(FULL_RENT_COVERAGE)}. Real eligibility depends on local rules and permits.`,
  },
];
