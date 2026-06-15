import { Link } from "@tanstack/react-router";
import { Users, Package, Plus, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useVisitors, useParcels } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { timeAgo } from "@/lib/cn";

export function ResidentHome() {
  const { user } = useAuth();
  const unitId = user?.unitId;
  const { data: visitors, isLoading: vLoading } = useVisitors(unitId);
  const { data: parcels, isLoading: pLoading } = useParcels(unitId);

  const today = new Date().toDateString();
  const visitorsToday = (visitors ?? []).filter(
    (v) =>
      v.status !== "departed" &&
      new Date(v.visitAt).toDateString() === today
  ).length;
  const awaiting = (parcels ?? []).filter((p) => p.status === "awaiting").length;

  const activity = [
    ...(visitors ?? []).map((v) => ({
      id: v.id,
      kind: "visitor" as const,
      label: v.name,
      sub: v.status,
      tone: statusTone(v.status),
      at: v.checkInAt ?? v.visitAt ?? v.createdAt,
    })),
    ...(parcels ?? []).map((p) => ({
      id: p.id,
      kind: "parcel" as const,
      label: `${p.courier ?? "Parcel"} · ${p.trackingNo}`,
      sub: p.status,
      tone: statusTone(p.status),
      at: p.collectedAt ?? p.loggedAt,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink-muted">Welcome back</p>
        <h1 className="text-2xl font-semibold text-ink">
          Hi, {user?.name.split(" ")[0]}
        </h1>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/resident/visitors">
          <Card className="p-4 transition-colors hover:border-brand/50">
            <Users className="h-5 w-5 text-brand" />
            <p className="mt-3 numeric text-3xl font-semibold text-ink">
              {vLoading ? "—" : visitorsToday}
            </p>
            <p className="text-sm text-ink-muted">Visitors today</p>
          </Card>
        </Link>
        <Link to="/resident/parcels">
          <Card className="p-4 transition-colors hover:border-brand/50">
            <Package className="h-5 w-5 text-brand" />
            <p className="mt-3 numeric text-3xl font-semibold text-ink">
              {pLoading ? "—" : awaiting}
            </p>
            <p className="text-sm text-ink-muted">Parcels waiting</p>
          </Card>
        </Link>
      </div>

      {/* quick actions */}
      <div className="flex gap-3">
        <Link to="/resident/visitors/new" className="flex-1">
          <Button fullWidth>
            <Plus className="h-4 w-4" />
            Register visitor
          </Button>
        </Link>
        <Link to="/resident/parcels" className="flex-1">
          <Button variant="secondary" fullWidth>
            View parcels
          </Button>
        </Link>
      </div>

      {/* recent activity */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-ink-muted">
          Recent activity
        </h2>
        {vLoading || pLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <Card className="divide-y divide-paper-line">
            {activity.map((a) => (
              <div key={a.kind + a.id} className="flex items-center gap-3 p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper">
                  {a.kind === "visitor" ? (
                    <Users className="h-4 w-4 text-ink-muted" />
                  ) : (
                    <Package className="h-4 w-4 text-ink-muted" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{a.label}</p>
                  <p className="text-xs text-ink-faint">{timeAgo(a.at)}</p>
                </div>
                <StatusBadge label={a.sub} tone={a.tone} />
              </div>
            ))}
          </Card>
        )}
      </div>

      <Link
        to="/unit/$id"
        params={{ id: unitId ?? "" }}
        className="flex items-center justify-center gap-1 text-sm text-ink-muted hover:text-brand"
      >
        View full unit timeline
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
