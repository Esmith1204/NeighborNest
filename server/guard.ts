import { createHash } from "node:crypto";
import {
  CACHE_MAX_ENTRIES,
  GLOBAL_CLAUDE_CALL_CAP,
  RATE_LIMIT_PER_MINUTE,
} from "./config.js";

// ---- Cache: hash(route + validated inputs) -> result. In memory, oldest evicted first. ----
const cache = new Map<string, unknown>();

export function cacheKey(route: string, payload: unknown): string {
  return createHash("sha256")
    .update(route + "\n" + JSON.stringify(payload))
    .digest("hex");
}

export function cacheGet<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function cacheSet(key: string, value: unknown): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

// ---- Per-IP rate limit (sliding 60s window) and global call cap. ----
const hits = new Map<string, number[]>();
let claudeCalls = 0;

export type GuardResult = { ok: true } | { ok: false; code: "rate_limited" | "cap_reached"; message: string };

/**
 * Call right before a request that will reach Claude (after the cache check, so
 * cache hits cost nothing). Records the call if allowed.
 */
export function reserveClaudeCall(ip: string): GuardResult {
  if (claudeCalls >= GLOBAL_CLAUDE_CALL_CAP) {
    return {
      ok: false,
      code: "cap_reached",
      message: "The live AI demo has reached its usage limit for this session. Showing sample output instead.",
    };
  }

  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    hits.set(ip, recent);
    return {
      ok: false,
      code: "rate_limited",
      message: "Too many requests. Please wait a moment and try again.",
    };
  }

  recent.push(now);
  hits.set(ip, recent);
  claudeCalls++;
  return { ok: true };
}

// Drop idle IPs so the map cannot grow without bound.
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= 60_000)) hits.delete(ip);
  }
}, 60_000).unref();
