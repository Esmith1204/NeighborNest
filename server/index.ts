import "dotenv/config"; // loads ANTHROPIC_API_KEY from .env into process.env
import express, { type NextFunction, type Request, type Response } from "express";
import { aiConfigured, answerQuestion, generateStory, streamTermSheet } from "./ai";
import type { Story } from "./ai";
import { PORT } from "./config";
import { cacheGet, cacheKey, cacheSet, reserveClaudeCall } from "./guard";
import { validateAsk, validateInputs, type ValidatedInputs } from "./validate";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

const NOT_CONFIGURED = "Live AI is not configured on this server.";

/** Only ids and numbers, so equal scenarios share one cache entry. */
const canonical = (i: ValidatedInputs) => ({
  parcelId: i.parcel.id,
  buildCost: i.buildCost,
  partnerUpfront: i.partnerUpfront,
  rentToPaydownPct: i.rentToPaydownPct,
  partnerRentSubsidy: i.partnerRentSubsidy,
  karlMonthlyIncome: i.karlMonthlyIncome,
});

/** Maps any failure to a safe message. Never exposes stack traces or key details. */
function friendlyError(err: unknown): { status: number; message: string } {
  const status = (err as { status?: number } | null)?.status;
  console.error(`[ai] request failed: ${(err as Error)?.name ?? "Error"}${status ? ` (${status})` : ""}`);
  if (status === 429 || status === 529) {
    return { status: 503, message: "The AI service is busy right now. Please try again shortly." };
  }
  return { status: 502, message: "The AI service is unavailable right now." };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: aiConfigured() });
});

// ---- Route 1: term sheet, streamed as Server-Sent Events ----
app.post("/api/term-sheet", async (req: Request, res: Response) => {
  const v = validateInputs(req.body);
  if (!v.ok) return void res.status(400).json({ error: v.error });

  const key = cacheKey("term-sheet", canonical(v.value));
  let started = false;
  const send = (event: object) => {
    if (!started) {
      started = true;
      res.writeHead(200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
    }
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const cached = cacheGet<string>(key);
  if (cached !== undefined) {
    send({ type: "text", text: cached });
    send({ type: "done", cached: true });
    return void res.end();
  }

  if (!aiConfigured()) return void res.status(503).json({ error: NOT_CONFIGURED, code: "not_configured" });
  const guard = reserveClaudeCall(req.ip ?? "unknown");
  if (!guard.ok) return void res.status(429).json({ error: guard.message, code: guard.code });

  const abort = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) abort.abort();
  });

  try {
    const full = await streamTermSheet(v.value, (text) => send({ type: "text", text }), abort.signal);
    if (!abort.signal.aborted) {
      cacheSet(key, full);
      send({ type: "done", cached: false });
    }
    res.end();
  } catch (err) {
    if (abort.signal.aborted) return void res.end(); // client went away; nothing to report
    const e = friendlyError(err);
    if (!started) return void res.status(e.status).json({ error: e.message, code: "ai_error" });
    send({ type: "error", message: e.message });
    res.end();
  }
});

// ---- Route 2: story, structured output via forced tool use ----
app.post("/api/story", async (req: Request, res: Response) => {
  const v = validateInputs(req.body);
  if (!v.ok) return void res.status(400).json({ error: v.error });

  const key = cacheKey("story", canonical(v.value));
  const cached = cacheGet<Story>(key);
  if (cached) return void res.json({ story: cached, cached: true });

  if (!aiConfigured()) return void res.status(503).json({ error: NOT_CONFIGURED, code: "not_configured" });
  const guard = reserveClaudeCall(req.ip ?? "unknown");
  if (!guard.ok) return void res.status(429).json({ error: guard.message, code: guard.code });

  try {
    const story = await generateStory(v.value);
    cacheSet(key, story);
    res.json({ story, cached: false });
  } catch (err) {
    const e = friendlyError(err);
    res.status(e.status).json({ error: e.message, code: "ai_error" });
  }
});

// ---- Route 3: Ask the ADU Navigator ----
app.post("/api/ask", async (req: Request, res: Response) => {
  const v = validateAsk(req.body);
  if (!v.ok) return void res.status(400).json({ error: v.error });
  const { inputs, question, history } = v.value;

  const key = cacheKey("ask", { inputs: canonical(inputs), question, history });
  const cached = cacheGet<string>(key);
  if (cached !== undefined) return void res.json({ answer: cached, cached: true });

  if (!aiConfigured()) return void res.status(503).json({ error: NOT_CONFIGURED, code: "not_configured" });
  const guard = reserveClaudeCall(req.ip ?? "unknown");
  if (!guard.ok) return void res.status(429).json({ error: guard.message, code: guard.code });

  try {
    const answer = await answerQuestion(inputs, question, history);
    cacheSet(key, answer);
    res.json({ answer, cached: false });
  } catch (err) {
    const e = friendlyError(err);
    res.status(e.status).json({ error: e.message, code: "ai_error" });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Malformed JSON, oversized bodies, and anything unexpected: friendly JSON, no stack traces.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as { status?: number } | null)?.status;
  if (status === 400 || status === 413) {
    return void res.status(status).json({ error: "Invalid request body." });
  }
  console.error(`[server] unexpected error: ${(err as Error)?.name ?? "Error"}`);
  res.status(500).json({ error: "Something went wrong." });
});

// Bound to localhost only; Vite proxies /api here in dev.
app.listen(PORT, "127.0.0.1", () => {
  console.log(`API server on http://127.0.0.1:${PORT} (AI ${aiConfigured() ? "configured" : "NOT configured"})`);
});
