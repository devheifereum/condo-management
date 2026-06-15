import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { X, Package, PackagePlus } from "lucide-react";
import { useParcels } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { FilterChips } from "@/components/ui/FilterChips";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { unitLabel } from "@/mock/store";
import { fmtDateTime } from "@/lib/cn";
import type { Parcel, ParcelStatus } from "@/types";

type Filter = "all" | ParcelStatus;

export function ParcelLog() {
  const { data: parcels, isLoading } = useParcels();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Parcel | null>(null);

  const rows = useMemo(
    () => (parcels ?? []).filter((p) => filter === "all" || p.status === filter),
    [parcels, filter]
  );

  const columns = useMemo<ColumnDef<Parcel, any>[]>(
    () => [
      {
        accessorKey: "trackingNo",
        header: "Tracking",
        cell: (c) => <span className="numeric text-ink">{c.getValue()}</span>,
      },
      {
        accessorFn: (r) => unitLabel(r.unitId),
        id: "unit",
        header: "Unit",
        cell: (c) => <span className="numeric">{c.getValue()}</span>,
      },
      { accessorKey: "courier", header: "Courier", cell: (c) => c.getValue() || "—" },
      { accessorKey: "size", header: "Size", cell: (c) => c.getValue() || "—" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (c) => (
          <StatusBadge
            label={c.getValue() === "awaiting" ? "Awaiting" : "Collected"}
            tone={statusTone(c.getValue())}
          />
        ),
      },
      { accessorKey: "loggedBy", header: "Logged by" },
      {
        accessorFn: (r) => r.loggedAt,
        id: "loggedAt",
        header: "Logged",
        cell: (c) => <span className="numeric">{fmtDateTime(c.getValue())}</span>,
      },
      {
        accessorFn: (r) => r.collectedAt,
        id: "collectedAt",
        header: "Collected",
        cell: (c) => <span className="numeric">{fmtDateTime(c.getValue())}</span>,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Parcel log"
        subtitle="Every parcel from intake to collection."
        action={
          <Link to="/guard/parcels/new">
            <Button size="sm">
              <PackagePlus className="h-4 w-4" />
              Log parcel
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <ListSkeleton rows={6} />
      ) : (
        <DataTable<Parcel>
          columns={columns}
          data={rows}
          searchPlaceholder="Search tracking, unit…"
          onRowClick={(p) => setActive(p)}
          rowClassName={(p) =>
            p.status === "awaiting"
              ? "border-l-2 border-l-brand"
              : "opacity-80"
          }
          toolbar={
            <FilterChips<Filter>
              chips={[
                { value: "all", label: "All" },
                { value: "awaiting", label: "Awaiting" },
                { value: "collected", label: "Collected" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
        />
      )}

      {/* detail drawer */}
      {active && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setActive(null)}
          />
          <div className="relative h-full w-full max-w-sm overflow-y-auto border-l border-paper-line bg-paper-raised p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Parcel detail</h2>
              <button
                onClick={() => setActive(null)}
                className="text-ink-faint hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-paper">
                <Package className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="numeric font-medium text-ink">{active.trackingNo}</p>
                <StatusBadge
                  label={active.status === "awaiting" ? "Awaiting" : "Collected"}
                  tone={statusTone(active.status)}
                />
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <Row label="Unit" value={unitLabel(active.unitId)} />
              <Row label="Courier" value={active.courier ?? "—"} />
              <Row label="Size" value={active.size ?? "—"} />
              <Row label="Logged by" value={active.loggedBy} />
              <Row label="Logged at" value={fmtDateTime(active.loggedAt)} />
              <Row label="Collected by" value={active.collectedByName ?? "—"} />
              <Row label="Collected at" value={fmtDateTime(active.collectedAt)} />
            </dl>

            <div className="mt-5">
              <p className="mb-2 text-sm text-ink-muted">Signature</p>
              {active.signature ? (
                <img
                  src={active.signature}
                  alt="signature"
                  className="w-full rounded-lg border border-paper-line bg-white"
                />
              ) : (
                <div className="rounded-lg border border-dashed border-paper-line p-6 text-center text-sm text-ink-faint">
                  {active.status === "collected"
                    ? "Signed on collection (legacy record)"
                    : "Not yet collected"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
