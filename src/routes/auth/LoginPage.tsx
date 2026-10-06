import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { ApiError, EMAIL_NOT_VERIFIED_CODE } from "@/lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err) {
      // Account exists but the email isn't verified yet — send them to the
      // verify-email screen so they can resend the link (mirrors the mobile
      // app's EmailNotVerifiedException handling).
      if (err instanceof ApiError && err.code === EMAIL_NOT_VERIFIED_CODE) {
        toast.info("Please verify your email to continue.");
        navigate({
          to: "/verify-email",
          state: { email, justSent: false } as never,
        });
        return;
      }
      const msg =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Manage your building, your way."
      footer={
        <>
          New here?{" "}
          <Link
            to="/signup"
            className="text-brand hover:text-brand-deep font-medium"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-alert">{error}</p>}
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-ink-muted hover:text-brand"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
