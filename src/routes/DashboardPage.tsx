import { Building2, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  const displayName =
    user?.full_name ?? user?.display_name ?? user?.email ?? "there";
  const primaryRole = user?.roles[0] ?? "UNIT_OWNER";

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-paper-line bg-paper-raised">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
          <Logo size={40} />
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-deep p-8 text-white shadow-card">
          <h1 className="text-2xl font-semibold">
            Hi {displayName}
          </h1>
          <p className="mt-1 text-white/90">
            Signed in as <span className="font-medium">{primaryRole}</span>.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-paper-raised border border-paper-line p-8 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-paper-tint p-3">
              <Building2 className="h-6 w-6 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                Nothing here yet
              </h2>
              <p className="text-sm text-ink-muted">
                Property linking, bills, visitors, facility booking and
                complaints will land here in the next phase.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
