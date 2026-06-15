import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Camera, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useLogWalkIn } from "@/lib/queries";
import { checkBlacklist } from "@/mock/store";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UnitKeypad } from "@/components/UnitKeypad";
import { BackLink } from "@/components/ui/BackLink";
import type { VisitorPurpose } from "@/types";

const purposes: VisitorPurpose[] = ["Guest", "Delivery", "Contractor", "Other"];

export function WalkIn() {
  const navigate = useNavigate();
  const walkIn = useLogWalkIn();
  const [unitId, setUnitId] = useState("");
  const [unitError, setUnitError] = useState<string>();
  const [photo, setPhoto] = useState(false);
  const [flagged, setFlagged] = useState(false);
  // mirror name/plate locally so the blacklist effect can react to them
  const [nameVal, setNameVal] = useState("");
  const [plateVal, setPlateVal] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      ic: "",
      plate: "",
      purpose: "Guest" as VisitorPurpose,
    },
    onSubmit: async ({ value }) => {
      if (!unitId) {
        setUnitError("Select the unit being visited");
        return;
      }
      await walkIn.mutateAsync({
        name: value.name,
        phone: value.phone,
        ic: value.ic,
        plate: value.plate || undefined,
        purpose: value.purpose,
        unitId,
      });
      toast.success("Walk-in logged");
      navigate({ to: "/guard" });
    },
  });

  // live blacklist check on name / plate
  useEffect(() => {
    let active = true;
    if (!nameVal && !plateVal) {
      setFlagged(false);
      return;
    }
    checkBlacklist(nameVal, plateVal || undefined).then((f) => {
      if (active) setFlagged(f);
    });
    return () => {
      active = false;
    };
  }, [nameVal, plateVal]);

  return (
    <div className="space-y-5">
      <BackLink to="/guard" label="Dashboard" />
      <PageHeader
        title="Log walk-in visitor"
        subtitle="For guests arriving without a pre-registered pass."
      />

      {flagged && (
        <div className="flex items-center gap-2 rounded-lg border border-alert/50 bg-alert/15 p-3 text-alert">
          <ShieldAlert className="h-5 w-5" />
          <p className="text-sm font-medium">
            This name or plate matches a blacklisted record.
          </p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Card className="space-y-4 p-5">
          <form.Field
            name="name"
            validators={{ onChange: ({ value }) => (!value ? "Required" : undefined) }}
          >
            {(field) => (
              <Input
                label="Visitor name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  setNameVal(e.target.value);
                }}
                error={field.state.meta.isTouched ? (field.state.meta.errors[0] as string) : undefined}
              />
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="phone"
              validators={{ onChange: ({ value }) => (!value ? "Required" : undefined) }}
            >
              {(field) => (
                <Input
                  label="Phone"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.isTouched ? (field.state.meta.errors[0] as string) : undefined}
                />
              )}
            </form.Field>
            <form.Field name="ic">
              {(field) => (
                <Input
                  label="IC number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="900101-14-5xxx"
                />
              )}
            </form.Field>
          </div>

          {/* photo capture placeholder */}
          <div className="space-y-1.5">
            <label className="block text-sm text-ink-muted">Visitor photo</label>
            <button
              type="button"
              onClick={() => setPhoto(true)}
              className="flex h-24 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-paper-line text-ink-muted hover:border-brand/50"
            >
              {photo ? (
                <div className="flex items-center gap-2 text-ok">
                  <div className="h-12 w-12 rounded-md bg-paper" />
                  <span className="text-sm">Photo captured</span>
                </div>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  <span className="text-sm">Capture photo</span>
                </>
              )}
            </button>
          </div>

          <form.Field name="plate">
            {(field) => (
              <Input
                label="Vehicle plate (optional)"
                value={field.state.value}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  setPlateVal(e.target.value);
                }}
                placeholder="WXY 1234"
              />
            )}
          </form.Field>

          <form.Field name="purpose">
            {(field) => (
              <div className="space-y-1.5">
                <label className="block text-sm text-ink-muted">Purpose</label>
                <select
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as VisitorPurpose)
                  }
                  className="h-10 w-full rounded-lg border border-paper-line bg-paper px-3 text-ink outline-none focus:border-brand"
                >
                  {purposes.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          </Card>

          {/* tap-friendly unit keypad (right on desktop, below on phone) */}
          <Card className="p-5 lg:sticky lg:top-20">
            <UnitKeypad
              value={unitId}
              onChange={(id) => {
                setUnitId(id);
                setUnitError(undefined);
              }}
              error={unitError}
              label="Unit being visited"
            />
          </Card>
        </div>

        <div className="mt-5 lg:max-w-[calc(100%-22rem-1.25rem)]">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={!canSubmit}
                loading={isSubmitting}
              >
                Log entry
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
