import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ScanLine, UserPlus } from "lucide-react";
import { useVisitors, useCheckOut } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { unitLabel } from "@/mock/store";
import { fmtTime } from "@/lib/cn";
import type { Visitor, VisitorStatus } from "@/types";

type Filter = "all" | VisitorStatus;

export function VisitorLog() {
  const { data: visitors, isLoading } = useVisitors();
  const checkOut = useCheckOut();
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () =>
      (visitors ?? []).filter((v) => filter === "all" || v.status === filter),
    [visitors, filter]
  );

  const columns = useMemo<ColumnDef<Visitor, any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Visitor",
        cell: (c) => <span className="font-medium text-ink">{c.getValue()}</span>,
      },
      {
        accessorFn: (r) => unitLabel(r.unitId),
        id: "unit",
        header: "Unit",
        cell: (c) => <span className="numeric">{c.getValue()}</span>,
      },
      { accessorKey: "purpose", header: "Purpose" },
      {
        accessorKey: "plate",
        header: "Plate",
        cell: (c) => (
          <span className="numeric text-ink-muted">{c.getValue() || "—"}</span>
        ),
      },
      {
        accessorFn: (r) => r.checkInAt,
        id: "in",
        header: "Check-in",
        cell: (c) => <span className="numeric">{fmtTime(c.getValue())}</span>,
      },
      {
        accessorFn: (r) => r.checkOutAt,
        id: "out",
        header: "Check-out",
        cell: (c) => <span className="numeric">{fmtTime(c.getValue())}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (c) => (
          <StatusBadge label={c.getValue()} tone={statusTone(c.getValue())} />
        ),
      },
      {
        id: "action",
        header: "",
        enableSorting: false,
        cell: (c) =>
          c.row.original.status === "arrived" ? (
            <Button
              size="sm"
              variant="secondary"
              loading={
                checkOut.isPending && checkOut.variables === c.row.original.id
              }
              onClick={(e) => {
                e.stopPropagation();
                checkOut.mutate(c.row.original.id);
              }}
            >
              Check out
            </Button>
          ) : null,
      },
    ],
    [checkOut]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Visitor log"
        subtitle="All entries and exits."
        action={
          <div className="flex gap-2">
            <Link to="/guard/visitors/scan">
              <Button size="sm">
                <ScanLine className="h-4 w-4" />
                Scan QR
              </Button>
            </Link>
            <Link to="/guard/visitors/walk-in">
              <Button size="sm" variant="secondary">
                <UserPlus className="h-4 w-4" />
                Walk-in
              </Button>
            </Link>
          </div>
        }
      />

      {isLoading ? (
        <ListSkeleton rows={6} />
      ) : (
        <DataTable<Visitor>
          columns={columns}
          data={rows}
          searchPlaceholder="Search visitor, plate…"
          rowClassName={(v) =>
            v.blacklisted ? "border-l-2 border-l-alert" : undefined
          }
          toolbar={
            <FilterChips<Filter>
              chips={[
                { value: "all", label: "All" },
                { value: "expected", label: "Expected" },
                { value: "arrived", label: "Inside" },
                { value: "departed", label: "Departed" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          }
        />
      )}
    </div>
  );
}
