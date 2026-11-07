// Program rent bands by area. The ADU is rented BELOW market: the homeowner accepts a capped
// rent in exchange for the community partner's upfront cash. The market reference is sourced;
// the band shares and the city tiers are ASSUMPTIONS (see src/lib/assumptions.ts).

export const MARKET_RENT_REFERENCE = {
  monthly: 2682,
  label: "HUD FY2026 Fair Market Rent, efficiency (studio), Santa Ana-Anaheim-Irvine HUD Metro FMR Area (all of Orange County)",
  url: "https://www.huduser.gov/portal/datasets/fmr/fmrs/FY2026_code/2026summary.odn?&year=2026&fmrtype=Final&selection_type=county&fips=0605999999",
  checked: "2026-11-07",
  caveat: "HUD has also published FY2027 FMRs, which we could not read. This figure may be out of date.",
} as const;

export type AreaTier = "higher" | "middle" | "lower";

/** ASSUMPTION: program rent as a share of the HUD studio FMR, by area cost tier. Team judgment, not sourced. */
export const AREA_TIERS: Record<AreaTier, { label: string; minShare: number; maxShare: number }> = {
  higher: { label: "Higher-cost area", minShare: 0.62, maxShare: 0.75 },
  middle: { label: "Mid-cost area", minShare: 0.58, maxShare: 0.7 },
  lower: { label: "Lower-cost area", minShare: 0.55, maxShare: 0.66 },
};

/** ASSUMPTION: which tier each city falls in. Next step: replace with HUD Small Area FMRs by ZIP. */
export const CITY_TIER: Record<string, AreaTier> = {
  "Costa Mesa": "higher",
  Tustin: "higher",
  Fullerton: "middle",
  Anaheim: "middle",
  Orange: "middle",
  "Santa Ana": "lower",
  "Garden Grove": "lower",
  "Buena Park": "lower",
};

export interface RentBand {
  min: number;
  max: number;
  typical: number;
  tier: AreaTier;
  tierLabel: string;
}

const STEP = 25;

export function rentBandFor(city: string): RentBand {
  const tier = CITY_TIER[city] ?? "middle";
  const { label, minShare, maxShare } = AREA_TIERS[tier];
  const min = Math.ceil((MARKET_RENT_REFERENCE.monthly * minShare) / STEP) * STEP;
  const max = Math.floor((MARKET_RENT_REFERENCE.monthly * maxShare) / STEP) * STEP;
  const typical = Math.round((min + max) / 2 / STEP) * STEP;
  return { min, max, typical, tier, tierLabel: label };
}
