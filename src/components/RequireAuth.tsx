import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * Guards a subtree behind a valid session. Redirects to /login when the auth
 * check completes and no user is present.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}
