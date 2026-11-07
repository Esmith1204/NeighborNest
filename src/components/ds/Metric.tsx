import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

/**
 * A number that counts to its new value over ~600ms when it changes. Screen readers get the final
 * value only (the visible digits are aria-hidden while they tick).
 */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduce || !Number.isFinite(value)) {
      setShown(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <>
      <span aria-hidden>{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}

/** Label, big value, unit, and a short "why it matters" line. */
export function MetricCard({
  label,
  value,
  format,
  unit,
  why,
  sub,
  tone = "default",
  className = "",
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  unit?: string;
  why?: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "risk";
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-[var(--radius-card)] bg-sand p-5 md:p-6 ${className}`}>
      <p className="text-[14px] text-mute">{label}</p>
      <p className={`mt-2 text-4xl font-medium tracking-tight md:text-5xl ${tone === "risk" ? "text-risk" : ""}`} aria-live="polite">
        <CountUp value={value} format={format} />
        {unit && <span className="ml-1 text-lg font-normal text-mute">{unit}</span>}
      </p>
      {sub && <p className="mt-1 text-[14px] text-mute">{sub}</p>}
      {why && <p className="mt-3 text-[14px] leading-snug text-ink/80">{why}</p>}
    </div>
  );
}
