import { useEffect, useMemo, useState } from "react";
import { Delete, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useUnits } from "@/lib/queries";
import { useResidentsIndex } from "@/lib/useResidentsIndex";

interface Props {
  value?: string; // selected unitId
  onChange: (unitId: string) => void;
  label?: string;
  error?: string;
}

const norm = (s: string) => s.replace(/[-\s]/g, "").toUpperCase();

/**
 * Tap-friendly keypad for picking a unit on a tablet / phone — no soft keyboard.
 * Tap a block letter then the digits; it auto-selects once one unit matches.
 */
export function UnitKeypad({ value, onChange, label = "Recipient unit", error }: Props) {
  const { data: units = [] } = useUnits();
  const residentsByUnit = useResidentsIndex();
  const [entry, setEntry] = useState("");

  const selected = units.find((u) => u.id === value);
  const blocks = useMemo(
    () => Array.from(new Set(units.map((u) => u.block))).sort(),
    [units]
  );

  const matches = useMemo(() => {
    if (!entry) return [];
    const e = norm(entry);
    return units.filter((u) => norm(u.number).startsWith(e)).slice(0, 8);
  }, [entry, units]);

  // auto-select as soon as the entry narrows to a single unit
  useEffect(() => {
    if (entry && matches.length === 1 && matches[0].id !== value) {
      onChange(matches[0].id);
    }
  }, [entry, matches, onChange, value]);

  const append = (ch: string) => setEntry((p) => p + ch);
  const backspace = () => setEntry((p) => p.slice(0, -1));
  const clearAll = () => {
    setEntry("");
    onChange("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-ink-muted">{label}</label>

      {/* display */}
      {selected ? (
        <div className="flex items-center justify-between rounded-lg border border-brand/50 bg-brand/5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand" />
            <div>
              <p className="numeric font-semibold text-ink">{selected.number}</p>
              <p className="text-xs text-ink-muted">
                {(residentsByUnit[selected.id] ?? []).map((r) => r.name).join(", ")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="text-ink-faint hover:text-ink"
            aria-label="Clear unit"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex h-12 items-center rounded-lg border bg-paper px-3",
            error ? "border-alert" : "border-paper-line"
          )}
        >
          <span className="numeric text-lg tracking-widest text-ink">
            {entry || <span className="text-ink-faint">Tap to enter unit…</span>}
          </span>
        </div>
      )}

      {/* block letters */}
      <div className="flex flex-wrap gap-2">
        {blocks.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => append(b)}
            className="h-11 min-w-[3rem] flex-1 rounded-lg border border-paper-line bg-paper-raised text-base font-semibold text-ink transition-colors hover:border-brand/60 active:bg-brand/10"
          >
            {b}
          </button>
        ))}
      </div>

      {/* number pad */}
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <KeypadKey key={n} onClick={() => append(n)}>
            {n}
          </KeypadKey>
        ))}
        <KeypadKey onClick={() => append("-")}>
          <span className="text-ink-muted">–</span>
        </KeypadKey>
        <KeypadKey onClick={() => append("0")}>0</KeypadKey>
        <KeypadKey onClick={backspace} aria-label="Backspace">
          <Delete className="h-5 w-5" />
        </KeypadKey>
      </div>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-lg border border-paper-line py-2 text-sm font-medium text-ink-muted hover:text-ink"
      >
        Clear
      </button>

      {/* multiple matches → tap to choose */}
      {!selected && matches.length > 1 && (
        <div className="overflow-hidden rounded-lg border border-paper-line">
          {matches.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onChange(u.id)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-paper"
            >
              <span className="numeric font-medium text-ink">{u.number}</span>
              <span className="ml-3 truncate text-xs text-ink-muted">
                {(residentsByUnit[u.id] ?? []).map((r) => r.name).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}

      {!selected && entry && matches.length === 0 && (
        <p className="text-xs text-ink-faint">No unit matches “{entry}”.</p>
      )}
      {error && <p className="text-xs text-alert">{error}</p>}
    </div>
  );
}

function KeypadKey({
  children,
  onClick,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 items-center justify-center rounded-lg border border-paper-line bg-paper-raised text-xl font-medium text-ink transition-colors hover:border-brand/60 active:bg-brand/10"
      {...rest}
    >
      {children}
    </button>
  );
}
