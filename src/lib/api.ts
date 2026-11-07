// Browser-side calls to our own /api routes. The browser never talks to Claude directly.
import type { ChatMessage, ScenarioRequest, Story } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("Could not reach the server.", "network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? "Something went wrong.", data.code);
  return data as T;
}

export function fetchStory(req: ScenarioRequest, signal?: AbortSignal) {
  return postJson<{ story: Story; cached: boolean }>("/api/story", req, signal);
}

export function askNavigator(
  question: string,
  scenarioInputs: ScenarioRequest,
  history: ChatMessage[],
  signal?: AbortSignal,
) {
  return postJson<{ answer: string; cached: boolean }>(
    "/api/ask",
    { question, scenarioInputs, history },
    signal,
  );
}

/** Reads the term sheet's Server-Sent Events stream, calling onText for each chunk. */
export async function streamTermSheet(
  req: ScenarioRequest,
  onText: (text: string) => void,
  signal: AbortSignal,
): Promise<{ cached: boolean; truncated: boolean }> {
  let res: Response;
  try {
    res = await fetch("/api/term-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("Could not reach the server.", "network");
  }
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.error ?? "Something went wrong.", data.code);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let end: number;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const event = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      for (const line of event.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const msg = JSON.parse(line.slice(6));
        if (msg.type === "text") onText(msg.text);
        else if (msg.type === "done") return { cached: Boolean(msg.cached), truncated: Boolean(msg.truncated) };
        else if (msg.type === "error") throw new ApiError(msg.message, "ai_error");
      }
    }
  }
  throw new ApiError("The term sheet stream ended early.", "ai_error");
}
