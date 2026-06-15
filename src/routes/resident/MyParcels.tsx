import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Package, PenLine } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useParcels } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { fmtDateTime } from "@/lib/cn";
import type { ParcelStatus } from "@/types";

type Filter = "awaiting" | "collected";

export function MyParcels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: parcels, isLoading } = useParcels(user?.unitId);
  const [filter, setFilter] = useState<Filter>("awaiting");

  const rows = (parcels ?? []).filter((p) => p.status === filter);

  const statusLabel = (s: ParcelStatus) =>
    s === "awaiting" ? "Awaiting collection" : "Collected";

  return (
    <div className="space-y-4">
      <PageHeader title="My parcels" />

      <FilterChips<Filter>
        chips={[
          { value: "awaiting", label: "Awaiting" },
          { value: "collected", label: "Collected" },
        ]}
        value={filter}
        onChange={setFilter}
      />

      {isLoading ? (
        <ListSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Package}
          title={filter === "awaiting" ? "No parcels waiting" : "Nothing collected yet"}
          description={
            filter === "awaiting"
              ? "Parcels logged at the guardhouse will appear here."
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {rows.map((p) => (
            <Card
              key={p.id}
              onClick={() => {
                if (p.status === "awaiting")
                  navigate({
                    to: "/resident/parcels/$id/collect",
                    params: { id: p.id },
                  });
              }}
              className={
                "flex items-center gap-3 p-3.5 " +
                (p.status === "awaiting"
                  ? "cursor-pointer hover:border-brand/50"
                  : "")
              }
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper">
                <Package className="h-5 w-5 text-ink-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {p.courier ?? "Parcel"}
                  {p.size && (
                    <span className="ml-2 rounded bg-paper px-1.5 py-0.5 text-xs text-ink-muted">
                      {p.size}
                    </span>
                  )}
                </p>
                <p className="numeric truncate text-xs text-ink-faint">
                  {p.trackingNo} · {fmtDateTime(p.loggedAt)}
                </p>
              </div>
              {p.status === "awaiting" ? (
                <div className="flex items-center gap-2">
                  <StatusBadge label={statusLabel(p.status)} tone="brand" />
                  <PenLine className="h-4 w-4 text-brand" />
                </div>
              ) : (
                <StatusBadge label={statusLabel(p.status)} tone={statusTone(p.status)} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
