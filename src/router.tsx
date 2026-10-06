import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import { Redirect } from "@/components/Redirect";
import { RequireAuth } from "@/components/RequireAuth";

import { LoginPage } from "@/routes/auth/LoginPage";
import { SignupPage } from "@/routes/auth/SignupPage";
import { ForgotPasswordPage } from "@/routes/auth/ForgotPasswordPage";
import { VerifyEmailPage } from "@/routes/auth/VerifyEmailPage";
import { ResetPasswordPage } from "@/routes/auth/ResetPasswordPage";
import { DashboardPage } from "@/routes/DashboardPage";

// ── root ────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </>
  ),
});

// ── public ──────────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Redirect to="/dashboard" />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});
const forgotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});
const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: VerifyEmailPage,
});
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

// ── protected ───────────────────────────────────────────────────────────────
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotRoute,
  verifyEmailRoute,
  resetPasswordRoute,
  dashboardRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
