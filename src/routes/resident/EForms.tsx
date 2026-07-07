import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Car, Truck, FileText, ChevronRight, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEForms } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { fmtDateTime } from "@/lib/cn";
import {
  EFORM_LABELS,
  EFORM_STATUS_LABELS,
  type EFormStatus,
} from "@/types";

type Filter = "all" | EFormStatus;

const newForms = [
  {
    to: "/resident/forms/new/move",
    label: "Move In / Move Out",
    desc: "Book your move & lift access",
    icon: Truck,
  },
  {
    to: "/resident/forms/new/parking",
    label: "Car Parking Rental",
    desc: "Apply for a monthly parking bay",
    icon: Car,
  },
] as const;

export function EForms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: forms, isLoading } = useEForms({
    submittedById: user?.id,
  });
  const [filter, setFilter] = useState<Filter>("all");

  const rows = (forms ?? []).filter(
    (f) => filter === "all" || f.status === filter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="eForms"
        subtitle="Submit management forms and track their status."
      />

      {/* start a new form */}
      <div className="grid gap-3 sm:grid-cols-2">
        {newForms.map((f) => (
          <Link key={f.to} to={f.to}>
            <Card className="flex h-full items-center gap-3 p-4 transition-colors hover:border-brand/50">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10">
                <f.icon className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{f.label}</p>
                <p className="text-xs text-ink-muted">{f.desc}</p>
              </div>
              <Plus className="h-4 w-4 text-ink-faint" />
            </Card>
          </Link>
        ))}
      </div>

      {/* my submissions */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-ink-muted">My submissions</h2>

        <FilterChips<Filter>
          chips={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          value={filter}
          onChange={setFilter}
        />

        {isLoading ? (
          <ListSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No submissions yet"
            description="Pick a form above to get started. Your submissions and their status will show up here."
          />
        ) : (
          <div className="space-y-2">
            {rows.map((f) => (
              <Card
                key={f.id}
                onClick={() =>
                  navigate({
                    to: "/resident/forms/$id",
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
                  <p className="numeric truncate text-xs text-ink-faint">
                    {fmtDateTime(f.createdAt)}
                  </p>
                </div>
                <StatusBadge
                  label={EFORM_STATUS_LABELS[f.status]}
                  tone={statusTone(f.status)}
                />
                <ChevronRight className="h-4 w-4 text-ink-faint" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
