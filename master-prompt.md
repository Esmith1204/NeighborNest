# Co-Equity ADU: Master Prompt for Claude Code

Paste everything below the line into Claude Code in an empty folder.

---

You are building a hackathon demo in about 3 hours. Theme: "more affordable homes in Southern California." Build "Co-Equity ADU": a working app where the Claude API is a core part of the product, not an add-on. Keep it simple, fast, and demo-ready. A polished 60-second demo beats completeness.

## The story (build the UI around it)
Two FICTIONAL composite personas (label them fictional in the UI and README; no real people):
- LINDA, homeowner in Orange County. Her two kids attended private universities and have moved out. She needs money for tuition payments and has a large backyard, but a bank turned down her ADU loan because her cash and income are too tight today.
- KARL, living unhoused. He wants any stable home so he can receive packages and put a real address on job applications. He needs affordable rent.
A COMMUNITY PARTNER (nonprofit / land trust / rental-assistance program) closes the gap with upfront cash and a temporary rent subsidy. Linda gets rent income and faster mortgage paydown; Karl gets an affordable home and an address. Write Karl respectfully, with dignity and no stereotypes.

## Tech stack
- Vite + React + TypeScript + Tailwind + Recharts + lucide-react + react-markdown
- Express server (server/index.ts, run with tsx) holding the API key. Vite proxies /api to it. `concurrently` so `npm run dev` starts both.
- @anthropic-ai/sdk, model "claude-sonnet-5-5" (put it in one constant, MODEL, in server/config.ts).
- Create .gitignore (.env, node_modules, dist) FIRST. Create .env.example with ANTHROPIC_API_KEY=your-key-here. Load the key with dotenv from process.env. NEVER use a VITE_ prefix, never dangerouslyAllowBrowser, never log the key.

## Data (synthetic, labeled)
src/data/parcels.json: 8 SYNTHETIC Orange County parcels with fake plausible addresses, no owner names. Fields: id, address, city, zoning ("R1"|"R2"|"Historic"), lotSqFt, existingHomeSqFt, currentMortgageBalance, currentInterestRate, estimatedAduRent. Parcel #1 = "Linda's home" (lot ~7500, home ~2000, mortgage ~$420k at 4.1%, ADU rent ~$2,000). Mix high and low scores. UI footer: "Synthetic demo data."

## Deterministic calculators (the numbers must NEVER come from the AI)
src/lib/feasibility.ts: calculateFeasibility(parcel) -> { score 0-100, breakdown, label }
- Yard space (lot - home): >1200 = 50 pts, 800-1200 = 30, <800 = 0
- Zoning: R1/R2 = 30, Historic = 10
- Rent coverage (estimatedAduRent*12 / $250k midpoint cost, scaled): up to 20
- Labels: >=75 "Eligible for Fast-Track Co-Financing", 50-74 "Possible with conditions", <50 "Not feasible yet"
- Footnote: "Simplified demo scoring; real eligibility depends on local rules and permits."

