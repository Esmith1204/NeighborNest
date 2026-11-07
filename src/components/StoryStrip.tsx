import { useEffect, useRef, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { ApiError, fetchStory } from "../lib/api";
import { NO_FALLBACK_HINT, fallbackStory } from "../lib/fallbacks";
import type { PersonaStory, ScenarioRequest, Story } from "../lib/types";
import { AiNote, Card, ErrorNote, FallbackBadge, SectionTitle } from "./ui";

const DEBOUNCE_MS = 800;

export function StoryStrip({ request }: { request: ScenarioRequest }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [refreshes, setRefreshes] = useState(0);
  const immediate = useRef(false);
  const key = JSON.stringify(request);

  useEffect(() => {
    const ac = new AbortController();
    const delay = immediate.current ? 0 : DEBOUNCE_MS;
    immediate.current = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      const req: ScenarioRequest = JSON.parse(key);
      try {
        const res = await fetchStory(req, ac.signal);
        setStory(res.story);
        setCached(res.cached);
        setIsFallback(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const fallback = fallbackStory(req);
        // Never leave an older story on screen: its numbers would not match the sliders.
        setStory(fallback);
        setIsFallback(fallback !== null);
        if (!fallback) {
          setError(`${err instanceof ApiError ? err.message : "Could not load the story."} ${NO_FALLBACK_HINT}`);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [key, refreshes]);

  return (
    <Card>
      <SectionTitle
        icon={<Users className="h-4 w-4 text-slate-500" aria-hidden />}
        aside={
          <button
            type="button"
            onClick={() => {
              immediate.current = true;
              setRefreshes((n) => n + 1);
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
            Refresh story
          </button>
        }
      >
        Before / After
      </SectionTitle>

      {error && <ErrorNote message={error} />}
      {!story && loading && <p className="text-sm text-slate-500">Drafting the story…</p>}
      {story && (
        <div className={`grid gap-4 md:grid-cols-2 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Persona name="Linda" role="Homeowner" s={story.linda} />
          <Persona name="Karl" role="Tenant" s={story.karl} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {isFallback ? <FallbackBadge /> : story && <AiNote cached={cached} />}
        <p className="text-xs text-slate-500">Linda and Karl are fictional composite personas.</p>
      </div>
    </Card>
  );
}

function Persona({ name, role, s }: { name: string; role: string; s: PersonaStory }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        {name} · {role} (fictional)
      </p>
      <p className="mt-1 font-semibold text-slate-900">{s.headline}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <List title="Before" items={s.before} tone="text-slate-500" />
        <List title="After" items={s.after} tone="text-emerald-700" />
      </div>
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div>
      <p className={`text-xs font-semibold ${tone}`}>{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
