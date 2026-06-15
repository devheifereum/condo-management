import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import { Redirect } from "@/components/Redirect";
import { RequireAuth } from "@/components/RequireRole";
import { ResidentShell } from "@/components/shells/ResidentShell";
import { GuardShell } from "@/components/shells/GuardShell";

import { LoginPage } from "@/routes/auth/LoginPage";
import { SignupPage } from "@/routes/auth/SignupPage";
import { ForgotPasswordPage } from "@/routes/auth/ForgotPasswordPage";

import { ResidentHome } from "@/routes/resident/ResidentHome";
import { MyVisitors } from "@/routes/resident/MyVisitors";
import { RegisterVisitor } from "@/routes/resident/RegisterVisitor";
import { PassDetail } from "@/routes/resident/PassDetail";
import { MyParcels } from "@/routes/resident/MyParcels";
import { CollectSign } from "@/routes/resident/CollectSign";
import { ResidentProfile } from "@/routes/resident/ResidentProfile";

import { GuardDashboard } from "@/routes/guard/GuardDashboard";
import { ScanQR } from "@/routes/guard/ScanQR";
import { WalkIn } from "@/routes/guard/WalkIn";
import { VisitorLog } from "@/routes/guard/VisitorLog";
import { LogParcel } from "@/routes/guard/LogParcel";
import { ParcelLog } from "@/routes/guard/ParcelLog";
import { UnitTimeline } from "@/routes/UnitTimeline";

// ---- root ----
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster theme="system" position="top-center" richColors closeButton />
    </>
  ),
});

// ---- public ----
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Redirect to="/login" />,
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

// ---- resident ----
const residentLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "resident-layout",
  component: ResidentShell,
});
const residentHome = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident",
  component: ResidentHome,
});
const residentVisitors = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/visitors",
  component: MyVisitors,
});
const residentVisitorNew = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/visitors/new",
  component: RegisterVisitor,
});
const residentVisitorDetail = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/visitors/$id",
  component: PassDetail,
});
const residentParcels = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/parcels",
  component: MyParcels,
});
const residentParcelCollect = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/parcels/$id/collect",
  component: CollectSign,
});
const residentProfile = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/profile",
  component: ResidentProfile,
});

// ---- guard ----
const guardLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "guard-layout",
  component: GuardShell,
});
const guardDashboard = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard",
  component: GuardDashboard,
});
const guardScan = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/visitors/scan",
  component: ScanQR,
});
const guardWalkIn = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/visitors/walk-in",
  component: WalkIn,
});
const guardVisitorLog = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/visitors/log",
  component: VisitorLog,
});
const guardParcelNew = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/parcels/new",
  component: LogParcel,
});
const guardParcelLog = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/parcels/log",
  component: ParcelLog,
});

// ---- shared unit timeline (any authed user) ----
const unitTimeline = createRoute({
  getParentRoute: () => rootRoute,
  path: "/unit/$id",
  component: () => (
    <RequireAuth>
      <div className="min-h-screen bg-paper">
        <UnitTimeline />
      </div>
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotRoute,
  residentLayout.addChildren([
    residentHome,
    residentVisitors,
    residentVisitorNew,
    residentVisitorDetail,
    residentParcels,
    residentParcelCollect,
    residentProfile,
  ]),
  guardLayout.addChildren([
    guardDashboard,
    guardScan,
    guardWalkIn,
    guardVisitorLog,
    guardParcelNew,
    guardParcelLog,
  ]),
  unitTimeline,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
