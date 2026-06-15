import { useParams, useNavigate } from "@tanstack/react-router";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { useVisitor, usePass, useCancelPass } from "@/lib/queries";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, statusTone } from "@/components/ui/StatusBadge";
import { QRDisplay } from "@/components/QRDisplay";
import { BackLink } from "@/components/ui/BackLink";
import { Skeleton } from "@/components/ui/Skeleton";
import { unitLabel } from "@/mock/store";
import { fmtDateTime } from "@/lib/cn";

export function PassDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: visitor, isLoading } = useVisitor(id);
  const { data: pass } = usePass(id);
  const cancel = useCancelPass();

  if (isLoading || !visitor) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mx-auto h-64 w-64" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BackLink to="/resident/visitors" label="My visitors" />

      <Card className="flex flex-col items-center gap-4 p-6">
        {pass ? (
          <QRDisplay value={pass.qrValue} code={pass.code} />
        ) : (
          <p className="text-ink-muted">No pass found.</p>
        )}
        <div className="w-full space-y-2 text-sm">
          <Row label="Visitor" value={visitor.name} />
          <Row label="Unit" value={unitLabel(visitor.unitId)} />
          <Row label="Purpose" value={visitor.purpose} />
          {pass && (
            <Row
              label="Valid"
              value={`${fmtDateTime(pass.validFrom)} → ${fmtDateTime(pass.validTo)}`}
            />
          )}
          <Row
            label="Pass type"
            value={
              pass?.type === "single"
                ? "Single-use"
                : pass?.type === "window"
                ? "Time-windowed"
                : "Recurring"
            }
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-ink-muted">Status</span>
            <StatusBadge label={visitor.status} tone={statusTone(visitor.status)} />
          </div>
        </div>
      </Card>

      {(visitor.checkInAt || visitor.checkOutAt) && (
        <Card className="p-4">
          <p className="mb-3 text-sm font-medium text-ink-muted">Timeline</p>
          <ol className="space-y-3">
            {visitor.checkInAt && (
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-ok" />
                <span className="text-ink">Arrived</span>
                <span className="ml-auto text-ink-faint">
                  {fmtDateTime(visitor.checkInAt)}
                </span>
              </li>
            )}
            {visitor.checkOutAt && (
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-ok" />
                <span className="text-ink">Departed</span>
                <span className="ml-auto text-ink-faint">
                  {fmtDateTime(visitor.checkOutAt)}
                </span>
              </li>
            )}
          </ol>
        </Card>
      )}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            navigator.clipboard
              ?.writeText(pass?.qrValue ?? "")
              .catch(() => {});
            toast.success("Pass link copied");
          }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        {visitor.status === "expected" && (
          <Button
            variant="danger"
            fullWidth
            loading={cancel.isPending}
            onClick={async () => {
              await cancel.mutateAsync(visitor.id);
              toast.success("Pass cancelled");
              navigate({ to: "/resident/visitors" });
            }}
          >
            Cancel pass
          </Button>
        )}
      </div>
      <p className="text-center text-xs text-ink-faint">
        Logged in as {user?.name}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
