import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useAuth } from "@/lib/auth";
import { homeForRole } from "@/components/RequireRole";
import { login } from "@/mock/store";
import type { Role } from "@/types";

const DEMO: Record<Role, { identifier: string; password: string }> = {
  resident: { identifier: "demo@resident.com", password: "password" },
  guard: { identifier: "demo@guard.com", password: "password" },
  manager: { identifier: "demo@manager.com", password: "password" },
};

export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("resident");
  const [showPw, setShowPw] = useState(false);

  const form = useForm({
    // Pre-filled with demo credentials so you can just click "Log in".
    defaultValues: { ...DEMO.resident },
    onSubmit: async ({ value }) => {
      // fall back to the demo account for the selected role if left blank
      const identifier = value.identifier || DEMO[role].identifier;
      const password = value.password || DEMO[role].password;
      try {
        const user = await login(identifier, password, role);
        setUser(user);
        toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
        navigate({ to: homeForRole(user.role) });
      } catch {
        toast.error("Invalid credentials. Try the demo logins below.");
      }
    },
  });

  // Switch the prefilled credentials when the role toggle changes.
  const handleRoleChange = (r: Role) => {
    setRole(r);
    form.setFieldValue("identifier", DEMO[r].identifier);
    form.setFieldValue("password", DEMO[r].password);
  };

  return (
    <AuthShell title="Sign in" subtitle="Visitor & parcel management">
      <div className="mb-5 flex justify-center">
        <SegmentedControl
          options={[
            { value: "resident", label: "Resident" },
            { value: "guard", label: "Guard" },
            { value: "manager", label: "Manager" },
          ]}
          value={role}
          onChange={handleRoleChange}
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="identifier">
          {(field) => (
            <Input
              label="Email or phone"
              name="identifier"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched
                  ? (field.state.meta.errors[0] as string)
                  : undefined
              }
              placeholder="demo@resident.com"
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Input
              label="Password"
              name="password"
              type={showPw ? "text" : "password"}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched
                  ? (field.state.meta.errors[0] as string)
                  : undefined
              }
              placeholder="password"
              right={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="text-ink-faint hover:text-ink"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
              Log in
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="text-ink-muted hover:text-ink">
          Forgot password?
        </Link>
        <Link to="/signup" className="text-brand hover:text-brand-deep">
          Sign up
        </Link>
      </div>

      <div className="mt-5 rounded-lg bg-paper p-3 text-xs text-ink-faint">
        <p className="mb-1 font-medium text-ink-muted">Demo logins (password: password)</p>
        <p>Resident — demo@resident.com</p>
        <p>Guard — demo@guard.com</p>
        <p>Manager — demo@manager.com</p>
      </div>
    </AuthShell>
  );
}
