import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../../lib/motion";
import { IMAGES, type ImageKey } from "../../lib/images";

/**
 * A photo from /public/images over a warm gradient. While the file is missing (photos not added
 * yet) a quiet line drawing of a house + backyard home sits on the gradient, so it reads as
 * intentional. `reveal` opens the mask once when scrolled into view.
 */
export function Photo({
  name,
  mask = "rect",
  reveal = false,
  className = "",
  decorative = false,
  art = true,
  children,
}: {
  name: ImageKey;
  mask?: "rect" | "circle";
  reveal?: boolean;
  className?: string;
  decorative?: boolean;
  /** Show the line drawing while the photo is missing. */
  art?: boolean;
  children?: ReactNode;
}) {
  const info = IMAGES[name];
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const reduce = useReducedMotion();

  const closed = mask === "circle" ? "circle(0% at 50% 50%)" : "inset(12% 12% 12% 12% round 24px)";
  const open = mask === "circle" ? "circle(50% at 50% 50%)" : "inset(0% 0% 0% 0% round 0px)";
  const animateMask = reveal && !reduce;
  const labelled = !decorative && status === "ok";

  return (
    <motion.div
      className={`${/(absolute|fixed)/.test(className) ? "" : "relative"} overflow-hidden ${mask === "circle" ? "aspect-square rounded-full" : ""} ${className}`}
      style={{ background: info.placeholder }}
      initial={animateMask ? { clipPath: closed } : false}
      whileInView={animateMask ? { clipPath: open } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE }}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? info.alt : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {status !== "ok" && art && <HouseArt />}
      {status !== "missing" && (
        <motion.img
          src={info.src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("missing")}
          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
          animate={status === "ok" ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </motion.div>
  );
}

/** Line drawing: a main house and a small backyard home, horizon line, sun. */
function HouseArt() {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-x-0 bottom-0 mx-auto h-[70%] w-[85%] text-white/35"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
        <circle cx="320" cy="70" r="22" />
        <path d="M0 230h400" />
        <path d="M40 230V140l80-58 80 58v90" />
        <path d="M95 230v-48h50v48M60 160h28v24H60zM152 160h28v24h-28z" />
        <path d="M240 230v-62l50-34 50 34v62" />
        <path d="M278 230v-34h24v34M252 180h18v16h-18zM310 180h18v16h-18z" />
        <path d="M200 230c10-14 30-14 40 0" />
      </g>
    </svg>
  );
}
