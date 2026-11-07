import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "../components/ds/Layout";
import { Photo } from "../components/ds/Photo";
import { fadeUp, stagger } from "../lib/motion";
import { loadRole, ROLE_META, ROLES, saveRole, type Role } from "../lib/roles";

/** One question, three large cards. The choice is remembered on this device only. */
export default function Start() {
  const navigate = useNavigate();
  const [remembered] = useState<Role | null>(() => loadRole());

  function choose(role: Role) {
    saveRole(role);
    navigate(ROLE_META[role].path);
  }

  return (
    <Container className="py-12 md:py-20">
      <motion.div variants={stagger()} initial="hidden" animate="show">
        <motion.div variants={fadeUp}>
          <SectionLabel>Get started</SectionLabel>
        </motion.div>
        <motion.h1 variants={fadeUp} className="mt-5 max-w-4xl text-headline font-medium">
          Which of these sounds like you?
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg text-mute">
          Pick one. You can switch any time. A few short steps follow, then your results.
        </motion.p>

        <motion.ul variants={stagger(0.15)} className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Choose your role">
          {ROLES.map((r, i) => {
            const m = ROLE_META[r];
            const isRemembered = remembered === r;
            return (
              <motion.li key={r} variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => choose(r)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-media)] bg-white p-2 text-left ring-1 ring-ink/8 transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper"
                >
                  <Photo name={m.image} decorative className="aspect-[4/3] w-full rounded-2xl" />
                  <span className="flex flex-1 flex-col justify-between gap-6 p-4 md:p-5">
                    <span>
                      <span className="flex items-center justify-between text-sm opacity-70">
                        {String(i + 1).padStart(2, "0")}
                        {isRemembered && <span className="normal-case tracking-normal">Your last choice</span>}
                      </span>
                      <span className="mt-3 block text-3xl font-medium tracking-tight">{m.choice}</span>
                      <span className="mt-2 block text-[15px] opacity-80">{m.blurb}</span>
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-paper group-hover:text-ink" aria-hidden>
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
        <motion.p variants={fadeUp} className="mt-8 text-[14px] text-mute">
          Demo only. What you enter stays in this browser; nothing is sent to a server except the numbers the
          calculator needs to draft text.
        </motion.p>
      </motion.div>
    </Container>
  );
}
