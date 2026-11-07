import type { ReactNode } from "react";
import { Plus } from "lucide-react";

/** Native <details> in a soft sand box: keyboard and screen-reader support for free. */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details open={defaultOpen} className={`group rounded-[var(--radius-card)] bg-sand px-5 md:px-7 ${className}`}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-medium md:text-xl [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-open:rotate-45">
          <Plus className="h-4 w-4" aria-hidden />
        </span>
      </summary>
      <div className="pb-6 text-[16px] text-mute">{children}</div>
    </details>
  );
}
