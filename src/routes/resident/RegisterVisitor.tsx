import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useRegisterVisitor } from "@/lib/queries";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { PassType, VisitorPurpose } from "@/types";

const purposes: VisitorPurpose[] = ["Guest", "Delivery", "Contractor", "Other"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function RegisterVisitor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const register = useRegisterVisitor();
  const [passType, setPassType] = useState<PassType>("single");
  const [recurringDays, setRecurringDays] = useState<number[]>([]);

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      plate: "",
      purpose: "Guest" as VisitorPurpose,
      visitAt: new Date(Date.now() + 3600_000).toISOString().slice(0, 16),
    },
    onSubmit: async ({ value }) => {
      const { visitor } = await register.mutateAsync({
        name: value.name,
        phone: value.phone,
        plate: value.plate || undefined,
        purpose: value.purpose,
        visitAt: new Date(value.visitAt).toISOString(),
        passType,
        recurringDays: passType === "recurring" ? recurringDays : undefined,
        unitId: user!.unitId!,
      });
      toast.success("Pass generated");
      navigate({ to: "/resident/visitors/$id", params: { id: visitor.id } });
    },
  });

  const toggleDay = (d: number) =>
    setRecurringDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  return (
    <div className="space-y-5 pb-24 lg:pb-2">
      <BackLink to="/resident/visitors" label="My visitors" />
      <h1 className="text-2xl font-semibold text-ink">Register visitor</h1>

      <form
        id="register-visitor"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <section className="space-y-4">
          <form.Field
            name="name"
            validators={{ onChange: ({ value }) => (!value ? "Required" : undefined) }}
          >
            {(field) => (
              <Input
                label="Visitor name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched ? (field.state.meta.errors[0] as string) : undefined}
              />
            )}
          </form.Field>

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

          <form.Field name="plate">
            {(field) => (
              <Input
                label="Vehicle plate (optional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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

          <form.Field name="visitAt">
            {(field) => (
              <Input
                label="Visit date & time"
                type="datetime-local"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </section>

        {/* pass type */}
        <section className="space-y-2">
          <label className="block text-sm text-ink-muted">Pass type</label>
          <SegmentedControl
            options={[
              { value: "single", label: "Single-use" },
              { value: "window", label: "Time-windowed" },
              { value: "recurring", label: "Recurring" },
            ]}
            value={passType}
            onChange={setPassType}
          />
          {passType === "recurring" && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {dayNames.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={
                    "h-9 w-11 rounded-lg border text-xs font-medium " +
                    (recurringDays.includes(i)
                      ? "border-brand bg-brand text-white"
                      : "border-paper-line text-ink-muted")
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </section>
      </form>

      {/* sticky submit on mobile, inline on desktop */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-paper-line bg-paper/95 p-4 backdrop-blur lg:static lg:max-w-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="register-visitor"
              fullWidth
              size="lg"
              disabled={!canSubmit}
              loading={isSubmitting}
            >
              Generate pass
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
