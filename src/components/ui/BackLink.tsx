import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

// Consistent "back" affordance used at the top of every detail / sub-page.
export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-brand"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
