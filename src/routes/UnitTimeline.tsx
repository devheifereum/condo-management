import { useMemo, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Users, Package } from "lucide-react";
import { useUnit, useUnitResidents, useVisitors, useParcels } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { StatusBadge, statusTone, type Tone } from "@/components/ui/StatusBadge";
import { FilterChips } from "@/components/ui/FilterChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { fmtDateTime } from "@/lib/cn";

type Filter = "all" | "visitor" | "parcel";

interface Item {
  id: string;
  kind: "visitor" | "parcel";
  label: string;
  status: string;
  tone: Tone;
  at: string;
}

export function UnitTimeline() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: unit, isLoading } = useUnit(id);
  const { data: residents } = useUnitResidents(id);
  const { data: visitors } = useVisitors(id);
  const { data: parcels } = useParcels(id);
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo<Item[]>(() => {
    const v: Item[] = (visitors ?? []).map((x) => ({
      id: x.id,
      kind: "visitor",
      label: `${x.name} — ${x.status}`,
      status: x.status,
      tone: statusTone(x.status),
      at: x.checkOutAt ?? x.checkInAt ?? x.visitAt ?? x.createdAt,
    }));
    const p: Item[] = (parcels ?? []).map((x) => ({
      id: x.id,
      kind: "parcel",
      label: `${x.courier ?? "Parcel"} ${x.trackingNo} — ${x.status}`,
      status: x.status,
      tone: statusTone(x.status),
      at: x.collectedAt ?? x.loggedAt,
    }));
    return [...v, ...p]
      .filter((i) => filter === "all" || i.kind === filter)
      .sort((a, b) => b.at.localeCompare(a.at));
  }, [visitors, parcels, filter]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        onClick={() =>
          navigate({ to: user?.role === "guard" ? "/guard" : "/resident" })
        }
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {isLoading ? (
        <Skeleton className="h-10 w-40" />
      ) : (
        <div className="mb-5">
          <h1 className="numeric text-2xl font-semibold text-ink">
            {unit?.number ?? "Unit"}
          </h1>
          <p className="text-sm text-ink-muted">
            {(residents ?? []).map((r) => r.name).join(", ") || "—"}
          </p>
        </div>
      )}

      <div className="mb-4">
        <FilterChips<Filter>
          chips={[
            { value: "all", label: "All" },
            { value: "visitor", label: "Visitors" },
            { value: "parcel", label: "Parcels" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <ol className="relative space-y-3 border-l border-paper-line pl-5">
        {items.map((i) => (
          <li key={i.kind + i.id} className="relative">
            <span className="absolute -left-[27px] top-3 flex h-6 w-6 items-center justify-center rounded-full border border-paper-line bg-paper-raised">
              {i.kind === "visitor" ? (
                <Users className="h-3 w-3 text-ink-muted" />
              ) : (
                <Package className="h-3 w-3 text-ink-muted" />
              )}
            </span>
            <Card className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm text-ink">{i.label}</p>
                <p className="numeric text-xs text-ink-faint">
                  {fmtDateTime(i.at)}
                </p>
              </div>
              <StatusBadge label={i.status} tone={i.tone} />
            </Card>
          </li>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-faint">
            No activity for this unit yet.
          </p>
        )}
      </ol>
    </div>
  );
}
