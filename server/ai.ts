// All Claude calls live here. The browser only talks to our /api routes (server/index.ts).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { calculateFeasibility } from "../src/lib/feasibility";
import {
  ADU_LOAN_RATE_PCT,
  ADU_LOAN_YEARS,
  MORTGAGE_REMAINING_YEARS,
  computeScenario,
} from "../src/lib/finance";
import { MAX_TOKENS, MODEL } from "./config";
import type { ChatMessage, ValidatedInputs } from "./validate";

const aduRules = readFileSync(fileURLToPath(new URL("./adu-rules.md", import.meta.url)), "utf8");

export const aiConfigured = (): boolean => Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | undefined;
function getClient(): Anthropic {
  // The SDK reads ANTHROPIC_API_KEY from process.env (loaded by dotenv in index.ts).
  client ??= new Anthropic();
  return client;
}

const NO_INVENTING =
  "Use ONLY the numbers provided. Do not invent figures, lender names, laws, or fees. " +
  "If something is not in the provided data or rules file, say it must be confirmed with the city or a lender.";

/** Recompute everything server-side; these are the ONLY numbers Claude ever sees. */
function scenarioContext(inputs: ValidatedInputs) {
  const { parcel } = inputs;
  const feasibility = calculateFeasibility(parcel);
  const s = computeScenario({
    parcel,
    buildCost: inputs.buildCost,
    partnerUpfront: inputs.partnerUpfront,
    monthlyRent: parcel.estimatedAduRent,
    rentToPaydownPct: inputs.rentToPaydownPct,
    partnerRentSubsidy: inputs.partnerRentSubsidy,
    karlMonthlyIncome: inputs.karlMonthlyIncome,
  });

  return {
    parcel: {
      address: parcel.address,
      city: parcel.city,
      zoning: parcel.zoning,
      lotSqFt: parcel.lotSqFt,
      existingHomeSqFt: parcel.existingHomeSqFt,
      yardSqFt: feasibility.breakdown.yardSqFt,
      currentMortgageBalanceUsd: parcel.currentMortgageBalance,
      currentMortgageInterestRatePercent: parcel.currentInterestRate,
    },
    feasibility: {
      score: feasibility.score,
      label: feasibility.label,
      yardPoints: feasibility.breakdown.yardPoints,
      zoningPoints: feasibility.breakdown.zoningPoints,
      rentPoints: feasibility.breakdown.rentPoints,
    },
    inputs: {
      buildCostUsd: inputs.buildCost,
      partnerUpfrontUsd: inputs.partnerUpfront,
      monthlyAduRentUsd: parcel.estimatedAduRent,
      shareOfNetRentToMortgagePaydownPercent: inputs.rentToPaydownPct,
      partnerMonthlyRentSubsidyUsd: inputs.partnerRentSubsidy,
      karlMonthlyIncomeUsd: s.karlMonthlyIncome,
    },
    results: {
      aduLoanAmountUsd: s.aduLoan,
      aduLoanMonthlyPaymentUsd: s.aduLoanPayment,
      gapClosedByPartnerPercent: s.gapClosedPct,
      karlMonthlyRentAfterSubsidyUsd: s.karlRent,
      karlRentPercentOfIncome: Math.round(s.karlRentBurden * 1000) / 10,
      karlRentBurdenBand: s.karlBurdenBand,
      lindaNetMonthlyIncomeUsd: s.lindaNetMonthly,
      extraMortgagePaydownPerMonthUsd: s.extraPaydown,
      leftForTuitionPerMonthUsd: s.leftForTuition,
      mortgageYearsShavedOff: s.yearsShaved,
    },
    assumptions: {
      aduLoanInterestRatePercent: ADU_LOAN_RATE_PCT,
      aduLoanTermYears: ADU_LOAN_YEARS,
      mortgageRemainingYears: MORTGAGE_REMAINING_YEARS,
      note: "The partner's rent subsidy is paid to the homeowner on the tenant's behalf, so total rent received equals monthlyAduRentUsd.",
    },
  };
}

// ---------- Route 1: term sheet (streaming) ----------

const TERM_SHEET_SYSTEM =
  "You are a housing finance analyst writing an illustrative, non-binding term sheet for a cooperative ADU financing proposal " +
  "between a homeowner, a tenant, and a community partner. Output concise markdown (under ~500 words) with: " +
  "1. Property Feasibility Summary, 2. Capital Stack and Gap Closure, 3. Monthly Cash Flow Split (homeowner / tenant / partner), " +
  "4. Partner Contribution and Subsidy Schedule, 5. Risks and Assumptions. " +
  "End with: 'Illustrative only. Not financial or legal advice.' " +
  NO_INVENTING;

