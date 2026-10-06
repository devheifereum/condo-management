import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi, ApiError } from "@/lib/api";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token ?? "";

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    (async () => {
      try {
        await authApi.validateResetToken(token);
        setTokenValid(true);
      } catch {
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    })();
  }, [token]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (validating) {
    return (
      <AuthShell title="Checking link…" subtitle="One moment.">
        <div className="flex justify-center py-4 text-ink-muted text-sm">
          Please wait.
        </div>
      </AuthShell>
    );
  }

  if (!tokenValid) {
    return (
      <AuthShell
        title="Link no longer valid"
        subtitle="Your password-reset link has expired or already been used."
        footer={
          <Link to="/forgot-password" className="text-brand hover:text-brand-deep font-medium">
            Request a new link
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2">
          <XCircle className="h-12 w-12 text-alert" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose something strong you'll remember."
      footer={
        <Link to="/login" className="text-brand hover:text-brand-deep font-medium">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="New password"
          type="password"
          name="new_password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Min 8 chars, uppercase, lowercase, and a digit."
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm_password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="text-sm text-alert">{error}</p>}
        <Button type="submit" fullWidth loading={submitting}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
