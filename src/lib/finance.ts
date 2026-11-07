import type { Parcel } from "./feasibility.js";

/**
 * Slider ranges. Shared by the UI sliders and server-side validation.
 * Monthly rent has no fixed range: it must sit inside the parcel's area band (src/lib/rent.ts).
 */
export const INPUT_RANGES = {
  buildCost: { min: 150_000, max: 350_000, step: 5_000 },
  partnerUpfront: { min: 0, max: 100_000, step: 5_000 },
  rentToPaydownPct: { min: 0, max: 100, step: 5 }, // percent, 0-100
  partnerRentSubsidy: { min: 0, max: 1_000, step: 25 }, // $/month
  karlMonthlyIncome: { min: 500, max: 6_000, step: 50 }, // $/month
} as const;
export const RENT_STEP = 25;

/** CA statewide minimum wage for 2026 (DIR release 2025-118). */
export const CA_MIN_WAGE_2026 = 16.9;
/** ASSUMPTION: Karl works full time (40 h x 52 weeks) at the state minimum wage: $2,929/month. */
export const DEFAULT_KARL_INCOME = Math.round((CA_MIN_WAGE_2026 * 40 * 52) / 12);

/** ASSUMPTION: the event brief's "around 30 to 35 percent of income" guideline, applied to rent. */
export const AFFORDABLE_RENT_SHARE = 0.35;
/** ASSUMPTION: above half of income is shown as severe. */
export const SEVERE_RENT_SHARE = 0.5;

// Assumptions (shown in the UI's collapsible "Assumptions" panel)
export const ADU_LOAN_RATE_PCT = 7;
export const ADU_LOAN_YEARS = 20;
export const MORTGAGE_REMAINING_YEARS = 25;

export interface ScenarioInputs {
  parcel: Parcel;
  buildCost: number;
  partnerUpfront: number;
  monthlyRent: number; // program rent, inside the parcel's area band
  rentToPaydownPct: number; // 0-100
  partnerRentSubsidy: number;
  karlMonthlyIncome?: number; // default DEFAULT_KARL_INCOME
}

export type BurdenBand = "green" | "yellow" | "red";

export interface BalancePoint {
  month: number;
  baseline: number;
  accelerated: number;
}

export interface Scenario {
  aduLoan: number;
  aduLoanPayment: number;
  gapClosedPct: number; // 0-100
  karlRent: number;
  karlMonthlyIncome: number;
  karlRentBurden: number; // fraction of income, 0.30 = 30%
  karlBurdenBand: BurdenBand;
  lindaNetMonthly: number;
  extraPaydown: number;
  leftForTuition: number;
  baselineMonthlyPayment: number;
  baselinePayoffMonths: number;
  acceleratedPayoffMonths: number;
  yearsShaved: number;
  balanceSeries: BalancePoint[];
}

/** Standard fixed-rate amortized payment. */
export function amortizedPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Month-by-month balances until paid off (or `maxMonths`). Index 0 is the starting balance. */
function balancePath(
  principal: number,
  annualRatePct: number,
  payment: number,
  maxMonths: number,
): number[] {
  const r = annualRatePct / 100 / 12;
  const path = [principal];
  let balance = principal;
  for (let m = 1; m <= maxMonths && balance > 0.005; m++) {
    balance = balance * (1 + r) - payment;
    if (balance < 0.005) balance = 0;
    path.push(balance);
  }
  return path;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeScenario(inputs: ScenarioInputs): Scenario {
  const { parcel, buildCost, partnerUpfront, monthlyRent, partnerRentSubsidy } = inputs;
  const karlMonthlyIncome = inputs.karlMonthlyIncome ?? DEFAULT_KARL_INCOME;
  const rentToPaydownFraction = inputs.rentToPaydownPct / 100;

  const aduLoan = Math.max(0, buildCost - partnerUpfront);
  const aduLoanPayment = amortizedPayment(aduLoan, ADU_LOAN_RATE_PCT, ADU_LOAN_YEARS * 12);
  const gapClosedPct = buildCost > 0 ? (partnerUpfront / buildCost) * 100 : 0;

  const karlRent = Math.max(0, monthlyRent - partnerRentSubsidy);
  const karlRentBurden = karlMonthlyIncome > 0 ? karlRent / karlMonthlyIncome : 1;
  const karlBurdenBand: BurdenBand =
    karlRentBurden <= AFFORDABLE_RENT_SHARE
      ? "green"
      : karlRentBurden <= SEVERE_RENT_SHARE
        ? "yellow"
        : "red";

  // The subsidy is paid to Linda on Karl's behalf, so total rent received is monthlyRent.
  const lindaNetMonthly = monthlyRent - aduLoanPayment;
  const extraPaydown = Math.max(0, lindaNetMonthly) * rentToPaydownFraction;
  const leftForTuition = Math.max(0, lindaNetMonthly) - extraPaydown;

  const months = MORTGAGE_REMAINING_YEARS * 12;
  const baselineMonthlyPayment = amortizedPayment(
    parcel.currentMortgageBalance,
    parcel.currentInterestRate,
    months,
  );
  const baseline = balancePath(
    parcel.currentMortgageBalance,
    parcel.currentInterestRate,
    baselineMonthlyPayment,
    months,
  );
  const accelerated = balancePath(
    parcel.currentMortgageBalance,
    parcel.currentInterestRate,
    baselineMonthlyPayment + extraPaydown,
    months,
  );

  // A path is `length - 1` months long; the baseline pays off at `months` by construction
  // (floating-point residue is cleared by the payoff threshold).
  const baselinePayoffMonths = baseline.length - 1;
  const acceleratedPayoffMonths = accelerated.length - 1;
  const yearsShaved = Math.max(
    0,
    Math.round(((baselinePayoffMonths - acceleratedPayoffMonths) / 12) * 10) / 10,
  );

  const balanceSeries: BalancePoint[] = [];
  const last = Math.max(baseline.length, accelerated.length);
  for (let m = 0; m < last; m++) {
    balanceSeries.push({
      month: m,
      baseline: Math.round(baseline[Math.min(m, baseline.length - 1)] ?? 0),
      accelerated: Math.round(accelerated[Math.min(m, accelerated.length - 1)] ?? 0),
    });
  }

  return {
    aduLoan: Math.round(aduLoan),
    aduLoanPayment: round2(aduLoanPayment),
    gapClosedPct: round2(gapClosedPct),
    karlRent: round2(karlRent),
    karlMonthlyIncome,
    karlRentBurden: Math.round(karlRentBurden * 1000) / 1000,
    karlBurdenBand,
    lindaNetMonthly: round2(lindaNetMonthly),
    extraPaydown: round2(extraPaydown),
    leftForTuition: round2(leftForTuition),
    baselineMonthlyPayment: round2(baselineMonthlyPayment),
    baselinePayoffMonths,
    acceleratedPayoffMonths,
    yearsShaved,
    balanceSeries,
  };
}
