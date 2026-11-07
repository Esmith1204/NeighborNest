import { Link } from "react-router";
import { SyntheticChip } from "../ds/Badge";
import { Container } from "../ds/Layout";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer className="on-dark border-t border-ink bg-ink text-white print:hidden">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Logo />
            <p className="max-w-sm text-white/80">
              One backyard, two households. A prototype built at the Claude Impact Lab: UCI × SoCal Affordable
              Housing, November 7, 2026.
            </p>
            <SyntheticChip dark />
          </div>
          <FooterList
            title="Start"
            links={[
              { to: "/start", label: "Get started" },
              { to: "/homeowner", label: "For homeowners" },
              { to: "/renter", label: "For renters" },
              { to: "/partner", label: "For partners" },
            ]}
          />
          <FooterList
            title="Learn"
            links={[
              { to: "/how-it-works", label: "How it works" },
              { to: "/sources", label: "Sources and data" },
              { to: "/#examples", label: "See an example" },
            ]}
          />
        </div>
        <div className="mt-12 space-y-1.5 border-t border-white/60 pt-6 text-[14px] text-white/75">
          <p>All parcels, people and partners in this app are synthetic. No real addresses, owners or applicants.</p>
          <p>Numbers come from the calculator, not the AI. Claude drafts text from those numbers.</p>
          <p>Prototype only. Not legal, financial or lending advice: talk to a lender, your city and a housing counselor.</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <nav aria-label={title} className="md:col-span-3">
      <p className="text-sm tracking-widest text-white/70 uppercase">{title}</p>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="inline-flex min-h-11 items-center text-lg font-light hover:underline underline-offset-4">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
