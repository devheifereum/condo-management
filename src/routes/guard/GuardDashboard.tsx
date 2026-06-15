import { Link } from "@tanstack/react-router";
import {
  ScanLine,
  PackagePlus,
  UserPlus,
  ClipboardList,
  Boxes,
  LogIn,
} from "lucide-react";
import { useVisitors, useParcels, useCheckOut } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { unitLabel } from "@/mock/store";
import { fmtTime } from "@/lib/cn";

export function GuardDashboard() {
  const { data: visitors } = useVisitors();
  const { data: parcels } = useParcels();
  const checkOut = useCheckOut();

  const inside = (visitors ?? []).filter((v) => v.status === "arrived");
  const awaiting = (parcels ?? []).filter((p) => p.status === "awaiting").length;
  const today = new Date().toDateString();
  const loggedToday = (visitors ?? []).filter(
    (v) => v.checkInAt && new Date(v.checkInAt).toDateString() === today
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Guardhouse</h1>

      {/* stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Visitors inside now" value={inside.length} />
        <Stat label="Parcels awaiting collection" value={awaiting} />
        <Stat label="Visitors logged today" value={loggedToday} />
      </div>

      {/* primary actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link to="/guard/visitors/scan">
          <Button size="lg" fullWidth className="h-20 text-base">
            <ScanLine className="h-6 w-6" />
            Scan visitor QR
          </Button>
        </Link>
        <Link to="/guard/parcels/new">
          <Button size="lg" fullWidth className="h-20 text-base">
            <PackagePlus className="h-6 w-6" />
            Log parcel
          </Button>
        </Link>
      </div>

      {/* secondary actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SecondaryLink to="/guard/visitors/walk-in" icon={UserPlus} label="Log walk-in visitor" />
        <SecondaryLink to="/guard/visitors/log" icon={ClipboardList} label="Visitor log" />
        <SecondaryLink to="/guard/parcels/log" icon={Boxes} label="Parcel log" />
      </div>

      {/* currently inside */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-ink-muted">
          Currently inside
        </h2>
        {inside.length === 0 ? (
          <EmptyState
            icon={LogIn}
            title="No visitors inside"
            description="Checked-in visitors will appear here until they leave."
          />
        ) : (
          <Card className="divide-y divide-paper-line">
            {inside.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{v.name}</p>
                  <p className="text-xs text-ink-muted">
                    {unitLabel(v.unitId)} · in since {fmtTime(v.checkInAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={checkOut.isPending && checkOut.variables === v.id}
                  onClick={() => checkOut.mutate(v.id)}
                >
                  Check out
                </Button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="numeric text-3xl font-semibold text-brand">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </Card>
  );
}

function SecondaryLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof UserPlus;
  label: string;
}) {
  return (
    <Link to={to}>
      <Card className="flex items-center gap-3 p-4 transition-colors hover:border-brand/50">
        <Icon className="h-5 w-5 text-ink-muted" />
        <span className="text-sm text-ink">{label}</span>
      </Card>
    </Link>
  );
}
