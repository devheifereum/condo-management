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
import { ManagerShell } from "@/components/shells/ManagerShell";

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
import { EForms } from "@/routes/resident/EForms";
import { MoveForm } from "@/routes/resident/MoveForm";
import { ParkingForm } from "@/routes/resident/ParkingForm";
import { EFormDetail } from "@/routes/resident/EFormDetail";

import { GuardDashboard } from "@/routes/guard/GuardDashboard";
import { ScanQR } from "@/routes/guard/ScanQR";
import { WalkIn } from "@/routes/guard/WalkIn";
import { VisitorLog } from "@/routes/guard/VisitorLog";
import { LogParcel } from "@/routes/guard/LogParcel";
import { ParcelLog } from "@/routes/guard/ParcelLog";
import { GuardForms } from "@/routes/guard/GuardForms";
import { GuardFormDetail } from "@/routes/guard/GuardFormDetail";

import { ManagerForms } from "@/routes/manager/ManagerForms";
import { ManagerFormDetail } from "@/routes/manager/ManagerFormDetail";

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
const residentForms = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/forms",
  component: EForms,
});
const residentFormMove = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/forms/new/move",
  component: MoveForm,
});
const residentFormParking = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/forms/new/parking",
  component: ParkingForm,
});
const residentFormDetail = createRoute({
  getParentRoute: () => residentLayout,
  path: "/resident/forms/$id",
  component: EFormDetail,
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
const guardForms = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/forms",
  component: GuardForms,
});
const guardFormDetail = createRoute({
  getParentRoute: () => guardLayout,
  path: "/guard/forms/$id",
  component: GuardFormDetail,
});

// ---- manager (management office) ----
const managerLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "manager-layout",
  component: ManagerShell,
});
const managerForms = createRoute({
  getParentRoute: () => managerLayout,
  path: "/manager",
  component: ManagerForms,
});
const managerFormDetail = createRoute({
  getParentRoute: () => managerLayout,
  path: "/manager/forms/$id",
  component: ManagerFormDetail,
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
    residentForms,
    residentFormMove,
    residentFormParking,
    residentFormDetail,
  ]),
  guardLayout.addChildren([
    guardDashboard,
    guardScan,
    guardWalkIn,
    guardVisitorLog,
    guardParcelNew,
    guardParcelLog,
    guardForms,
    guardFormDetail,
  ]),
  managerLayout.addChildren([managerForms, managerFormDetail]),
  unitTimeline,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
