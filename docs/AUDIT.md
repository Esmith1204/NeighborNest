# v2 audit (2026-11-07, before the redesign)

**What exists.** Vite + React 19 + TS + Tailwind 4 + Recharts single page (`src/App.tsx`) built around two
fictional personas. Express server (`server/`) holds the key and serves three Claude routes:
`/api/term-sheet` (SSE stream), `/api/story` (strict tool), `/api/ask` (Navigator). Guards: validation
(`server/validate.ts`), 20 calls/min/IP, 400-call cap, response cache (`server/guard.ts`).

**Reusable as-is.**
- Calculators: `src/lib/finance.ts` (`computeScenario`), `feasibility.ts` (`calculateFeasibility`),
  `rent.ts` (HUD FY2026 studio FMR + ASSUMPTION area bands), `assumptions.ts` (sourced list).
- Server guards, validation, cache, prompts; `src/lib/api.ts` client (incl. SSE reader).
- Fallbacks (`src/data/fallbacks.json`, exact-match on the Linda & Karl inputs only).
- Components to restyle, not rewrite: Sliders, PayoffChart, TermSheet, AskPanel, StoryStrip, AssumptionsPanel.

**Monolith to split.** `App.tsx` mixes persona copy, parcel picker, deal sliders, results, AI panels and
footer on one page; no routing, no roles, no intake. Persona names are baked into types
(`karlMonthlyIncome`), the story schema (`linda`/`karl`) and the UI labels.

**Status (later on 2026-11-07):** bug 1 is fixed: `api/index.ts` + `vercel.json` now serve the API on
Vercel, and the live site answers `/api/health` with AI configured. Bug 2 is fixed by the same rewrite.

**Bugs and risks found.**
1. **Vercel serves no API.** `POST https://neighbornest-nine.vercel.app/api/story` returns Vercel's
   `NOT_FOUND` (checked 2026-11-07). No `vercel.json`, no `api/` function. Live AI never runs in the
   deployed app; only the exact Linda & Karl preset shows (sample) output; the Navigator just errors.
2. Adding client routes without an SPA rewrite would 404 on refresh/deep links on Vercel.
3. `server/parcels.ts` and `server/ai.ts` read files via `import.meta.url`; a serverless bundle may not
   ship them unless listed in `includeFiles`.
4. Rate limit, call cap and cache are in memory: on serverless they are per instance, not global.
5. Two affordability thresholds: the app uses 35% (event brief's "30 to 35 percent"); the v2 spec asks
   for the standard 30% rule. Both must be labelled, not silently swapped.
6. `StoryStrip` re-calls Claude 800 ms after every slider move: an easy way to burn the call cap.
7. The Navigator has no fallback; term sheet/story fallbacks only match one exact input set.

**Proposed structure.**
- `server/app.ts` (Express app, no listen) ← `server/index.ts` (local listen) and `api/index.ts` (Vercel
  function). `vercel.json`: `/api/*` → function, everything else → `index.html`.
- `src/components/ds/` design system (Button, IconButton, Card, StepIndicator, Field, Badge, Accordion,
  MetricCard, Section, Photo). `src/components/layout/` Header, Footer, Layout (page fade).
- `src/pages/` Landing, Start, wizards (`/homeowner`, `/renter`, `/partner`), `results/:role`,
  `/term-sheet`, `/confirmation`, `/how-it-works`, `/sources`, 404; `/legacy` until Phase 3.
- `src/lib/` adds `storage.ts` (try/catch localStorage), `renter.ts`, `homeowner.ts`, `matching.ts`,
  `partner.ts`; `src/data/` adds synthetic homeowners (6) and renters (8).
