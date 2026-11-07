import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ButtonLink, IconButton } from "../ds/Button";
import { EASE } from "../../lib/motion";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/homeowner", label: "Homeowners" },
  { to: "/renter", label: "Renters" },
  { to: "/partner", label: "Partners" },
  { to: "/sources", label: "Sources" },
];

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <Link
      to="/"
      className={`inline-flex min-h-11 items-center gap-2 ${light ? "text-white" : "text-ink"} ${className}`}
      aria-label="NeighborNest home"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <path d="M4 27V14L16 5l12 9v13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 27v-8h7v8M20 27v-5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="text-[21px] font-medium tracking-[-0.03em]">NeighborNest</span>
    </Link>
  );
}

/** Transparent over the landing hero, solid cream everywhere else (and once you scroll). */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 print:hidden ${
        overHero ? "on-dark bg-transparent" : "border-b border-ink/10 bg-paper/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
        <Logo light={overHero} />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center rounded-full px-4 text-[16px] transition-colors duration-150 ${
                  overHero
                    ? `text-white hover:bg-white/15 ${isActive ? "bg-white/15" : ""}`
                    : `text-ink/75 hover:bg-sand hover:text-ink ${isActive ? "bg-sand text-ink" : ""}`
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink to="/start" variant={overHero ? "glass" : "primary"} className="whitespace-nowrap">
              Get started <ArrowUpRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </span>
          <span className="lg:hidden">
            <IconButton
              dark={overHero}
              label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </IconButton>
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
            className="border-t border-ink/10 bg-paper lg:hidden"
          >
            <ul className="mx-auto max-w-[1280px] px-4 py-2 md:px-8">
              {[...NAV, { to: "/#examples", label: "See an example" }].map((l, i) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex min-h-14 items-center justify-between border-b border-ink/10 text-2xl font-medium tracking-tight"
                  >
                    {l.label}
                    <span className="text-sm font-normal text-mute">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
              <li className="py-4">
                <ButtonLink to="/start" className="w-full">
                  Get started <ArrowUpRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
