import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../../lib/motion";
import { IMAGES, type ImageKey } from "../../lib/images";

/**
 * A photo from /public/images with a dark gradient underneath. If the file is missing (photos not
 * added yet), the gradient is all you see. `reveal` animates the mask open once, on load or in view.
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

  const closed = mask === "circle" ? "circle(0% at 50% 50%)" : "inset(100% 0% 0% 0%)";
  const open = mask === "circle" ? "circle(50% at 50% 50%)" : "inset(0% 0% 0% 0%)";
  const animateMask = reveal && !reduce;

  return (
    <motion.div
      className={`relative overflow-hidden ${mask === "circle" ? "aspect-square rounded-full" : ""} ${className}`}
      style={{ background: info.placeholder }}
      initial={animateMask ? { clipPath: closed } : false}
      whileInView={animateMask ? { clipPath: open } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE }}
      role={decorative || status !== "ok" ? undefined : "img"}
      aria-label={decorative || status !== "ok" ? undefined : info.alt}
      aria-hidden={decorative || status !== "ok" ? true : undefined}
    >
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
