import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Centered auth-page shell used by Login / Register / Forgot / Reset / Verify.
 * Renders the wordmark logo, a card, and an optional footer link row.
 */
export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="auth-bg min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size={96} />
        </div>

        <div className="rounded-2xl bg-paper-raised border border-paper-line shadow-card p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-ink-muted">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
