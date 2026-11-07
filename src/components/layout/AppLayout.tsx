import { useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * Scroll to top on page change, or to #hash targets. Same page: scroll now. New page: wait for the
 * page fade so the target exists. `key` re-runs it when the same section link is clicked twice.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef(pathname);
  useEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const go = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
      if (samePage) return void go();
      const t = window.setTimeout(go, 350);
      return () => window.clearTimeout(t);
    }
    if (!samePage) window.scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
}

/** Keeps the leaving page on screen during its fade-out (a plain <Outlet> would swap instantly). */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function AppLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="flex-1 outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <FrozenOutlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
