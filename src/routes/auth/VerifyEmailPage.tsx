import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { CheckCircle2, XCircle, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// Match the mobile app's resend cooldown (verify_email_screen.dart).
const RESEND_COOLDOWN_SECONDS = 180;

type Status = "pending" | "success" | "error";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  // The verification link lands here with `?token=`; arriving from signup /
  // an unverified login instead carries the email in router state (never in
  // the URL — it's personal data, matching the mobile app's choice).
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token ?? "";
  const location = useLocation();
  const navState = (location.state ?? {}) as {
    email?: string;
    justSent?: boolean;
  };

  // ── Token-consume mode state ──────────────────────────────────────────────
  const [status, setStatus] = useState<Status>("pending");
  const [message, setMessage] = useState<string>("");
  const ran = useRef(false);

  // ── Resend / awaiting-verification mode state ─────────────────────────────
  const [resendEmail, setResendEmail] = useState(navState.email ?? "");
  const [cooldown, setCooldown] = useState(
    navState.justSent ? RESEND_COOLDOWN_SECONDS : 0
  );
  const [resending, setResending] = useState(false);

  // Consume the token exactly once when present.
  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const t = await authApi.verifyEmail(token);
        setSession(t);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof ApiError ? err.message : "Invalid or expired token."
        );
      }
    })();
  }, [token, setSession]);

  // Tick down the resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function onResend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!resendEmail || cooldown > 0 || resending) return;
    setResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      toast.success("Verification link sent — check your inbox.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't resend. Try again."
      );
    } finally {
      setResending(false);
    }
  }

  // ── Token-consume mode UI ─────────────────────────────────────────────────
  if (token) {
    return (
      <AuthShell
        title={
          status === "success"
            ? "Email verified"
            : status === "error"
              ? "Verification failed"
              : "Verifying…"
        }
        subtitle={
          status === "success"
            ? "You're all set — welcome to MyUnitManager."
            : status === "error"
              ? message
              : "Just a moment while we confirm your email."
        }
        footer={
          status === "error" ? (
            <Link
              to="/login"
              className="text-brand hover:text-brand-deep font-medium"
            >
              Back to sign in
            </Link>
          ) : null
        }
      >
        <div className="flex flex-col items-center gap-4">
          {status === "pending" && (
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-ok" />
              <Button fullWidth onClick={() => navigate({ to: "/dashboard" })}>
                Continue to dashboard
              </Button>
            </>
          )}
          {status === "error" && <XCircle className="h-12 w-12 text-alert" />}
        </div>
      </AuthShell>
    );
  }

  // ── Resend / awaiting-verification mode UI ────────────────────────────────
  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        resendEmail
          ? `We've sent a verification link to ${resendEmail}. Click it to activate your account.`
          : "Enter your email to receive a new verification link."
      }
      footer={
        <>
          Already verified?{" "}
          <Link
            to="/login"
            className="text-brand hover:text-brand-deep font-medium"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onResend} className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-paper-tint border border-brand/20 p-4 text-sm text-brand-soft">
          <MailCheck className="h-5 w-5 shrink-0" />
          <span>Didn't arrive? Check spam, or resend below.</span>
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          loading={resending}
          disabled={cooldown > 0 || !resendEmail}
        >
          {cooldown > 0
            ? `Resend in ${formatCountdown(cooldown)}`
            : "Resend verification link"}
        </Button>
      </form>
    </AuthShell>
  );
}
