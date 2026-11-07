import type { ReactNode } from "react";
import { Plus } from "lucide-react";

/** Native <details>: keyboard and screen-reader support for free. */
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
    <details open={defaultOpen} className={`group border-t border-ink/20 last:border-b ${className}`}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-normal [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/40 transition-transform duration-300 group-open:rotate-45">
          <Plus className="h-4 w-4" aria-hidden />
        </span>
      </summary>
      <div className="pb-6 text-[15px] text-ink/85">{children}</div>
    </details>
  );
}
