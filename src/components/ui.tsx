import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ icon, children, aside }: { icon?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        {icon}
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** Small label marking a made-up number, per the event rules. */
export function AssumptionTag() {
  return (
    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800">
      ASSUMPTION
    </span>
  );
}

export function AiNote({ cached }: { cached?: boolean }) {
  return (
    <p className="text-xs text-slate-500">
      Drafted by Claude from the calculator's numbers.{cached ? " (cached)" : ""}
    </p>
  );
}

/** Marks pre-written sample text so it is never mistaken for a live AI draft. */
export function FallbackBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
      Sample output (live AI unavailable)
    </span>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {message}
    </p>
  );
}
