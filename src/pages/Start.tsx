import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "../components/ds/Layout";
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
        <motion.p variants={fadeUp} className="text-sm tracking-widest text-mute uppercase">
          Get started
        </motion.p>
        <motion.h1 variants={fadeUp} className="mt-4 max-w-4xl text-headline font-light">
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
                  className="group flex h-full w-full flex-col border border-ink/25 bg-white text-left transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white focus-visible:bg-ink focus-visible:text-white"
                >
                  <Photo name={m.image} decorative className="aspect-[4/3] w-full" />
                  <span className="flex flex-1 flex-col justify-between gap-6 p-6">
                    <span>
                      <span className="flex items-center justify-between text-sm tracking-widest opacity-70">
                        ({String(i + 1).padStart(2, "0")})
                        {isRemembered && <span className="normal-case tracking-normal">Your last choice</span>}
                      </span>
                      <span className="mt-3 block text-3xl font-light">{m.choice}</span>
                      <span className="mt-2 block text-[15px] opacity-80">{m.blurb}</span>
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current" aria-hidden>
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
