import { ChevronDown } from "lucide-react";
import { ASSUMPTIONS, type AssumptionKind } from "../lib/assumptions";

const KIND_STYLES: Record<AssumptionKind, string> = {
  SOURCE: "bg-sky-100 text-sky-800",
  ASSUMPTION: "bg-amber-100 text-amber-800",
  SYNTHETIC: "bg-slate-200 text-slate-700",
};

export function AssumptionsPanel() {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-base font-semibold text-slate-900 sm:px-5">
        Assumptions and sources
        <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" aria-hidden />
      </summary>
      <ul className="divide-y divide-slate-100 border-t border-slate-100 px-4 sm:px-5">
        {ASSUMPTIONS.map((a) => (
          <li key={a.item} className="py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${KIND_STYLES[a.kind]}`}>
                {a.kind}
              </span>
              <span className="font-medium text-slate-900">{a.item}</span>
              <span className="text-slate-600">{a.value}</span>
            </div>
            <p className="mt-1 text-slate-600">{a.basis}</p>
            {(a.url || a.checked) && (
              <p className="mt-1 text-xs text-slate-500">
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer" className="break-all underline decoration-slate-300 hover:text-slate-700">
                    {a.url}
                  </a>
                )}
                {a.checked && <> · checked {a.checked}</>}
              </p>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
