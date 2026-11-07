// Shared motion language. <MotionConfig reducedMotion="user"> (src/main.tsx) turns transform and
// layout animation off for people who ask for reduced motion, leaving opacity fades.
import type { Transition, Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const T_FAST: Transition = { duration: 0.15, ease: EASE };
export const T_BASE: Transition = { duration: 0.5, ease: EASE };

/** Parent that staggers its children 70 ms apart. */
export const stagger = (delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren } },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

/** Wizard step change: cross-fade with a 16px horizontal slide. `custom` = direction (1 or -1). */
export const stepSlide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 16 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: -16 * dir, transition: { duration: 0.2, ease: EASE } }),
};
