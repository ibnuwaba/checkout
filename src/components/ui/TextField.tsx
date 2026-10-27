
import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  label,
  hint,
  error,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = inputProps.name
    ? `${generatedId}-${inputProps.name}`
    : generatedId;

  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    hint ? hintId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      <input
        {...inputProps}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition",
          "placeholder:text-slate-400 focus:ring-2 focus:ring-violet-200",
          error
            ? "border-red-500 focus:border-red-500"
            : "border-slate-300 focus:border-violet-600",
          className,
        )}
      />

      {hint && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
