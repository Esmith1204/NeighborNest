import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../../lib/motion";

const two = (n: number) => String(n).padStart(2, "0");

/** "01 / 05" progress index plus the list of step names, like a numbered table of contents. */
export function StepIndicator({
  current,
  steps,
  onJump,
}: {
  /** 0-based */
  current: number;
  steps: string[];
  /** Lets people go back to a finished step. */
  onJump?: (index: number) => void;
}) {
  const total = steps.length;
  return (
    <nav aria-label="Progress" className="border-b border-ink pb-5">
      <div className="flex items-end justify-between gap-6">
        <p className="flex items-baseline gap-2 text-5xl font-light md:text-6xl" aria-hidden>
          <span className="relative inline-block overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current}
                className="inline-block"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {two(current + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-2xl text-mist">/ {two(total)}</span>
        </p>
        <p className="sr-only" aria-live="polite">
          Step {current + 1} of {total}: {steps[current]}
        </p>
        <p className="hidden text-right text-sm tracking-widest text-mute uppercase sm:block" aria-hidden>
          {steps[current]}
        </p>
      </div>
      <div className="mt-4 h-px w-full bg-ink/15" aria-hidden>
        <motion.div
          className="h-px bg-ink"
          initial={false}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
      <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
        {steps.map((s, i) => {
          const done = i < current;
          const label = (
            <>
              <span className="text-mute">{two(i + 1)}</span> {s}
            </>
          );
          return (
            <li key={s} aria-current={i === current ? "step" : undefined}>
              {done && onJump ? (
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className="min-h-11 underline decoration-ink/30 underline-offset-4 hover:decoration-ink sm:min-h-0"
                >
                  {label}
                  <span className="sr-only"> (completed, go back)</span>
                </button>
              ) : (
                <span className={i === current ? "font-medium" : "text-mute"}>{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
