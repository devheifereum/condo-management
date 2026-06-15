import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [value, setValue] = useState("");

  if (sent) {
    return (
      <AuthShell title="Check your messages">
        <div className="flex flex-col items-center py-4 text-center">
          <MailCheck className="h-12 w-12 text-brand" />
          <p className="mt-3 text-sm text-ink-muted">
            If an account exists for{" "}
            <span className="text-ink">{value}</span>, a reset link is on its
            way.
          </p>
          <Link to="/login" className="mt-5">
            <Button variant="secondary">Back to login</Button>
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll send you a reset link"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) setSent(true);
        }}
        className="space-y-4"
      >
        <Input
          label="Email or phone"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="demo@resident.com"
        />
        <Button type="submit" fullWidth size="lg" disabled={!value.trim()}>
          Send reset link
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-brand hover:text-brand-deep">
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
