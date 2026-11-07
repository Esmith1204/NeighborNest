import { INPUT_RANGES, DEFAULT_KARL_INCOME } from "../src/lib/finance";
import type { Parcel } from "../src/lib/feasibility";
import { rentBandFor } from "../src/lib/rent";
import type { ChatMessage } from "../src/lib/types";
import { getParcel } from "./parcels";
import {
  ASK_MAX_HISTORY,
  ASK_MAX_HISTORY_CHARS,
  ASK_MAX_QUESTION_CHARS,
} from "./config";

export interface ValidatedInputs {
  parcel: Parcel;
  buildCost: number;
  partnerUpfront: number;
  monthlyRent: number;
  rentToPaydownPct: number;
  partnerRentSubsidy: number;
  karlMonthlyIncome: number;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readNumber(
  body: Record<string, unknown>,
  key: keyof typeof INPUT_RANGES,
  fallback?: number,
): Result<number> {
  const raw = body[key];
  if (raw === undefined && fallback !== undefined) return { ok: true, value: fallback };
  const { min, max } = INPUT_RANGES[key];
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < min || raw > max) {
    return fail(`"${key}" must be a number between ${min} and ${max}.`);
  }
  return { ok: true, value: raw };
}

/** Validates scenario inputs and resolves the parcel server-side. */
export function validateInputs(body: unknown): Result<ValidatedInputs> {
  if (!isRecord(body)) return fail("Request body must be a JSON object.");

  const id = body.parcelId;
  if (typeof id !== "number" || !Number.isInteger(id)) return fail('"parcelId" must be an integer.');
  const parcel = getParcel(id);
  if (!parcel) return fail('"parcelId" does not match a known parcel.');

  const buildCost = readNumber(body, "buildCost");
  if (!buildCost.ok) return buildCost;
  const partnerUpfront = readNumber(body, "partnerUpfront");
  if (!partnerUpfront.ok) return partnerUpfront;
  const rentToPaydownPct = readNumber(body, "rentToPaydownPct");
  if (!rentToPaydownPct.ok) return rentToPaydownPct;
  const partnerRentSubsidy = readNumber(body, "partnerRentSubsidy");
  if (!partnerRentSubsidy.ok) return partnerRentSubsidy;
  const karlMonthlyIncome = readNumber(body, "karlMonthlyIncome", DEFAULT_KARL_INCOME);
  if (!karlMonthlyIncome.ok) return karlMonthlyIncome;

  if (partnerUpfront.value > buildCost.value) return fail("Partner upfront cannot exceed build cost.");

  // Rent must sit inside this parcel's area band, which the server looks up itself.
  const band = rentBandFor(parcel.city);
  const rent = body.monthlyRent;
  if (typeof rent !== "number" || !Number.isFinite(rent) || rent < band.min || rent > band.max) {
    return fail(`"monthlyRent" must be a number between ${band.min} and ${band.max} for this parcel.`);
  }

  return {
    ok: true,
    value: {
      parcel,
      buildCost: buildCost.value,
      partnerUpfront: partnerUpfront.value,
      monthlyRent: rent,
      rentToPaydownPct: rentToPaydownPct.value,
      partnerRentSubsidy: partnerRentSubsidy.value,
      karlMonthlyIncome: karlMonthlyIncome.value,
    },
  };
}

export interface ValidatedAsk {
  inputs: ValidatedInputs;
  question: string;
  history: ChatMessage[];
}

export function validateAsk(body: unknown): Result<ValidatedAsk> {
  if (!isRecord(body)) return fail("Request body must be a JSON object.");

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question || question.length > ASK_MAX_QUESTION_CHARS) {
    return fail(`"question" must be 1-${ASK_MAX_QUESTION_CHARS} characters.`);
  }

  const inputs = validateInputs(body.scenarioInputs);
  if (!inputs.ok) return inputs;

  const rawHistory = body.history ?? [];
  if (!Array.isArray(rawHistory)) return fail('"history" must be an array.');
  const history: ChatMessage[] = [];
  for (const m of rawHistory.slice(-ASK_MAX_HISTORY)) {
    if (
      !isRecord(m) ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > ASK_MAX_HISTORY_CHARS
    ) {
      return fail('Each "history" item needs a role ("user" or "assistant") and short text content.');
    }
    history.push({ role: m.role, content: m.content });
  }

  return { ok: true, value: { inputs: inputs.value, question, history } };
}
