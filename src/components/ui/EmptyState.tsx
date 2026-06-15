import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-paper-line py-12 px-6 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-raised">
        <Icon className="h-6 w-6 text-ink-faint" />
      </div>
      <p className="text-ink font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-ink-muted max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
