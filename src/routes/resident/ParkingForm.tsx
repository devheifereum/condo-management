import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useSubmitParkingForm } from "@/lib/queries";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackLink } from "@/components/ui/BackLink";
import { Card } from "@/components/ui/Card";

const req = ({ value }: { value: string }) => (!value ? "Required" : undefined);

export function ParkingForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const submit = useSubmitParkingForm();
  const [agree, setAgree] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: user?.name ?? "",
      icPassport: "",
      email: "",
      contactNo: "",
      vehicleMakeModel: "",
      vehicleColor: "",
      licensePlate: "",
    },
    onSubmit: async ({ value }) => {
      const created = await submit.mutateAsync({
        unitId: user!.unitId!,
        submittedById: user!.id,
        submittedByName: user!.name,
        data: {
          fullName: value.fullName,
          icPassport: value.icPassport,
          email: value.email,
          contactNo: value.contactNo,
          vehicleMakeModel: value.vehicleMakeModel,
          vehicleColor: value.vehicleColor,
          licensePlate: value.licensePlate,
          agree,
        },
      });
      toast.success("Application submitted for review");
      navigate({ to: "/resident/forms/$id", params: { id: created.id } });
    },
  });

  const field = (
    name:
      | "fullName"
      | "icPassport"
      | "email"
      | "contactNo"
      | "vehicleMakeModel"
      | "vehicleColor"
      | "licensePlate",
    label: string,
    opts?: { type?: string; placeholder?: string }
  ) => (
    <form.Field name={name} validators={{ onChange: req }}>
      {(f) => (
        <Input
          label={label}
          type={opts?.type}
          placeholder={opts?.placeholder}
          value={f.state.value}
          onBlur={f.handleBlur}
          onChange={(e) => f.handleChange(e.target.value)}
          error={
            f.state.meta.isTouched
              ? (f.state.meta.errors[0] as string)
              : undefined
          }
        />
      )}
    </form.Field>
  );

  return (
    <div className="space-y-5 pb-24 lg:pb-2">
      <BackLink to="/resident/forms" label="eForms" />
      <h1 className="text-2xl font-semibold text-ink">
        Car Parking Rental Application
      </h1>

      <Card className="bg-brand/5 p-3 text-sm text-ink-muted">
        Monthly rental fee is <span className="font-medium text-ink">RM150.00</span>{" "}
        per bay. Applications are processed by draw. The parking space is only
        confirmed once payment is made.
      </Card>

      <form
        id="parking-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-ink-muted">
            Owner's information
          </h2>
          {field("fullName", "Full name")}
          {field("icPassport", "IC / Passport no.")}
          {field("email", "Email address", { type: "email" })}
          {field("contactNo", "Contact no.", { placeholder: "01x-xxxxxxx" })}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-medium text-ink-muted">
            Vehicle information
          </h2>
          {field("vehicleMakeModel", "Make & model", {
            placeholder: "Perodua Viva",
          })}
          {field("vehicleColor", "Color", { placeholder: "Grey" })}
          {field("licensePlate", "License plate no.", {
            placeholder: "PLE 554",
          })}
        </section>

        <label className="flex items-start gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand"
          />
          <span>
            I acknowledge that I have read and agree to the parking rental terms
            & conditions, including the no-subletting rule and the 12-month
            rental term.
          </span>
        </label>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-paper-line bg-paper/95 p-4 backdrop-blur lg:static lg:max-w-none lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              form="parking-form"
              fullWidth
              size="lg"
              disabled={!canSubmit || !agree}
              loading={isSubmitting}
            >
              Submit application
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
