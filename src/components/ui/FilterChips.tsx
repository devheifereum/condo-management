import { cn } from "@/lib/cn";

interface Chip<T extends string> {
  value: T;
  label: string;
}

export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
}: {
  chips: Chip<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors border",
            value === c.value
              ? "bg-brand text-white border-brand"
              : "bg-transparent text-ink-muted border-paper-line hover:text-ink"
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
