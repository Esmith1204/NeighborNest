// Single place for the model name and the server's guardrail limits.
export const MODEL = "claude-sonnet-5-5";

export const PORT = 3001;

export const MAX_TOKENS = {
  termSheet: 900,
  story: 600,
  ask: 500,
} as const;

/** Per-IP requests that actually reach Claude (cache hits are free and not counted). */
export const RATE_LIMIT_PER_MINUTE = 20;
/** Hard cap on Claude calls per server run, to protect API credits. */
export const GLOBAL_CLAUDE_CALL_CAP = 400;

export const CACHE_MAX_ENTRIES = 500;

export const ASK_MAX_QUESTION_CHARS = 300;
export const ASK_MAX_HISTORY = 4;
export const ASK_MAX_HISTORY_CHARS = 1_500;
