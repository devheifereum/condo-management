import { useState } from "react";
import { ScanLine, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getPassByCode } from "@/mock/store";
import { useLogEntry } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BackLink } from "@/components/ui/BackLink";
import { unitLabel } from "@/mock/store";
import type { Visitor, VisitorPass } from "@/types";

type Result =
  | { state: "idle" }
  | { state: "invalid" }
  | { state: "valid"; visitor: Visitor; pass: VisitorPass };

export function ScanQR() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [checking, setChecking] = useState(false);
  const logEntry = useLogEntry();

  const verify = async (raw: string) => {
    if (!raw.trim()) return;
    setChecking(true);
    const found = await getPassByCode(raw);
    setChecking(false);
    if (!found) {
      setResult({ state: "invalid" });
      return;
    }
    const expired = new Date(found.pass.validTo).getTime() < Date.now();
    if (expired && found.visitor.status === "departed") {
      setResult({ state: "invalid" });
      return;
    }
    setResult({ state: "valid", visitor: found.visitor, pass: found.pass });
  };

  return (
    <div className="max-w-xl space-y-5">
      <BackLink to="/guard" label="Dashboard" />
      <PageHeader
        title="Scan visitor QR"
        subtitle="Point the camera at the pass, or enter the code."
      />

      {/* camera viewport (mock) */}
      <Card className="relative flex h-56 items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-8 rounded-xl border-2 border-brand/70" />
        <div className="absolute left-8 right-8 h-0.5 animate-pulse bg-brand/70" />
        <div className="flex flex-col items-center text-ink-faint">
          <ScanLine className="h-8 w-8" />
          <p className="mt-2 text-xs">Camera preview (demo)</p>
        </div>
      </Card>

      {/* manual entry */}
      <Card className="space-y-3 p-4">
        <Input
          label="Enter / paste pass code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="VIS-7F3K"
        />
        <div className="flex gap-2">
          <Button onClick={() => verify(code)} loading={checking} fullWidth>
            Verify
          </Button>
          <Button
            variant="secondary"
            onClick={() => verify("VIS-7F3K")}
            title="demo valid pass"
          >
            Demo
          </Button>
        </div>
      </Card>

      {/* result */}
      {result.state === "invalid" && (
        <div className="flex items-center gap-3 rounded-lg border border-alert/40 bg-alert/10 p-4 text-alert">
          <XCircle className="h-6 w-6" />
          <p className="font-medium">Invalid or expired pass</p>
        </div>
      )}

      {result.state === "valid" && (
        <Card className="space-y-4 p-5">
          {result.visitor.blacklisted && (
            <div className="flex items-center gap-2 rounded-lg border border-alert/50 bg-alert/15 p-3 text-alert">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-medium">
                Blacklisted visitor — do not allow entry without approval.
              </p>
            </div>
          )}
          <div
            className={
              "flex items-center gap-3 rounded-lg p-3 " +
              (result.visitor.blacklisted
                ? "bg-paper"
                : "bg-ok/10 text-ok")
            }
          >
            {!result.visitor.blacklisted && <CheckCircle2 className="h-6 w-6" />}
            <p className="font-semibold">
              {result.visitor.blacklisted ? "Pass valid — flagged" : "Valid — allow entry"}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <Row label="Visitor" value={result.visitor.name} />
            <Row label="Unit" value={unitLabel(result.visitor.unitId)} />
            <Row label="Purpose" value={result.visitor.purpose} />
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Status</span>
              <StatusBadge label={result.visitor.status} tone="brand" />
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            loading={logEntry.isPending}
            onClick={async () => {
              await logEntry.mutateAsync(result.visitor.id);
              toast.success(`Entry logged for ${result.visitor.name}`);
              setResult({ state: "idle" });
              setCode("");
            }}
          >
            Log entry
          </Button>
        </Card>
      )}
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
