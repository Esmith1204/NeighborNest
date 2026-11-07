import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageCircle, Send } from "lucide-react";
import { ApiError, askNavigator } from "../lib/api";
import type { ChatMessage, ScenarioRequest } from "../lib/types";
import { AiNote, Card, ErrorNote, SectionTitle } from "./ui";

const MAX_QUESTION = 300;
const MAX_HISTORY = 4;

export function AskPanel({ request, score }: { request: ScenarioRequest; score: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const chips = [
    `Why is the score ${score}?`,
    "What if Karl's income is lower?",
    "What should Linda confirm with the city?",
  ];

  async function ask(raw: string) {
    const q = raw.trim().slice(0, MAX_QUESTION);
    if (!q || pending) return;
    const history = messages.slice(-MAX_HISTORY);
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setPending(true);
    setError("");
    try {
      const res = await askNavigator(q, request, history);
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not get an answer.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(question);
  }

  return (
    <Card>
      <SectionTitle icon={<MessageCircle className="h-4 w-4 text-slate-500" aria-hidden />}>
        Ask the ADU Navigator
      </SectionTitle>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => ask(c)}
            disabled={pending}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
          >
            {c}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <ol className="mt-4 space-y-3" aria-live="polite">
          {messages.map((m, i) => (
            <li key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              {m.role === "user" ? (
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-800 px-3 py-2 text-sm text-white">{m.content}</p>
              ) : (
                <div className="md max-w-[95%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              )}
            </li>
          ))}
          {pending && <li className="text-sm text-slate-500">Thinking…</li>}
        </ol>
      )}
      {error && (
        <div className="mt-3">
          <ErrorNote message={error} />
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <label htmlFor="ask" className="sr-only">
          Your question
        </label>
        <input
          id="ask"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={MAX_QUESTION}
          placeholder="Ask about this deal…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !question.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden />
          Ask
        </button>
      </form>
      <div className="mt-2 flex flex-wrap justify-between gap-2">
        <AiNote />
        <p className="text-xs text-slate-500">General information, not legal or investment advice.</p>
      </div>
    </Card>
  );
}
