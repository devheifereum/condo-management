import { useMemo, useState } from "react";
import { Search, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useUnits } from "@/lib/queries";
import { useResidentsIndex } from "@/lib/useResidentsIndex";

interface Props {
  value?: string; // unitId
  onChange: (unitId: string) => void;
  error?: string;
  label?: string;
}

// Searchable unit/resident/phone selector reused by both guard flows.
export function UnitSearch({ value, onChange, error, label = "Unit" }: Props) {
  const { data: units = [] } = useUnits();
  const residentsByUnit = useResidentsIndex();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = units.find((u) => u.id === value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units.slice(0, 6);
    return units.filter((u) => {
      const residents = residentsByUnit[u.id] ?? [];
      return (
        u.number.toLowerCase().includes(q) ||
        residents.some(
          (r) =>
            r.name.toLowerCase().includes(q) || r.phone.includes(query.trim())
        )
      );
    });
  }, [query, units, residentsByUnit]);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-ink-muted">{label}</label>

      {selected ? (
        <div className="flex items-center justify-between rounded-lg border border-brand/50 bg-brand/5 px-3 h-10">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-brand" />
            <span className="font-medium text-ink">{selected.number}</span>
            <span className="text-ink-muted">
              {(residentsByUnit[selected.id] ?? [])
                .map((r) => r.name)
                .join(", ")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setQuery("");
            }}
            className="text-ink-faint hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search unit, name or phone…"
              className={cn(
                "w-full h-10 rounded-lg bg-paper border px-3 pr-10 text-ink placeholder:text-ink-faint outline-none focus:border-brand focus:ring-1 focus:ring-brand",
                error ? "border-alert" : "border-paper-line"
              )}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          </div>

          {open && results.length > 0 && (
            <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-paper-line bg-paper-raised shadow-card">
              {results.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onMouseDown={() => {
                    onChange(u.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-paper"
                >
                  <span className="font-medium text-ink">{u.number}</span>
                  <span className="text-xs text-ink-muted truncate ml-3">
                    {(residentsByUnit[u.id] ?? []).map((r) => r.name).join(", ")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-alert">{error}</p>}
    </div>
  );
}
