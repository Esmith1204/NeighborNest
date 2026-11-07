import { Link } from "react-router";
import { SyntheticChip } from "../ds/Badge";
import { Container } from "../ds/Layout";
import { IMAGES } from "../../lib/images";
import { Logo, SECTIONS } from "./Header";

const COLS = [
  { title: "On this page", links: SECTIONS.map((s) => ({ to: `/#${s.id}`, label: s.label })) },
  {
    title: "Use it",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/dashboard#sources", label: "Sources" },
      { to: "/#examples", label: "Examples" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="on-dark bg-cocoa text-paper print:hidden">
      <Container className="pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-4">
            <Logo light />
            <p className="max-w-sm text-paper/75">
              One backyard, two households. A prototype from the Claude Impact Lab: UCI × SoCal Affordable Housing,
              November 7, 2026.
            </p>
            <SyntheticChip dark />
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title} className="md:col-span-4">
              <p className="flex items-center gap-2 text-[14px] text-paper/75">
                <span className="h-1.5 w-1.5 rounded-full bg-caramel" aria-hidden />
                {c.title}
              </p>
              <ul className="mt-2">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex min-h-11 items-center text-2xl font-medium tracking-tight text-paper/90 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant boxed wordmark with corner brackets. */}
        <div className="relative mt-16 px-3 py-6 md:px-6 md:py-10" aria-hidden>
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
            (c) => (
              <span key={c} className={`absolute h-10 w-10 border-paper/40 md:h-16 md:w-16 ${c}`} />
            ),
          )}
          <p className="text-center text-[13.5vw] leading-none font-medium tracking-[-0.065em] text-paper xl:text-[168px]">
            NeighborNest
          </p>
        </div>

        <div className="mt-10 grid gap-6 border-t border-paper/15 pt-6 text-[13px] text-paper/70 md:grid-cols-12">
          <div className="space-y-1 md:col-span-5">
            <p>Synthetic parcels, people and partners. Numbers come from the calculator, not the AI.</p>
            <p>Prototype only. Not legal, financial or lending advice.</p>
          </div>
          <div className="md:col-span-7">
            <p className="text-paper/85">Photos via Wikimedia Commons (checked 2026-11-07):</p>
            <ul className="mt-1 space-y-0.5">
              {Object.values(IMAGES).map(({ credit: c }) => (
                <li key={c.source}>
                  <a href={c.source} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                    {c.title}
                  </a>{" "}
                  by {c.author},{" "}
                  <a href={c.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
                    {c.license}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
