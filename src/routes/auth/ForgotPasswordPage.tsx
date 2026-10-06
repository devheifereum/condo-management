import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi, ApiError } from "@/lib/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`If an account exists for ${email}, a password-reset link is on the way.`}
        footer={
          <Link to="/login" className="text-brand hover:text-brand-deep font-medium">
            Back to sign in
          </Link>
        }
      >
        <div className="flex items-center gap-3 rounded-lg bg-paper-tint border border-brand/20 p-4 text-sm text-brand-soft">
          <MailCheck className="h-5 w-5 shrink-0" />
          <span>The link expires in 1 hour.</span>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="text-brand hover:text-brand-deep font-medium">
          Back to sign in
        </Link>
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
        {error && <p className="text-sm text-alert">{error}</p>}
        <Button type="submit" fullWidth loading={submitting}>
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
