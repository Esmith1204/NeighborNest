import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Database, Info, OctagonAlert, Sparkles } from "lucide-react";

export type Tone = "success" | "caution" | "risk" | "neutral";

const TONES: Record<Tone, { cls: string; Icon: typeof Info }> = {
  success: { cls: "border-success text-success", Icon: CheckCircle2 },
  caution: { cls: "border-caution text-caution-ink", Icon: AlertTriangle },
  risk: { cls: "border-risk text-risk", Icon: OctagonAlert },
  neutral: { cls: "border-ink/40 text-ink", Icon: Info },
};

/** Status is never colour alone: icon + text label, always. */
export function StatusBadge({ tone, children, className = "" }: { tone: Tone; children: ReactNode; className?: string }) {
  const { cls, Icon } = TONES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[13px] font-medium ${cls} ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

/** Small uppercase tag, e.g. ASSUMPTION / SOURCE / SYNTHETIC. */
export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[11px] font-medium tracking-widest uppercase ${
        dark ? "border-white/60 text-white" : "border-ink/40 text-ink"
      }`}
    >
      {children}
    </span>
  );
}

export const AssumptionTag = () => <Tag>Assumption</Tag>;

/** Visible on every page that shows people or parcels. */
export function SyntheticChip({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] ${
        dark ? "border-white/60 text-white" : "border-ink/40 text-ink"
      }`}
    >
      <Database className="h-3.5 w-3.5" aria-hidden />
      Synthetic demo data
    </span>
  );
}

/** Marks text drafted by Claude. */
export function AiNote({ cached, className = "" }: { cached?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-1.5 text-[13px] text-mute ${className}`}>
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      Drafted by Claude from the calculator's numbers.{cached ? " (cached)" : ""}
    </p>
  );
}

/** Marks pre-written sample text so it is never mistaken for a live AI draft. */
export function FallbackBadge() {
  return <StatusBadge tone="neutral">Sample output (live AI unavailable)</StatusBadge>;
}
