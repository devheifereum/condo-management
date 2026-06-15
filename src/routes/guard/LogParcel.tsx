import { useRef, useState } from "react";
import { ScanBarcode } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useLogParcel } from "@/lib/queries";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { UnitSearch } from "@/components/UnitSearch";
import { UnitKeypad } from "@/components/UnitKeypad";
import { BackLink } from "@/components/ui/BackLink";
import { unitLabel } from "@/mock/store";
import { cn } from "@/lib/cn";
import type { Courier, ParcelSize } from "@/types";

const couriers: Courier[] = ["J&T", "Shopee", "Pos Laju", "Ninja Van", "Other"];

export function LogParcel() {
  const { user } = useAuth();
  const logParcel = useLogParcel();
  const trackingRef = useRef<HTMLInputElement>(null);

  const [tracking, setTracking] = useState("");
  const [unitId, setUnitId] = useState("");
  const [courier, setCourier] = useState<Courier | undefined>();
  const [size, setSize] = useState<ParcelSize>("M");
  const [errors, setErrors] = useState<{ tracking?: string; unit?: string }>({});

  const reset = () => {
    setTracking("");
    setUnitId("");
    setCourier(undefined);
    setSize("M");
    setErrors({});
    trackingRef.current?.focus();
  };

  const submit = async () => {
    const e: typeof errors = {};
    if (!tracking.trim()) e.tracking = "Scan or enter the tracking number";
    if (!unitId) e.unit = "Select the recipient unit";
    setErrors(e);
    if (Object.keys(e).length) return;

    await logParcel.mutateAsync({
      trackingNo: tracking.trim(),
      unitId,
      courier,
      size,
      loggedBy: user?.name ?? "Guard",
    });
    toast.success(`Parcel logged for ${unitLabel(unitId)}`);
    reset();
  };

  return (
    <div className="space-y-5">
      <BackLink to="/guard" label="Dashboard" />
      <PageHeader
        title="Log parcel"
        subtitle="Scan the barcode and pick the unit — under 5 seconds."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* details */}
        <Card className="space-y-5 p-5">
          <Input
            ref={trackingRef}
            autoFocus
            label="Tracking number"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            error={errors.tracking}
            placeholder="Scan or type…"
            className="h-12 text-lg numeric"
            right={
              <button
                type="button"
                onClick={() => trackingRef.current?.focus()}
                className="text-brand hover:text-brand-deep"
                title="Scan barcode"
              >
                <ScanBarcode className="h-5 w-5" />
              </button>
            }
          />

          {/* compact text search for those who prefer typing */}
          <UnitSearch
            value={unitId}
            onChange={(id) => {
              setUnitId(id);
              setErrors((p) => ({ ...p, unit: undefined }));
            }}
            error={errors.unit}
            label="Recipient unit"
          />

          <div className="space-y-2">
            <label className="block text-sm text-ink-muted">Courier</label>
            <div className="flex flex-wrap gap-2">
              {couriers.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCourier(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    courier === c
                      ? "border-brand bg-brand text-white"
                      : "border-paper-line text-ink-muted hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-ink-muted">Size</label>
            <SegmentedControl
              options={[
                { value: "S", label: "S" },
                { value: "M", label: "M" },
                { value: "L", label: "L" },
              ]}
              value={size}
              onChange={setSize}
            />
          </div>
        </Card>

        {/* tap-friendly unit keypad (right on desktop, below on phone) */}
        <Card className="p-5 lg:sticky lg:top-20">
          <UnitKeypad
            value={unitId}
            onChange={(id) => {
              setUnitId(id);
              setErrors((p) => ({ ...p, unit: undefined }));
            }}
            error={errors.unit}
          />
        </Card>
      </div>

      <div className="lg:max-w-[calc(100%-22rem-1.25rem)]">
        <Button
          fullWidth
          size="lg"
          loading={logParcel.isPending}
          onClick={submit}
        >
          Save parcel
        </Button>
        <p className="mt-2 text-center text-xs text-ink-faint">
          Logging as {user?.name} · {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
