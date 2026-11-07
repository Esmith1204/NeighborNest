// Pre-written sample output, shown only when live AI fails and only for the exact inputs it was
// written for, so it never shows numbers that disagree with the calculator.
import data from "../data/fallbacks.json";
import type { ScenarioRequest, Story } from "./types";

const KEYS: (keyof ScenarioRequest)[] = [
  "parcelId",
  "buildCost",
  "partnerUpfront",
  "monthlyRent",
  "rentToPaydownPct",
  "partnerRentSubsidy",
  "karlMonthlyIncome",
];

function matches(req: ScenarioRequest): boolean {
  const target = data.forInputs as ScenarioRequest;
  return KEYS.every((k) => req[k] === target[k]);
}

export function fallbackStory(req: ScenarioRequest): Story | null {
  return matches(req) ? (data.story as Story) : null;
}

export function fallbackTermSheet(req: ScenarioRequest): string | null {
  return matches(req) ? data.termSheet : null;
}

export const NO_FALLBACK_HINT = "Choose the Linda & Karl preset to see a sample.";