/** Streams the term sheet; calls onText for each chunk and resolves with the full text. */
export async function streamTermSheet(
  inputs: ValidatedInputs,
  onText: (chunk: string) => void,
  signal: AbortSignal,
): Promise<string> {
  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS.termSheet,
    system: TERM_SHEET_SYSTEM,
    messages: [
      {
        role: "user",
        content:
          "Write the term sheet from these calculator results (JSON):\n" +
          JSON.stringify(scenarioContext(inputs), null, 2),
      },
    ],
  });

  const abort = () => stream.abort();
  if (signal.aborted) abort();
  signal.addEventListener("abort", abort, { once: true });

  let full = "";
  stream.on("text", (chunk) => {
    full += chunk;
    onText(chunk);
  });

  try {
    await stream.finalMessage();
  } finally {
    signal.removeEventListener("abort", abort);
  }
  return full;
}

// ---------- Route 2: story (structured output via forced tool use) ----------

export interface PersonaStory {
  headline: string;
  before: string[];
  after: string[];
}
export interface Story {
  linda: PersonaStory;
  karl: PersonaStory;
}

const STORY_SYSTEM =
  "You write warm, plain-language, respectful before/after summaries for two fictional composite people, " +
  "Linda (homeowner whose kids have left for private universities; she needs tuition money) and " +
  "Karl (formerly unhoused; wants a stable home and an address for jobs and deliveries). " +
  "Use only the provided numbers. Do not use pity language or stereotypes about Karl. Keep each bullet under 18 words. " +
  NO_INVENTING;

const personaSchema = {
  type: "object",
  properties: {
    headline: { type: "string", description: "One short headline." },
    before: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
    after: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
  },
  required: ["headline", "before", "after"],
} as const;

const WRITE_STORY_TOOL: Anthropic.Tool = {
  name: "write_story",
  description: "Record the before/after story for Linda and Karl.",
  input_schema: {
    type: "object",
    properties: { linda: personaSchema, karl: personaSchema },
    required: ["linda", "karl"],
  },
};

function cleanPersona(v: unknown): PersonaStory | undefined {
  if (typeof v !== "object" || v === null) return undefined;
  const p = v as Record<string, unknown>;
  const list = (x: unknown) =>
    Array.isArray(x) && x.length > 0 && x.every((s) => typeof s === "string")
      ? (x as string[]).slice(0, 3)
      : undefined;
  const before = list(p.before);
  const after = list(p.after);
  if (typeof p.headline !== "string" || !before || !after) return undefined;
  return { headline: p.headline, before, after };
}

export async function generateStory(inputs: ValidatedInputs): Promise<Story> {
  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS.story,
    system: STORY_SYSTEM,
    tools: [WRITE_STORY_TOOL],
    tool_choice: { type: "tool", name: "write_story" },
    messages: [
      {
        role: "user",
        content:
          "Write the before/after story from these calculator results (JSON):\n" +
          JSON.stringify(scenarioContext(inputs), null, 2),
      },
    ],
  });

  const block = msg.content.find((b) => b.type === "tool_use");
  const input = block && block.type === "tool_use" ? (block.input as Record<string, unknown>) : undefined;
  const linda = cleanPersona(input?.linda);
  const karl = cleanPersona(input?.karl);
  if (!linda || !karl) throw new Error("Story response was not in the expected shape.");
  return { linda, karl };
}

// ---------- Route 3: Ask the ADU Navigator ----------

function askSystem(inputs: ValidatedInputs): string {
  return [
    "You are the ADU Navigator, a friendly guide inside a demo app about cooperative ADU financing in Southern California.",
    "Answer in under 120 words. Ground answers in the scenario numbers and the rules file below. " +
      "If asked about anything else, say what to confirm and with whom (city planning, a lender, or a housing counselor). " +
      "Never give personalized legal or investment advice.",
    NO_INVENTING,
    "Current scenario numbers (JSON, computed by the app's calculator):",
    JSON.stringify(scenarioContext(inputs), null, 2),
    "Rules file:",
    aduRules,
  ].join("\n\n");
}

export async function answerQuestion(
  inputs: ValidatedInputs,
  question: string,
  history: ChatMessage[],
): Promise<string> {
  // The API needs the conversation to start with a user turn.
  const prior = [...history];
  while (prior.length > 0 && prior[0].role !== "user") prior.shift();

  const msg = await getClient().messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS.ask,
    system: askSystem(inputs),
    messages: [...prior, { role: "user", content: question }],
  });

  const text = msg.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  if (!text) throw new Error("Empty answer.");
  return text;
}