src/lib/finance.ts (pure functions): inputs parcel, buildCost (150k-350k), partnerUpfront (0-100k), monthlyRent, rentToPaydownPct (0-100%), partnerRentSubsidy (0-1000/mo), karlMonthlyIncome (default 1,800).
- ADU loan = max(0, buildCost - partnerUpfront), 7% interest, 20-yr amortization -> aduLoanPayment
- gapClosedPct = partnerUpfront / buildCost
- karlRent = monthlyRent - partnerRentSubsidy; karlRentBurden = karlRent / karlMonthlyIncome (green <=30%, yellow 30-50%, red >50%)
- lindaNetMonthly = monthlyRent - aduLoanPayment (the subsidy is paid to Linda on Karl's behalf, so total rent received is monthlyRent)
- extraPaydown = max(0, lindaNetMonthly) * rentToPaydownPct
- Baseline vs accelerated mortgage payoff on parcel balance and rate, 25 remaining years, with extraPaydown added -> yearsShaved and monthly balance series
- leftForTuition = max(0, lindaNetMonthly) - extraPaydown
Export one `computeScenario(inputs)` that returns every number above in a single object called `scenario`. Show assumptions in a collapsible "Assumptions" panel.

## CLAUDE API INTEGRATION (core of the project)
All Claude calls live in server/ai.ts. The browser only talks to our /api routes.

Shared rules for every route:
- Validate the request body: numeric fields must be finite and within slider ranges; parcel id must exist in parcels.json (look the parcel up server-side, do not trust client-sent parcel data). Reject anything else with 400.
- Recompute the scenario on the server by calling computeScenario() from the validated inputs (share src/lib code with the server). Send Claude ONLY these server-computed numbers.
- max_tokens caps: term sheet 900, story 600, ask 500.
- In-memory rate limit: 20 requests/minute per IP, and a global hard cap of 400 Claude calls per server run (return a friendly 429 after that) to protect the API credits.
- In-memory cache keyed by hash of (route + validated inputs) so repeated demo clicks are instant and free.
- Friendly error JSON on any failure; never return stack traces or key details.
- Every system prompt includes: "Use ONLY the numbers provided. Do not invent figures, lender names, laws, or fees. If something is not in the provided data or rules file, say it must be confirmed with the city or a lender."

### Route 1: POST /api/term-sheet (streaming)
Use Server-Sent Events (or a chunked text response) with the SDK's streaming API (client.messages.stream) so text appears live. The frontend reads the stream with fetch + ReadableStream and renders markdown progressively with react-markdown.
System prompt: "You are a housing finance analyst writing an illustrative, non-binding term sheet for a cooperative ADU financing proposal between a homeowner, a tenant, and a community partner. Output concise markdown (under ~500 words) with: 1. Property Feasibility Summary, 2. Capital Stack and Gap Closure, 3. Monthly Cash Flow Split (homeowner / tenant / partner), 4. Partner Contribution and Subsidy Schedule, 5. Risks and Assumptions. End with: 'Illustrative only. Not financial or legal advice.'"

### Route 2: POST /api/story (structured output via tool use)
Force structured JSON with a tool: define tool "write_story" with an input_schema { linda: { before: string[], after: string[], headline: string }, karl: { before: string[], after: string[], headline: string } } (2-3 short bullets each) and set tool_choice { type: "tool", name: "write_story" }. Parse the tool_use input and return it. The UI renders it in the Before / After strip, and it refreshes (debounced 800ms, plus an explicit "Refresh story" button) when sliders change.
System prompt: "You write warm, plain-language, respectful before/after summaries for two fictional composite people, Linda (homeowner whose kids have left for private universities; she needs tuition money) and Karl (formerly unhoused; wants a stable home and an address for jobs and deliveries). Use only the provided numbers. Do not use pity language or stereotypes about Karl. Keep each bullet under 18 words."

### Route 3: POST /api/ask ("Ask the ADU Navigator")
A small chat panel under the calculator. Body: { question: string (max 300 chars), scenarioInputs, history (last 4 messages max) }. System prompt includes the current scenario numbers AND the contents of server/adu-rules.md (create this file: a short, SIMPLIFIED placeholder summary of general California ADU points, headed "Simplified placeholder for demo. Not legal advice. Verify with your city planning department and HCD." Include only these generally stated ideas: state law requires cities to allow ADUs on most residential lots; ADUs generally can be assigned their own address; fees and setbacks vary by city; permits are required; financing options vary by lender). Instruct: "Answer in under 120 words. Ground answers in the scenario numbers and the rules file. If asked about anything else, say what to confirm and with whom (city planning, a lender, or a housing counselor). Never give personalized legal or investment advice."
Show 3 suggested question chips: "Why is the score 88?", "What if Karl's income is lower?", "What should Linda confirm with the city?"

### Fallbacks (demo safety)
Create src/data/fallbacks.json holding a pre-written term sheet and story for the default preset ("Linda & Karl"). If a Claude call fails or the cap is hit, the UI shows the fallback with a small badge "Sample output (live AI unavailable)". Never present fallback text as live.

### AI transparency
Show a small "Drafted by Claude from the calculator's numbers" note on AI outputs and a "Numbers come from the calculator, not the AI" note beside the metric cards.

## UI
Single page, split screen, clean and friendly, mobile-OK.
Header: "Co-Equity ADU", tagline "Closing the gap so more people can have a home." Two preset buttons: "Linda & Karl" (default; parcel #1, buildCost 220k, partnerUpfront 60k, rentToPaydownPct 60%, subsidy 300/mo) and "Cash-strapped senior + Community Land Trust". Presets set every slider; nothing is typed live.
Left: parcel dropdown, large color Feasibility badge with score breakdown and lot stats.
Right: sliders (build cost, partner upfront, rent-to-paydown %, rent subsidy), Recharts line chart (baseline vs accelerated payoff), metric cards: Gap Closed, Years Shaved Off Mortgage, Linda's Net Monthly Income, Left for Tuition Bills, Karl's Rent (X% of income, color-coded).
Below: AI-generated Before / After strip (Route 2), then the "Generate Co-Financing Term Sheet" button (Route 1, streaming into a printable panel with a Print / Save as PDF button using window.print() and Tailwind print: classes so only the term sheet prints), then the Ask the ADU Navigator panel (Route 3).
Footer: synthetic data note, fictional personas note, "Confirm ADU rules with your city," no scraping, no private plans.

## README.md (judges read this; write it well)
Sections: the problem (1 paragraph); personas and their before/after; what the app does (screenshot placeholder docs/screenshot.png); HOW CLAUDE IS USED (a short table: term sheet streaming, structured story via tool use, grounded Q&A, server-side key and guardrails, and that the app was built with Claude Code); how to run (npm install, cp .env.example .env, add ANTHROPIC_API_KEY, npm run dev, open http://localhost:5173); data notes (synthetic, public-data-only policy); responsible use (no real people, no scraping, no private plans, numbers deterministic, AI outputs illustrative); limitations and next steps (county GIS data, lender partners, more cities).

## Process
1. Scaffold, .gitignore, .env.example first; `git init`; never commit .env.
2. Build calculators, then server/ai.ts routes, then UI, then fallbacks.
3. Test each route with curl or the UI using the default preset; confirm streaming works and the cache returns instantly on repeat.
4. Run `npm run build` and fix errors.
5. Give me the exact commands to run it and list anything skipped.
Do not add features beyond this spec.
