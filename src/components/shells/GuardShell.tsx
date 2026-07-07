import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Building2,
  Clock,
  ScanLine,
  PackagePlus,
  UserPlus,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { fmtTime } from "@/lib/cn";
import { RequireRole } from "@/components/RequireRole";

const nav = [
  { to: "/guard", label: "Dashboard", icon: LayoutDashboard, match: "/guard", exact: true },
  { to: "/guard/visitors/log", label: "Visitors", icon: Users, match: "/guard/visitors" },
  { to: "/guard/parcels/log", label: "Parcels", icon: Package, match: "/guard/parcels" },
  { to: "/guard/forms", label: "eForms", icon: FileText, match: "/guard/forms" },
];

const quick = [
  { to: "/guard/visitors/scan", label: "Scan QR", icon: ScanLine },
  { to: "/guard/parcels/new", label: "Log parcel", icon: PackagePlus },
  { to: "/guard/visitors/walk-in", label: "Walk-in", icon: UserPlus },
];

export function GuardShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const shiftStart = new Date(Date.now() - 3 * 3600_000).toISOString();

  const isActive = (match: string, exact?: boolean) =>
    exact ? pathname === match : pathname.startsWith(match);

  return (
    <RequireRole role="guard">
      <div className="flex min-h-screen bg-paper">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-paper-line bg-paper-raised p-4 sm:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold leading-tight text-ink">Kondo</p>
              <p className="text-xs text-ink-faint">Guardhouse</p>
            </div>
          </div>

          <nav className="space-y-1">
            {nav.map((n) => {
              const active = isActive(n.match, n.exact);
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

          <p className="mt-6 mb-2 px-3 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Quick actions
          </p>
          <nav className="space-y-1">
            {quick.map((n) => {
              const active = pathname === n.to;
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
            <div className="hidden text-sm text-ink-muted sm:block">
              On duty: <span className="font-medium text-ink">{user?.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink-muted">
              <Clock className="h-4 w-4 text-brand" />
              <span className="numeric">Shift since {fmtTime(shiftStart)}</span>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 pb-24 sm:px-8 sm:pb-6">
            <div className="mx-auto max-w-5xl">
              <Outlet />
            </div>
          </main>

          {/* mobile bottom nav */}
          <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-paper-line bg-paper-raised/95 backdrop-blur sm:hidden">
            {nav.map((n) => {
              const active = isActive(n.match, n.exact);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-xs",
                    active ? "text-brand" : "text-ink-faint"
                  )}
                >
                  <n.icon className="h-5 w-5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </RequireRole>
  );
}
