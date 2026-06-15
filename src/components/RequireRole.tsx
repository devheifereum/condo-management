import type { ReactNode } from "react";
import type { Role } from "@/types";
import { useAuth } from "@/lib/auth";
import { Redirect } from "./Redirect";

// Guards a subtree: redirects to /login when unauthenticated or wrong role.
export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  if (user.role !== role) {
    return <Redirect to={user.role === "resident" ? "/resident" : "/guard"} />;
  }
  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <>{children}</>;
}
