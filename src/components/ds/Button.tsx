import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "glass" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-medium " +
  "transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<ButtonVariant, string> = {
  // Solid espresso pill, cream text.
  primary: "bg-ink text-paper hover:bg-brown",
  // Outlined pill.
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-sand",
  // On photos: white pill, dark text.
  inverse: "bg-white text-ink hover:bg-paper",
  // On photos: frosted outline pill.
  glass: "border border-white/45 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-ink",
  ghost: "px-2 text-ink underline-offset-4 hover:underline",
};

export const buttonClass = (variant: ButtonVariant = "primary", className = "") =>
  `${BASE} ${VARIANTS[variant]} ${className}`;

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}

export function ButtonLink({ variant = "primary", className = "", ...rest }: CommonProps & LinkProps) {
  return <Link className={buttonClass(variant, className)} {...rest} />;
}

/** Round icon button, 44px. Always needs an accessible label. */
export function IconButton({
  label,
  children,
  className = "",
  dark = false,
  type = "button",
  ...rest
}: { label: string; children: ReactNode; dark?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
        dark
          ? "border-white/45 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-ink"
          : "border-ink/20 bg-white text-ink hover:bg-ink hover:text-paper"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** The small round arrow used on cards (decorative: the card itself is the link). */
export function ArrowDot({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 ${dark ? "bg-ink text-paper" : "bg-white text-ink"} ${className}`}
    >
      {children}
    </span>
  );
}
