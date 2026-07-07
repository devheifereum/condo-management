import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Users, Package, User, Building2, LogOut, FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { unitLabel } from "@/mock/store";
import { RequireRole } from "@/components/RequireRole";

const tabs = [
  { to: "/resident", label: "Home", icon: Home, exact: true },
  { to: "/resident/visitors", label: "Visitors", icon: Users },
  { to: "/resident/parcels", label: "Parcels", icon: Package },
  { to: "/resident/forms", label: "eForms", icon: FileText },
  { to: "/resident/profile", label: "Profile", icon: User },
];

export function ResidentShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <RequireRole role="resident">
      <div className="flex min-h-screen bg-paper">
        {/* desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-paper-line bg-paper-raised p-4 lg:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold leading-tight text-ink">Kondo</p>
              <p className="numeric text-xs text-ink-faint">
                {user?.unitId ? unitLabel(user.unitId) : ""}
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {tabs.map((t) => {
              const active = isActive(t.to, t.exact);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/15 text-brand-soft"
                      : "text-ink-muted hover:bg-paper hover:text-ink"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </Link>
              );
            })}
          </nav>
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

        {/* main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* top bar (mobile-focused; hidden on desktop) */}
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-paper-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-ink">Kondo</span>
            </div>
            <span className="numeric rounded-full bg-paper-raised px-2.5 py-1 text-xs font-medium text-ink-muted shadow-card">
              {user?.unitId ? unitLabel(user.unitId) : ""}
            </span>
          </header>

          <main className="flex-1 px-4 py-5 pb-24 lg:px-8 lg:py-8 lg:pb-8">
            <div className="mx-auto w-full max-w-2xl">
              <Outlet />
            </div>
          </main>

          {/* mobile bottom tab bar */}
          <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-paper-line bg-paper-raised/95 backdrop-blur lg:hidden">
            <div className="grid grid-cols-5">
              {tabs.map((t) => {
                const active = isActive(t.to, t.exact);
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-xs",
                      active ? "text-brand-soft" : "text-ink-faint hover:text-ink-muted"
                    )}
                  >
                    <t.icon className="h-5 w-5" />
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </RequireRole>
  );
}
