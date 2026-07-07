import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ClipboardCheck, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { RequireRole } from "@/components/RequireRole";

const nav = [
  {
    to: "/manager",
    label: "eForm reviews",
    icon: ClipboardCheck,
    match: "/manager",
  },
];

export function ManagerShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (match: string) => pathname.startsWith(match);

  return (
    <RequireRole role="manager">
      <div className="flex min-h-screen bg-paper">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-paper-line bg-paper-raised p-4 sm:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold leading-tight text-ink">Kondo</p>
              <p className="text-xs text-ink-faint">Management office</p>
            </div>
          </div>

          <nav className="space-y-1">
            {nav.map((n) => {
              const active = isActive(n.match);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/15 text-brand"
                      : "text-ink-muted hover:bg-paper hover:text-ink"
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />
          <button
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-paper hover:text-alert"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </aside>

        {/* main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-paper-line bg-paper/95 px-6 py-3 backdrop-blur">
            <div className="flex items-center gap-2 sm:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-ink">Kondo</span>
            </div>
            <div className="text-sm text-ink-muted">
              Management office ·{" "}
              <span className="font-medium text-ink">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="text-ink-muted hover:text-alert sm:hidden"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </header>
          <main className="flex-1 px-5 py-6 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </RequireRole>
  );
}
