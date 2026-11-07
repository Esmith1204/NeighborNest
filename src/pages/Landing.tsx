import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, Calculator, Database, Scale } from "lucide-react";
import { ButtonLink } from "../components/ds/Button";
import { SyntheticChip, Tag } from "../components/ds/Badge";
import { Container, Section } from "../components/ds/Layout";
import { Photo } from "../components/ds/Photo";
import { EASE, fadeUp, stagger } from "../lib/motion";
import { MARKET_RENT_REFERENCE } from "../lib/rent";
import { ROLE_META, ROLES } from "../lib/roles";
import { usd } from "../lib/format";
import parcels from "../data/parcels.json";
import { EXAMPLES } from "../lib/examples";

const HEADLINE = ["One backyard.", "Two households."];

export default function Landing() {
  return (
    <>
      <Hero />
      <Photo name="neighborhood" reveal decorative className="h-[42vh] max-h-[640px] min-h-64 w-full md:h-[60vh]" />
      <Explainer />
      <RoleGrid />
      <WhyItWorks />
      <Examples />
      <TrustStrip />
    </>
  );
}

function Hero() {
  const stats = [
    {
      value: usd(MARKET_RENT_REFERENCE.monthly),
      label: "HUD Fair Market Rent for a studio in Orange County, FY2026",
      tag: (
        <a href={MARKET_RENT_REFERENCE.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          Source: HUD
        </a>
      ),
    },
    { value: String(parcels.length), label: "sample parcels across Orange County cities", tag: <Tag>Demo data</Tag> },
    { value: "3", label: "households one plan serves: homeowner, renter and partner", tag: <Tag>How it works</Tag> },
  ];

  return (
    <section aria-labelledby="hero-title" className="overflow-hidden pt-10 pb-14 md:pt-16 md:pb-20">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <motion.div variants={stagger(0.1)} initial="hidden" animate="show" className="lg:col-span-8">
            <motion.p variants={fadeUp} className="mb-6 flex flex-wrap items-center gap-3 text-sm tracking-widest text-mute uppercase">
              <span>Backyard homes · Orange County, CA</span>
            </motion.p>
            <h1 id="hero-title" className="text-display font-light">
              {HEADLINE.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: "105%", opacity: 0 },
                      show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p variants={fadeUp} className="mt-8 max-w-xl text-xl text-ink/80">
              NeighborNest helps a homeowner, a person looking for a home and a community partner plan a backyard home
              together, with every number in plain language.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/start">Get started</ButtonLink>
              <ButtonLink to="/#examples" variant="secondary">
                See an example
              </ButtonLink>
            </motion.div>
          </motion.div>
          <div className="hidden lg:col-span-4 lg:block">
            <Photo name="hero" mask="circle" reveal className="w-full" />
          </div>
        </div>

        <motion.dl
          variants={stagger(0.5)}
          initial="hidden"
          animate="show"
          className="mt-14 grid gap-8 sm:grid-cols-3 md:mt-20"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="border-t border-ink pt-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-5xl font-light">{s.value}</span>
                  <span className="text-sm text-mute">({String(i + 1).padStart(2, "0")})</span>
                </span>
                <span className="mt-2 block text-[15px] text-ink/80">{s.label}</span>
                <span className="mt-3 block text-[13px]">{s.tag}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}

function Explainer() {
  const steps = [
    {
      title: "A homeowner has room",
      body: "A backyard big enough for a small second home, but not the cash or a loan to build it alone.",
    },
    {
      title: "A partner closes the gap",
      body: "A land trust or nonprofit puts in upfront cash and a monthly rent subsidy. The bank loan gets smaller.",
    },
    {
      title: "A neighbor moves in",
      body: "Someone who needs a stable home rents it below market. Their rent pays the loan and the mortgage down.",
    },
  ];
  return (
    <Section id="how-it-works" index={1} eyebrow="How it works" title="One backyard, two households">
      <motion.ol
        variants={stagger()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-10 md:grid-cols-3"
      >
        {steps.map((s, i) => (
          <motion.li key={s.title} variants={fadeUp} className="border-t border-ink/30 pt-5">
            <p className="text-6xl font-light text-mist" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-2xl font-normal">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <p className="mt-2 text-ink/80">{s.body}</p>
          </motion.li>
        ))}
      </motion.ol>
      <p className="mt-10">
        <Link to="/how-it-works" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4">
          Read the full method <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </p>
    </Section>
  );
}

/** The "services" grid: thin white lines over a dark photo; tiles turn white on hover or focus. */
function RoleGrid() {
  return (
    <section aria-labelledby="roles-title" className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <Photo name="cottage" decorative className="absolute inset-0 -z-10 opacity-40" />
      <Container className="py-16 md:py-24">
        <div className="mb-10 grid gap-6 md:grid-cols-12">
          <p className="text-sm tracking-widest text-white/80 uppercase md:col-span-4">(02) Who it's for</p>
          <h2 id="roles-title" className="text-headline font-light md:col-span-8">
            Three people, one plan
          </h2>
        </div>
        <div className="relative grid md:grid-cols-3">
          {/* Hairlines draw in once on scroll. */}
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left bg-white/60"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px origin-right bg-white/60"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          />
          {ROLES.map((r, i) => {
            const m = ROLE_META[r];
            return (
              <Link
                key={r}
                to={m.path}
                className={`group relative flex min-h-72 flex-col justify-between p-6 transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink md:min-h-96 md:p-8 ${
                  i > 0 ? "border-t border-white/60 md:border-t-0 md:border-l" : ""
                }`}
              >
                <span className="flex items-start justify-between">
                  <span className="text-sm tracking-widest opacity-80">({String(i + 1).padStart(2, "0")})</span>
                  <span
                    aria-hidden
                    className="inline-flex h-14 w-14 scale-75 items-center justify-center rounded-full border border-ink opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </span>
                <span>
                  <span className="block text-3xl font-light md:text-4xl">For {m.short.toLowerCase()}</span>
                  <span className="mt-3 block max-w-sm text-[15px] opacity-85">{m.blurb}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] tracking-widest uppercase opacity-80">
                    Details <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function WhyItWorks() {
  const points = [
    {
      title: "Partner cash shrinks the loan",
      body: "Every dollar the partner puts in up front is a dollar the homeowner does not borrow.",
    },
    {
      title: "Rent pays the loan",
      body: "The backyard home's rent covers the loan payment. What is left can pay the mortgage down faster.",
    },
    {
      title: "A subsidy keeps rent within reach",
      body: "The partner pays part of the rent, so the renter pays a share of income they can carry.",
    },
  ];
  return (
    <Section
      id="why"
      index={3}
      eyebrow="Why it works"
      title="The numbers have to close for everyone"
      intro={
        <p>
          <strong className="font-medium text-ink">Who is this for first:</strong> a land trust or nonprofit housing
          program that hands a homeowner and a renter one shared, plain-language term sheet.
        </p>
      }
    >
      <div className="grid gap-x-10 md:grid-cols-12">
        <ul className="divide-y divide-ink/20 border-y border-ink/20 md:col-span-8 md:col-start-5">
          {points.map((p, i) => (
            <li key={p.title} className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr]">
              <span className="text-sm text-mute">({String(i + 1).padStart(2, "0")})</span>
              <span>
                <span className="block text-2xl font-light">{p.title}</span>
                <span className="mt-1 block text-ink/80">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Examples() {
  return (
    <Section
      id="examples"
      index={4}
      eyebrow="See an example"
      title="Try it with a sample scenario"
      intro="Fictional composites, made up for the demo. They show how the flow works; they are not real people."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {EXAMPLES.map((ex, i) => (
          <Link
            key={ex.id}
            to={ex.to}
            className="group grid grid-cols-[auto_1fr] items-center gap-5 border border-ink/20 bg-white p-5 transition-colors duration-200 hover:border-ink md:p-6"
          >
            <Photo name={ex.image} mask="circle" decorative className="w-20 md:w-28" />
            <span>
              <span className="flex flex-wrap items-center gap-2">
                <Tag>Example scenario</Tag>
                <Tag>Fictional</Tag>
              </span>
              <span className="mt-3 block text-2xl font-light">{ex.title}</span>
              <span className="mt-1 block text-[15px] text-mute">{ex.summary}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-[14px] tracking-widest uppercase">
                Open example {String(i + 1).padStart(2, "0")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function TrustStrip() {
  const items = [
    { Icon: Database, title: "Synthetic demo data", body: "Every parcel, person and partner is made up. Real city names only." },
    { Icon: Calculator, title: "Numbers from the calculator", body: "Deterministic code does the math. Claude only writes the words." },
    { Icon: BookOpen, title: "Sources shown", body: "Every rate and rule links to where it came from, with the date checked.", to: "/sources" },
    { Icon: Scale, title: "A prototype, not advice", body: "Confirm everything with a lender, your city and a housing counselor." },
  ];
  return (
    <section aria-label="What to trust and what to check" className="border-t border-ink py-12">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm tracking-widest text-mute uppercase">(05) Limits, up front</p>
          <SyntheticChip />
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, title, body, to }) => (
            <li key={title} className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <span>
                <span className="block font-medium">{to ? <Link to={to} className="underline underline-offset-4">{title}</Link> : title}</span>
                <span className="mt-1 block text-[15px] text-mute">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
