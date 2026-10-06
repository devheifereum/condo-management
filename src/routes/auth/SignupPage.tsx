import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi, ApiError } from "@/lib/api";

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.register(email, password, fullName || undefined);
      // Register does not log the user in — it sends a verification email.
      // Route to the verify-email screen (as the mobile app does), flagging
      // that a link was just sent so the resend button starts on cooldown.
      toast.success("Account created — check your email to verify.");
      navigate({
        to: "/verify-email",
        state: { email, justSent: true } as never,
      });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register to link your unit and start managing your home."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:text-brand-deep font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          name="full_name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Min 8 characters, with an uppercase, a lowercase, and a digit."
        />
        {error && <p className="text-sm text-alert">{error}</p>}
        <Button type="submit" fullWidth loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
