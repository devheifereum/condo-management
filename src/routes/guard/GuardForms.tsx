import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Car, Truck, FileText } from "lucide-react";
import { useEForms } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { fmtDateTime } from "@/lib/cn";
import { unitLabel } from "@/mock/store";
import {
  EFORM_LABELS,
  EFORM_STATUS_LABELS,
  type EFormStatus,
} from "@/types";

type Filter = "all" | EFormStatus;

export function GuardForms() {
  const navigate = useNavigate();
  const { data: forms, isLoading } = useEForms();
  const [filter, setFilter] = useState<Filter>("approved");

  const rows = (forms ?? []).filter(
    (f) => filter === "all" || f.status === filter
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="eForms"
        subtitle="Resident submissions (read-only). Approved parking & move requests to be aware of at the guardhouse."
      />

      <FilterChips<Filter>
        chips={[
          { value: "approved", label: "Approved" },
          { value: "pending", label: "Pending" },
          { value: "rejected", label: "Rejected" },
          { value: "all", label: "All" },
        ]}
        value={filter}
        onChange={setFilter}
      />

      {isLoading ? (
        <ListSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nothing here"
          description="No submissions match this filter."
        />
      ) : (
        <div className="space-y-2">
          {rows.map((f) => (
            <Card
              key={f.id}
              onClick={() =>
                navigate({
                  to: "/guard/forms/$id",
                  params: { id: f.id },
                })
              }
              className="flex cursor-pointer items-center gap-3 p-3.5 hover:border-brand/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper">
                {f.type === "parking" ? (
                  <Car className="h-5 w-5 text-ink-muted" />
                ) : (
                  <Truck className="h-5 w-5 text-ink-muted" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {EFORM_LABELS[f.type]}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {f.submittedByName} · Unit {unitLabel(f.unitId)} ·{" "}
                  <span className="numeric">{fmtDateTime(f.createdAt)}</span>
                </p>
              </div>
              <StatusBadge
                label={EFORM_STATUS_LABELS[f.status]}
                tone={statusTone(f.status)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
