import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "inverse-outline" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-medium tracking-wide " +
  "transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<ButtonVariant, string> = {
  // Solid black rectangle, white text.
  primary: "bg-ink text-white hover:bg-[#2a2a2a]",
  // 1px outlined rectangle.
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
  // On dark photos: white rectangle, black text.
  inverse: "bg-white text-ink hover:bg-paper/85",
  "inverse-outline": "border border-white/70 text-white hover:bg-white hover:text-ink",
  ghost: "text-ink underline-offset-4 hover:underline px-2",
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

/** 1px outlined circle, 44px. Always needs an accessible label. */
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
        dark ? "border-white/60 text-white hover:bg-white hover:text-ink" : "border-ink text-ink hover:bg-ink hover:text-white"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
