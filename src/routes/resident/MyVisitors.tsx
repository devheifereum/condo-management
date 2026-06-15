import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Users, Car } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useVisitors } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { fmtDateTime } from "@/lib/cn";
import type { VisitorStatus } from "@/types";

type Filter = "all" | VisitorStatus;

export function MyVisitors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: visitors, isLoading } = useVisitors(user?.unitId);
  const [filter, setFilter] = useState<Filter>("all");

  const rows = (visitors ?? []).filter(
    (v) => filter === "all" || v.status === filter
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="My visitors"
        action={
          <Link to="/resident/visitors/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Register
            </Button>
          </Link>
        }
      />

      <FilterChips<Filter>
        chips={[
          { value: "all", label: "All" },
          { value: "expected", label: "Expected" },
          { value: "arrived", label: "Arrived" },
          { value: "departed", label: "Departed" },
        ]}
        value={filter}
        onChange={setFilter}
      />

      {isLoading ? (
        <ListSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No visitors yet"
          description="Register your first visitor to generate a QR pass."
          action={
            <Link to="/resident/visitors/new">
              <Button size="sm">Register visitor</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {rows.map((v) => (
            <Card
              key={v.id}
              onClick={() =>
                navigate({ to: "/resident/visitors/$id", params: { id: v.id } })
              }
              className="flex cursor-pointer items-center gap-3 p-3.5 hover:border-brand/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{v.name}</p>
                <p className="text-xs text-ink-muted">
                  {v.purpose} · {fmtDateTime(v.visitAt)}
                </p>
                {v.plate && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-faint">
                    <Car className="h-3 w-3" /> {v.plate}
                  </p>
                )}
              </div>
              <StatusBadge label={v.status} tone={statusTone(v.status)} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
