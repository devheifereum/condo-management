import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useSubmitMoveForm } from "@/lib/queries";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { MoveDirection } from "@/types";

const timeSlots = [
  "09:00 – 12:00",
  "12:00 – 15:00",
  "15:00 – 18:00",
];
const vehicleTypes = ["Lorry", "Van", "Car", "Other"];

const req = ({ value }: { value: string }) => (!value ? "Required" : undefined);

export function MoveForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const submit = useSubmitMoveForm();
  const [direction, setDirection] = useState<MoveDirection>("move-in");
  const [agree, setAgree] = useState(false);

  const form = useForm({
    defaultValues: {
      residentName: user?.name ?? "",
      contactNo: "",
      moveDate: new Date(Date.now() + 3 * 24 * 3600_000)
        .toISOString()
        .slice(0, 10),
      timeSlot: timeSlots[0],
      movingCompany: "",
      vehicleType: vehicleTypes[0],
      vehiclePlate: "",
      itemsSummary: "",
    },
    onSubmit: async ({ value }) => {
      const created = await submit.mutateAsync({
        unitId: user!.unitId!,
        submittedById: user!.id,
        submittedByName: user!.name,
        data: {
          direction,
          residentName: value.residentName,
          contactNo: value.contactNo,
          moveDate: value.moveDate,
          timeSlot: value.timeSlot,
          movingCompany: value.movingCompany || undefined,
          vehicleType: value.vehicleType,
          vehiclePlate: value.vehiclePlate || undefined,
          itemsSummary: value.itemsSummary || undefined,
          agree,
        },
      });
      toast.success("Form submitted for review");
      navigate({ to: "/resident/forms/$id", params: { id: created.id } });
    },
  });

  return (
    <div className="space-y-5 pb-24 lg:pb-2">
      <BackLink to="/resident/forms" label="eForms" />
      <h1 className="text-2xl font-semibold text-ink">Move In / Move Out</h1>

      <form
        id="move-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <section className="space-y-2">
          <label className="block text-sm text-ink-muted">Request type</label>
          <SegmentedControl
            options={[
              { value: "move-in", label: "Move In" },
              { value: "move-out", label: "Move Out" },
            ]}
            value={direction}
            onChange={setDirection}
          />
        </section>

        <section className="space-y-4">
          <form.Field name="residentName" validators={{ onChange: req }}>
            {(field) => (
              <Input
                label="Resident name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? (field.state.meta.errors[0] as string)
                    : undefined
                }
              />
            )}
          </form.Field>

          <form.Field name="contactNo" validators={{ onChange: req }}>
            {(field) => (
              <Input
                label="Contact no."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="01x-xxxxxxx"
                error={
                  field.state.meta.isTouched
                    ? (field.state.meta.errors[0] as string)
                    : undefined
                }
              />
            )}
          </form.Field>

          <form.Field name="moveDate" validators={{ onChange: req }}>
            {(field) => (
              <Input
                label="Preferred move date"
                type="date"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="timeSlot">
            {(field) => (
              <div className="space-y-1.5">
                <label className="block text-sm text-ink-muted">
                  Time slot
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-paper-line bg-paper px-3 text-ink outline-none focus:border-brand"
                >
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="movingCompany">
            {(field) => (
              <Input
                label="Moving company (optional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="vehicleType">
            {(field) => (
              <div className="space-y-1.5">
                <label className="block text-sm text-ink-muted">
                  Vehicle type
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-paper-line bg-paper px-3 text-ink outline-none focus:border-brand"
                >
                  {vehicleTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="vehiclePlate">
            {(field) => (
              <Input
                label="Vehicle plate (optional)"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="WXY 1234"
              />
            )}
          </form.Field>

          <form.Field name="itemsSummary">
            {(field) => (
              <div className="space-y-1.5">
                <label className="block text-sm text-ink-muted">
                  Items summary (optional)
                </label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  placeholder="e.g. Sofa set, fridge, ~20 boxes"
                  className="w-full rounded-lg border border-paper-line bg-paper px-3 py-2 text-ink placeholder:text-ink-faint outline-none focus:border-brand"
                />
              </div>
            )}
          </form.Field>
        </section>

        <label className="flex items-start gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand"
          />
          <span>
            I agree to pay the move-in/out deposit and comply with the house
            rules & lift protection requirements.
          </span>
        </label>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-paper-line bg-paper/95 p-4 backdrop-blur lg:static lg:max-w-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="move-form"
              fullWidth
              size="lg"
              disabled={!canSubmit || !agree}
              loading={isSubmitting}
            >
              Submit for review
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
