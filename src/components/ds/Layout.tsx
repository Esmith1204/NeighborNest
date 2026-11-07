import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { fadeUp, stagger } from "../../lib/motion";

/** Page container: max 1280px, 16px gutters on mobile. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-4 md:px-8 ${className}`}>{children}</div>;
}

/** Small numbered index, as in "01". */
export function Index({ n, className = "" }: { n: number; className?: string }) {
  return <span className={`text-sm text-mute ${className}`}>{String(n).padStart(2, "0")}</span>;
}

/** Pill label that opens every section ("• Who it's for"). */
export function SectionLabel({ icon: Icon, children, dark = false }: { icon?: LucideIcon; children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[14px] font-medium ${
        dark ? "border-white/30 bg-white/10 text-white backdrop-blur-md" : "border-ink/10 bg-white text-ink"
      }`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-caramel" aria-hidden />}
      {children}
    </span>
  );
}

/**
 * One section pattern for the whole app: pill label, headline, intro.
 * `align="center"` stacks them centered; `align="split"` puts the headline left and intro right.
 */
export function Section({
  id,
  label,
  icon,
  title,
  intro,
  children,
  align = "center",
  className = "",
}: {
  id?: string;
  label?: string;
  icon?: LucideIcon;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  align?: "center" | "split";
  className?: string;
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={title ? titleId : undefined} className={`scroll-mt-20 py-16 md:py-24 ${className}`}>
      <Container>
        {(label || title) && (
          <motion.header
            variants={stagger()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className={
              align === "center"
                ? "mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16"
                : "mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-12"
            }
          >
            <div className={align === "split" ? "md:col-span-7" : "flex flex-col items-center"}>
              {label && (
                <motion.div variants={fadeUp}>
                  <SectionLabel icon={icon}>{label}</SectionLabel>
                </motion.div>
              )}
              {title && (
                <motion.h2 variants={fadeUp} id={titleId} className="mt-5 text-headline font-medium">
                  {title}
                </motion.h2>
              )}
            </div>
            {intro && (
              <motion.div
                variants={fadeUp}
                className={`text-[17px] text-mute ${align === "split" ? "md:col-span-4 md:col-start-9" : "mt-4 max-w-xl"}`}
              >
                {intro}
              </motion.div>
            )}
          </motion.header>
        )}
        {children}
      </Container>
    </section>
  );
}

/** Rounded surface. `tone="sand"` for the soft filled cards, `white` for raised ones. */
export function Card({
  children,
  className = "",
  tone = "white",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "sand";
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={`rounded-[var(--radius-card)] p-5 md:p-7 ${tone === "sand" ? "bg-sand" : "border border-ink/8 bg-white"} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** Hairline-separated label/value list. */
export function KeyValue({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-ink/10">
      {items.map((it, i) => (
        <div key={i} className="flex items-baseline justify-between gap-4 py-2.5 text-[15px]">
          <dt className="text-mute">{it.label}</dt>
          <dd className="text-right font-medium">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
