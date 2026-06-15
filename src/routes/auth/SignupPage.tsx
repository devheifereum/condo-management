import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { signup } from "@/mock/store";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9+\-\s]{8,15}$/;

function strength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function SignupPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirm: "",
      block: "A",
      floor: "1",
      number: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const user = await signup({
          name: value.name,
          phone: value.phone,
          email: value.email,
          password: value.password,
          block: value.block,
          floor: Number(value.floor),
          number: value.number,
        });
        setDone(true);
        setTimeout(() => {
          setUser(user);
          navigate({ to: "/resident" });
        }, 1100);
      } catch (e) {
        toast.error((e as Error).message);
      }
    },
  });

  if (done) {
    return (
      <AuthShell title="Account created">
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-ok" />
          <p className="mt-3 text-ink">Welcome aboard — taking you in…</p>
        </div>
      </AuthShell>
    );
  }

  const fieldError = (m: { isTouched: boolean; errors: unknown[] }) =>
    m.isTouched ? (m.errors[0] as string) : undefined;

  return (
    <AuthShell title="Create account" subtitle="Residents only">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          validators={{ onChange: ({ value }) => (!value ? "Required" : undefined) }}
        >
          {(field) => (
            <Input
              label="Full name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) =>
              !value ? "Required" : !phoneRe.test(value) ? "Invalid phone" : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Phone"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
              placeholder="01X XXX XXXX"
            />
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value ? "Required" : !emailRe.test(value) ? "Invalid email" : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        {/* unit details */}
        <div className="grid grid-cols-3 gap-2">
          <form.Field name="block">
            {(field) => (
              <div className="space-y-1.5">
                <label className="block text-sm text-ink-muted">Block</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-paper-line bg-paper px-2 text-ink outline-none focus:border-brand"
                >
                  {["A", "B", "C"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="floor">
            {(field) => (
              <Input
                label="Floor"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field
            name="number"
            validators={{ onChange: ({ value }) => (!value ? "Required" : undefined) }}
          >
            {(field) => (
              <Input
                label="Unit no."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={fieldError(field.state.meta)}
                placeholder="A-12-3"
              />
            )}
          </form.Field>
        </div>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value ? "Required" : value.length < 8 ? "Min 8 characters" : undefined,
          }}
        >
          {(field) => {
            const s = strength(field.state.value);
            return (
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={fieldError(field.state.meta)}
                />
                {field.state.value && (
                  <div className="mt-1.5 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={
                          "h-1 flex-1 rounded-full " +
                          (i < s ? "bg-brand" : "bg-paper-line")
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field
          name="confirm"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) =>
              value !== fieldApi.form.getFieldValue("password")
                ? "Passwords do not match"
                : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Confirm password"
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={fieldError(field.state.meta)}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!canSubmit}
              loading={isSubmitting}
            >
              Create account
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand hover:text-brand-deep">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
