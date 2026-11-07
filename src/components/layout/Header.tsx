import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ButtonLink, IconButton } from "../ds/Button";
import { EASE } from "../../lib/motion";

/** The landing page's main sections. Each nav item scrolls to one. */
export const SECTIONS = [
  { id: "what", label: "What we do" },
  { id: "roles", label: "Who it's for" },
  { id: "how", label: "How it works" },
  { id: "faq", label: "FAQ" },
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

/** Which landing section is on screen, for the nav highlight. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return setActive(null);
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

/** Transparent over the landing hero, flat cream everywhere else (and once you scroll). */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const onLanding = pathname === "/";
  const overHero = onLanding && !scrolled && !open;
  const active = useActiveSection(onLanding);

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
        overHero ? "on-dark bg-transparent" : "border-b border-ink/10 bg-paper"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
        <Logo light={overHero} />

        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <Link
                key={s.id}
                to={`/#${s.id}`}
                aria-current={on ? "location" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-[16px] font-medium transition-colors duration-150 ${
                  overHero ? "text-white hover:bg-white/15" : on ? "bg-ink text-paper" : "text-ink hover:bg-sand"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink to="/dashboard" variant={overHero ? "inverse" : "primary"} className="whitespace-nowrap">
              Dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
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
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <Link
                    to={`/#${s.id}`}
                    className="flex min-h-14 items-center justify-between border-b border-ink/10 text-2xl font-medium tracking-tight"
                  >
                    {s.label}
                    <span className="text-sm font-normal text-mute">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
              <li className="py-4">
                <ButtonLink to="/dashboard" className="w-full">
                  Dashboard <ArrowUpRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
