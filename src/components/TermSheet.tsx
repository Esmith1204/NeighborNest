import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Printer } from "lucide-react";
import { ApiError, streamTermSheet } from "../lib/api";
import { NO_FALLBACK_HINT, fallbackTermSheet } from "../lib/fallbacks";
import type { ScenarioRequest } from "../lib/types";
import { AiNote, Card, ErrorNote, FallbackBadge, SectionTitle } from "./ui";

type Status = "idle" | "streaming" | "done" | "error";

export function TermSheet({ request }: { request: ScenarioRequest }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [draftedFor, setDraftedFor] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const key = JSON.stringify(request);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function generate() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setText("");
    setError("");
    setTruncated(false);
    setIsFallback(false);
    setStatus("streaming");
    setDraftedFor(key);
    try {
      const res = await streamTermSheet(request, (chunk) => setText((t) => t + chunk), ac.signal);
      setCached(res.cached);
      setTruncated(res.truncated);
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // Replaces any partial live text, so the two are never mixed.
      const fallback = fallbackTermSheet(request);
      if (fallback) {
        setText(fallback);
        setIsFallback(true);
        setStatus("done");
        return;
      }
      setText("");
      setError(`${err instanceof ApiError ? err.message : "Could not draft the term sheet."} ${NO_FALLBACK_HINT}`);
      setStatus("error");
    }
  }

  const stale = text !== "" && draftedFor !== key;

  return (
    <Card className="print:border-0 print:p-0 print:shadow-none">
      <SectionTitle
        icon={<FileText className="h-4 w-4 text-slate-500 print:hidden" aria-hidden />}
        aside={
          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              onClick={generate}
              disabled={status === "streaming"}
              className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {status === "streaming" ? "Drafting…" : "Generate Co-Financing Term Sheet"}
            </button>
            {status === "done" && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" aria-hidden />
                Print / Save as PDF
              </button>
            )}
          </div>
        }
      >
        Co-financing term sheet
      </SectionTitle>

      {error && <ErrorNote message={error} />}
      {stale && status !== "streaming" && (
        <p className="mb-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 print:hidden">
          The deal changed since this was drafted. Generate again to update it.
        </p>
      )}
      {text ? (
        <article className="md" aria-live="polite" aria-busy={status === "streaming"}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </article>
      ) : (
        status === "idle" && (
          <p className="text-sm text-slate-500 print:hidden">
            Claude drafts an illustrative, non-binding term sheet from the calculator's numbers.
          </p>
        )
      )}
      {truncated && (
        <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 print:hidden">
          This draft hit its length limit and was cut off. Generate again for a complete version.
        </p>
      )}
      {text && (
        <div className="mt-3 space-y-1 border-t border-slate-100 pt-2">
          {isFallback ? <FallbackBadge /> : <AiNote cached={cached} />}
          <p className="text-xs text-slate-500">
            Prototype. Synthetic data and fictional personas. Not legal, financial or lending advice; confirm with a
            lender, the city and a housing counselor.
          </p>
        </div>
      )}
    </Card>
  );
}
