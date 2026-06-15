import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUnitResidents } from "@/lib/queries";
import { unitLabel } from "@/mock/store";

export function ResidentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: residents } = useUnitResidents(user?.unitId ?? "");
  const me = residents?.find((r) => r.id === user?.id);

  return (
    <div className="space-y-5">
      <PageHeader title="Profile" />

      <Card className="divide-y divide-paper-line">
        <Row label="Name" value={user?.name ?? "—"} />
        <Row label="Unit" value={user?.unitId ? unitLabel(user.unitId) : "—"} />
        <Row label="Phone" value={me?.phone ?? "—"} />
        <Row label="Email" value={me?.email ?? "—"} />
      </Card>

      <Button
        variant="danger"
        fullWidth
        onClick={() => {
          logout();
          navigate({ to: "/login" });
        }}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
