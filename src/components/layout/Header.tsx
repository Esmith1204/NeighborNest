import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { ButtonLink, IconButton } from "../ds/Button";
import { EASE } from "../../lib/motion";

const LEFT = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/homeowner", label: "For homeowners" },
  { to: "/renter", label: "For renters" },
];
const RIGHT = [
  { to: "/partner", label: "For partners" },
  { to: "/sources", label: "Sources" },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center text-[15px] underline-offset-[6px] transition-colors duration-150 hover:underline ${
    isActive ? "underline decoration-1" : ""
  }`;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex min-h-11 items-center gap-2.5 ${className}`} aria-label="NeighborNest home">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <circle cx="16" cy="16" r="15.25" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M8 17.5 16 10l8 7.5M11 15.5V23h10v-7.5" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M18.5 23v-4h3" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="text-xl font-normal tracking-[0.02em]">NeighborNest</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink bg-paper/90 backdrop-blur-md print:hidden">
      <div className="mx-auto grid h-16 max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-8">
        <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex">
          {LEFT.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="xl:hidden">
          <IconButton
            label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </IconButton>
        </div>

        <Logo />

        <div className="flex items-center justify-end gap-6">
          <nav aria-label="Secondary" className="hidden items-center gap-6 xl:flex">
            {RIGHT.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/#examples" className="inline-flex min-h-11 items-center text-[15px] underline underline-offset-[6px]">
              Try the demo
            </Link>
          </nav>
          <span className="hidden sm:block">
            <ButtonLink to="/start" className="whitespace-nowrap">
              Get started
            </ButtonLink>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="border-t border-ink bg-paper xl:hidden"
          >
            <ul className="mx-auto max-w-[1280px] divide-y divide-ink/15 px-4 md:px-8">
              {[...LEFT, ...RIGHT, { to: "/#examples", label: "Try the demo" }].map((l, i) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex min-h-14 items-center justify-between text-2xl font-light">
                    {l.label}
                    <span className="text-sm text-mute">({String(i + 1).padStart(2, "0")})</span>
                  </Link>
                </li>
              ))}
              <li className="py-4">
                <ButtonLink to="/start" className="w-full">
                  Get started
                </ButtonLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
