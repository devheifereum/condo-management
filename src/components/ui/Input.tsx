import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  right?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, right, className, id, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-ink-muted">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-10 rounded-lg bg-paper border px-3 text-ink placeholder:text-ink-faint outline-none transition-colors",
            "focus:border-brand focus:ring-1 focus:ring-brand",
            error ? "border-alert" : "border-paper-line",
            right && "pr-10",
            className
          )}
          {...rest}
        />
        {right && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {right}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  );
});
