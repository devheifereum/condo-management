import { cn } from "@/lib/cn";

export type Tone = "brand" | "ok" | "alert" | "muted";

const tones: Record<Tone, string> = {
  brand: "bg-brand/15 text-brand",
  ok: "bg-ok/15 text-ok",
  alert: "bg-alert/15 text-alert",
  muted: "bg-ink/10 text-ink-muted",
};

const dot: Record<Tone, string> = {
  brand: "bg-brand",
  ok: "bg-ok",
  alert: "bg-alert",
  muted: "bg-ink-muted",
};

export function StatusBadge({
  label,
  tone = "muted",
  dotted = true,
}: {
  label: string;
  tone?: Tone;
  dotted?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone]
      )}
    >
      {dotted && <span className={cn("h-1.5 w-1.5 rounded-full", dot[tone])} />}
      {label}
    </span>
  );
}

// Map visitor / parcel statuses to a tone.
export function statusTone(status: string): Tone {
  switch (status) {
    case "expected":
    case "awaiting":
    case "pending":
      return "brand";
    case "arrived":
    case "departed":
    case "collected":
    case "approved":
      return "ok";
    case "rejected":
      return "alert";
    default:
      return "muted";
  }
}
