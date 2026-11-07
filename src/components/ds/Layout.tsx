import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "../../lib/motion";

/** 12-column page container: max 1280px, 16px gutters on mobile. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-4 md:px-8 ${className}`}>{children}</div>;
}

/** Small numbered index, as in "(01)". */
export function Index({ n, className = "" }: { n: number | string; className?: string }) {
  const label = typeof n === "number" ? String(n).padStart(2, "0") : n;
  return <span className={`text-sm font-normal tracking-widest text-mute ${className}`}>({label})</span>;
}

/** Hairline-topped page section with an optional numbered eyebrow and headline. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  intro,
  children,
  dark = false,
  className = "",
}: {
  id?: string;
  index?: number;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={`${dark ? "on-dark bg-ink text-white" : ""} scroll-mt-20 py-16 md:py-24 ${className}`}
    >
      <Container>
        {(eyebrow || title) && (
          <motion.header
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className={`mb-10 grid gap-6 border-t pt-6 md:mb-14 md:grid-cols-12 ${dark ? "border-white/60" : "border-ink"}`}
          >
            {eyebrow && (
              <motion.p variants={fadeUp} className={`flex gap-3 text-sm tracking-widest uppercase md:col-span-4 ${dark ? "text-white/80" : "text-mute"}`}>
                {index !== undefined && <span>({String(index).padStart(2, "0")})</span>}
                <span>{eyebrow}</span>
              </motion.p>
            )}
            <div className="md:col-span-8">
              {title && (
                <motion.h2 variants={fadeUp} id={id ? `${id}-title` : undefined} className="text-headline font-light">
                  {title}
                </motion.h2>
              )}
              {intro && (
                <motion.div variants={fadeUp} className={`mt-5 max-w-2xl text-lg ${dark ? "text-white/85" : "text-mute"}`}>
                  {intro}
                </motion.div>
              )}
            </div>
          </motion.header>
        )}
        {children}
      </Container>
    </section>
  );
}

/** Square-cornered surface with a hairline border. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={`border border-ink/15 bg-white p-5 md:p-6 ${className}`}>{children}</Tag>;
}

/** Hairline-separated label/value list. */
export function KeyValue({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline justify-between gap-4 py-2.5 text-[15px]">
          <dt className="text-mute">{it.label}</dt>
          <dd className="text-right font-medium">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
