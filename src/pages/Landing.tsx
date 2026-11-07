import { useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, BarChart3, HelpCircle, Home, Layers, Users } from "lucide-react";
import { ArrowDot, ButtonLink } from "../components/ds/Button";
import { Tag } from "../components/ds/Badge";
import { Accordion } from "../components/ds/Accordion";
import { Container, Section, SectionLabel } from "../components/ds/Layout";
import { Photo } from "../components/ds/Photo";
import { EASE, fadeUp, stagger } from "../lib/motion";
import { AFFORDABLE_RENT_SHARE } from "../lib/finance";
import { MARKET_RENT_REFERENCE } from "../lib/rent";
import { ROLE_META, ROLES } from "../lib/roles";
import { usd } from "../lib/format";
import type { ImageKey } from "../lib/images";
import parcels from "../data/parcels.json";
import { EXAMPLES } from "../lib/examples";

export default function Landing() {
  return (
    <>
      <Hero />
      <Statement />
      <Numbers />
      <Roles />
      <Approach />
      <WhoFirst />
      <Examples />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ---------- Hero: real photo, flat dark overlay (white text stays >= 4.5:1), giant wordmark ---------- */

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative -mt-[72px] overflow-hidden bg-cocoa text-white">
      <Photo name="hero" decorative className="absolute inset-0" />
      <div className="absolute inset-0 bg-cocoa/60" aria-hidden />

      <Container className="relative flex min-h-[600px] flex-col pt-[104px] pb-12 md:h-[92svh] md:max-h-[880px] md:pb-16">
        <motion.p
          aria-hidden
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="text-center text-[15.5vw] leading-[0.85] font-medium tracking-[-0.07em] text-white/80 xl:text-[198px]"
        >
          NeighborNest
        </motion.p>

        <motion.div variants={stagger(0.25)} initial="hidden" animate="show" className="mt-auto max-w-2xl pt-10">
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel dark>Backyard homes · Orange County, CA</SectionLabel>
          </motion.div>
          <motion.h1 variants={fadeUp} id="hero-title" className="text-headline font-medium">
            One backyard.
            <br />
            Two households.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-lg text-[18px] text-white">
            NeighborNest helps a homeowner, a neighbor who needs a home and a community partner plan a backyard home
            together, with every number in plain language.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
            <ButtonLink to="/dashboard" variant="inverse">
              Open the dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink to="/#how" variant="glass">
              How it works
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ---------- What we do: words fill in from light to dark as you scroll ---------- */

const STATEMENT =
  "We help a homeowner, a neighbor who needs a home and a community partner build one backyard home together, with numbers everyone can read and check.";

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="what" aria-labelledby="what-title" className="scroll-mt-20 py-20 md:py-28">
      <Container className="flex flex-col items-center text-center">
        <SectionLabel>What we do</SectionLabel>
        <h2 id="what-title" className="sr-only">
          What NeighborNest does
        </h2>
        <p ref={ref} className="mt-8 max-w-4xl text-[clamp(1.75rem,3.6vw,3.1rem)] leading-[1.12] font-medium tracking-[-0.035em]">
          {words.map((w, i) =>
            reduce ? (
              <span key={i}>{w} </span>
            ) : (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </Word>
            ),
          )}
        </p>
      </Container>
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
}

/* ---------- Numbers: flat sand cards, every figure labelled with where it came from ---------- */

function Numbers() {
  const stats = [
    {
      value: usd(MARKET_RENT_REFERENCE.monthly),
      label: "HUD Fair Market Rent for a studio, Orange County, FY2026",
      tag: (
        <a href={MARKET_RENT_REFERENCE.url} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
          Source: HUD
        </a>
      ),
    },
    {
      value: `${Math.round(AFFORDABLE_RENT_SHARE * 100)}%`,
      label: "Rent target: the most of a renter's income we aim for",
      tag: <Tag>Assumption</Tag>,
    },
    { value: String(parcels.length), label: "Sample parcels in Orange County cities", tag: <Tag>Demo data</Tag> },
    { value: "3", label: "Households one plan serves", tag: <Tag>Homeowner · renter · partner</Tag> },
  ];
  return (
    <Section id="numbers" label="The numbers we start from" icon={BarChart3} className="pt-0 md:pt-0">
      <motion.dl
        variants={stagger()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="flex flex-col items-center rounded-[var(--radius-card)] bg-sand px-5 py-8 text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd className="contents">
              <span className="text-5xl font-medium tracking-[-0.04em] md:text-6xl">{s.value}</span>
              <span className="mt-3 text-[15px] text-ink">{s.label}</span>
              <span className="mt-4 text-[13px]">{s.tag}</span>
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </Section>
  );
}

/* ---------- Who it's for: photo cards with a solid info panel ---------- */

function Roles() {
  return (
    <Section
      id="roles"
      label="Who it's for"
      icon={Users}
      align="split"
      title={
        <>
          Three people,
          <br />
          one shared plan
        </>
      }
      intro="Each person sees the same numbers from their side: what it costs, what it pays and what it asks of them."
    >
      <motion.ul
        variants={stagger()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 md:grid-cols-3"
      >
        {ROLES.map((r, i) => {
          const m = ROLE_META[r];
          return (
            <motion.li key={r} variants={fadeUp} className="overflow-hidden rounded-[var(--radius-media)] bg-sand">
              <Photo name={m.image} decorative className="aspect-[4/3] w-full" />
              <div className="p-5 md:p-6">
                <p className="flex items-center justify-between text-[14px] text-mute">
                  <span>For {m.short.toLowerCase()}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight">{m.choice}</h3>
                <p className="mt-2 text-[15px] text-ink">{m.blurb}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </Section>
  );
}

/* ---------- How it works: numbered list on the left, photo on the right ---------- */

const STEPS: { title: string; body: string; image: ImageKey }[] = [
  {
    title: "A homeowner has room",
    body: "A backyard big enough for a small second home, but not the cash or a loan to build it alone.",
    image: "cottage",
  },
  {
    title: "A partner closes the gap",
    body: "A land trust or nonprofit puts in upfront cash and a monthly rent subsidy, so the loan gets smaller.",
    image: "partner",
  },
  {
    title: "A neighbor moves in",
    body: "Someone who needs a stable home rents it below market. Their rent pays the loan, then the mortgage down faster.",
    image: "renter",
  },
];

function Approach() {
  const [active, setActive] = useState(0);
  return (
    <Section
      id="how"
      label="How it works"
      icon={Layers}
      title="One backyard, two households"
      intro="The numbers have to close for everyone. The calculator checks that they do, and shows where they don't."
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <ol className="space-y-2">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`step-body-${i}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`w-full rounded-[var(--radius-card)] px-5 py-5 text-left transition-colors duration-300 md:px-7 md:py-6 ${
                    on ? "bg-sand" : "hover:bg-sand/60"
                  }`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className={`text-[clamp(1.6rem,3vw,2.5rem)] leading-tight font-medium tracking-[-0.035em] ${on ? "text-ink" : "text-mute"}`}>
                      {s.title}
                    </span>
                    <span className="pt-2 text-[14px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        id={`step-body-${i}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="block overflow-hidden"
                      >
                        <span className="block max-w-md pt-3 text-[16px] text-ink">{s.body}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="relative min-h-72 overflow-hidden rounded-[var(--radius-media)] bg-sand-strong">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0"
            >
              <Photo name={STEPS[active].image} decorative className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Who it's for first: one flat block, no filler ---------- */

function WhoFirst() {
  return (
    <section aria-labelledby="who-first-title" className="pb-16 md:pb-24">
      <Container>
        <div className="on-dark grid gap-6 rounded-[var(--radius-media)] bg-brown p-6 text-white md:grid-cols-12 md:items-end md:p-10">
          <div className="md:col-span-9">
            <SectionLabel dark>Who it's for first</SectionLabel>
            <h2 id="who-first-title" className="mt-4 text-[clamp(1.5rem,2.8vw,2.4rem)] leading-tight font-medium tracking-[-0.03em]">
              A land trust or nonprofit housing program that hands a homeowner and a renter one shared,
              plain-language term sheet.
            </h2>
          </div>
          <div className="md:col-span-3 md:justify-self-end">
            <ButtonLink to="/dashboard" variant="inverse">
              Try the dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- Examples: compact flat cards ---------- */

function Examples() {
  return (
    <Section
      id="examples"
      label="Situation examples"
      icon={Home}
      align="split"
      title="Start from an example"
      intro="Fictional composites, made up for the demo. Each opens the dashboard with its numbers filled in."
      className="pt-0 md:pt-0"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {EXAMPLES.map((ex, i) => (
          <Link
            key={ex.id}
            to={ex.to}
            className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] bg-sand p-5 transition-colors duration-200 hover:bg-sand-strong md:p-6"
          >
            <span>
              <span className="flex flex-wrap gap-2">
                <Tag>Example {String(i + 1).padStart(2, "0")}</Tag>
                <Tag>Fictional</Tag>
              </span>
              <span className="mt-2 block text-2xl font-medium tracking-tight">{ex.title}</span>
              <span className="mt-1 block text-[15px] text-ink">{ex.summary}</span>
            </span>
            <ArrowDot dark>
              <ArrowUpRight className="h-4 w-4" />
            </ArrowDot>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ---------- FAQ: the limits, up front ---------- */

function Faq() {
  return (
    <Section
      id="faq"
      label="FAQ"
      icon={HelpCircle}
      title="Questions worth asking"
      intro="What this prototype is, what it is not, and how to check it."
      className="pt-0 md:pt-0"
    >
      <div className="mx-auto max-w-4xl space-y-3">
        <Accordion title="Is this real data?" defaultOpen>
          No. Every parcel, person and partner is synthetic: made up for the demo, with real city names only. The
          one market figure, the {usd(MARKET_RENT_REFERENCE.monthly)} studio rent, is real: HUD's FY2026 Fair Market
          Rent for Orange County. HUD has also published FY2027 figures, which we have not been able to read, so this
          one may be out of date.
        </Accordion>
        <Accordion title="Does the AI do the math?">
          No. A calculator written in code works out every number, the same way every time. Claude only writes the
          words (a term sheet, a short story, answers to questions) from those numbers, and each AI-written part is
          labelled.
        </Accordion>
        <Accordion title="Where do the numbers come from?">
          Each rate, rule and dataset links to its source with the date we checked it, in the{" "}
          <Link to="/dashboard#sources" className="font-medium underline underline-offset-4">
            Assumptions and sources
          </Link>{" "}
          panel on the dashboard. Numbers we had to assume are marked "Assumption", with what they are based on.
        </Accordion>
        <Accordion title="What happens to what I type?">
          It stays in this browser. Nothing you type is stored on a server. To draft text, the app sends only the
          numbers the calculator needs, never names or contact details.
        </Accordion>
        <Accordion title="Is this financial or legal advice?">
          No. It is a prototype to start a conversation. Confirm everything with a lender, your city's planning
          department and a housing counselor before you decide anything.
        </Accordion>
      </div>
    </Section>
  );
}

/* ---------- Closing call to action ---------- */

function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="on-dark relative overflow-hidden bg-cocoa text-white">
      <Photo name="neighborhood" decorative className="absolute inset-0" />
      <div className="absolute inset-0 bg-cocoa/60" aria-hidden />
      <Container className="relative flex min-h-[460px] flex-col items-center justify-center py-20 text-center md:min-h-[540px]">
        <motion.div variants={stagger()} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className="flex flex-col items-center">
          <motion.h2 variants={fadeUp} id="cta-title" className="max-w-3xl text-headline font-medium">
            Plan a backyard home, together
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-[18px] text-white">
            Pick a parcel, set the deal, and see one set of numbers everyone can check.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <ButtonLink to="/dashboard" variant="inverse">
              Open the dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
