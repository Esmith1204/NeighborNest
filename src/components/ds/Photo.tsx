import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../../lib/motion";
import { IMAGES, PHOTO_FILL, type ImageKey } from "../../lib/images";

/**
 * A credited photo from /public/images on a flat fill (shown only while it loads).
 * `reveal` opens the mask once when scrolled into view.
 */
export function Photo({
  name,
  mask = "rect",
  reveal = false,
  className = "",
  decorative = false,
  children,
}: {
  name: ImageKey;
  mask?: "rect" | "circle";
  reveal?: boolean;
  className?: string;
  decorative?: boolean;
  children?: ReactNode;
}) {
  const info = IMAGES[name];
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const reduce = useReducedMotion();

  const closed = mask === "circle" ? "circle(0% at 50% 50%)" : "inset(10% 10% 10% 10% round 24px)";
  const open = mask === "circle" ? "circle(50% at 50% 50%)" : "inset(0% 0% 0% 0% round 0px)";
  const animateMask = reveal && !reduce;
  const labelled = !decorative && status === "ok";
  const positioned = /(^|\s)(absolute|fixed)(\s|$)/.test(className);

  return (
    <motion.div
      className={`${positioned ? "" : "relative"} overflow-hidden ${mask === "circle" ? "aspect-square rounded-full" : ""} ${className}`}
      style={{ backgroundColor: PHOTO_FILL }}
      initial={animateMask ? { clipPath: closed } : false}
      whileInView={animateMask ? { clipPath: open } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: EASE }}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? info.alt : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {status !== "missing" && (
        <motion.img
          src={info.src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("missing")}
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={status === "ok" ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </motion.div>
  );
}
