import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { AlertTriangle } from "lucide-react";

const CONTROL =
  "min-h-11 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-[16px] text-ink placeholder:text-mist " +
  "hover:border-ink focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-ink aria-[invalid=true]:border-risk";

/** Label + control + hint + plain-language error, wired with ids for screen readers. */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[15px] font-medium">
        {label}
        {optional && <span className="ml-1.5 font-normal text-mute">(optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-[14px] text-mute">
          {hint}
        </p>
      )}
      {children}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-[14px] text-risk" role="alert">
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** aria props for a control inside <Field>. */
export const describedBy = (id: string, hasHint: boolean, error?: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": [hasHint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined,
});

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL} ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${CONTROL} appearance-none bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 ${props.className ?? ""}`}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230a0a0a' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
    >
      {children}
    </select>
  );
}

/** Large tap-friendly choice tiles (radio or checkbox) inside a fieldset with a legend. */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  multiple = false,
  error,
  columns = 2,
}: {
  name: string;
  legend: ReactNode;
  hint?: ReactNode;
  options: { value: T; label: string; detail?: string }[];
  value: T | T[] | undefined;
  onChange: (next: T | T[]) => void;
  multiple?: boolean;
  error?: string;
  columns?: 1 | 2 | 3 | 4;
}) {
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);
  const toggle = (v: T) => {
    if (!multiple) return onChange(v);
    const arr = Array.isArray(value) ? value : [];
    onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];

  return (
    <fieldset
      className="space-y-2"
      aria-describedby={[hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined}
    >
      <legend className="text-[15px] font-medium">{legend}</legend>
      {hint && (
        <p id={`${name}-hint`} className="text-[14px] text-mute">
          {hint}
        </p>
      )}
      <div className={`grid gap-2 pt-1 ${cols}`}>
        {options.map((o) => {
          const on = selected(o.value);
          return (
            <label
              key={o.value}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                on ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white hover:border-ink/60"
              }`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={o.value}
                checked={on}
                onChange={() => toggle(o.value)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center border ${multiple ? "" : "rounded-full"} ${
                  on ? "border-white" : "border-ink/50"
                }`}
              >
                {on && <span className={`h-2 w-2 bg-white ${multiple ? "" : "rounded-full"}`} />}
              </span>
              <span>
                <span className="block text-[15px]">{o.label}</span>
                {o.detail && <span className={`block text-[13px] ${on ? "text-white/80" : "text-mute"}`}>{o.detail}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError id={`${name}-error`}>{error}</FieldError>}
    </fieldset>
  );
}
