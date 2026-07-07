// Shared domain types for the condo management app.

export type Role = "resident" | "guard" | "manager";

export interface Unit {
  id: string;
  block: string;
  floor: number;
  number: string;
  residentIds: string[];
}

export interface Resident {
  id: string;
  name: string;
  phone: string;
  email: string;
  unitId: string;
  password: string;
}

export interface Guard {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  shiftStart: string; // ISO
}

// Management office staff — review & approve resident eForm submissions.
export interface Manager {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
}

export type VisitorStatus = "expected" | "arrived" | "departed";
export type VisitorPurpose = "Guest" | "Delivery" | "Contractor" | "Other";

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  plate?: string;
  purpose: VisitorPurpose;
  unitId: string;
  status: VisitorStatus;
  blacklisted: boolean;
  createdAt: string; // ISO
  visitAt: string; // ISO scheduled visit time
  checkInAt?: string;
  checkOutAt?: string;
}

export type PassType = "single" | "window" | "recurring";

export interface VisitorPass {
  id: string;
  visitorId: string;
  type: PassType;
  validFrom: string;
  validTo: string;
  code: string; // short human code, also embedded in qrValue
  qrValue: string;
  recurringDays?: number[]; // 0-6 when type === recurring
}

export type ParcelSize = "S" | "M" | "L";
export type ParcelStatus = "awaiting" | "collected";
export type Courier = "J&T" | "Shopee" | "Pos Laju" | "Ninja Van" | "Other";

export interface Parcel {
  id: string;
  trackingNo: string;
  unitId: string;
  courier?: Courier;
  size?: ParcelSize;
  status: ParcelStatus;
  loggedBy: string; // guard name
  loggedAt: string;
  collectedByName?: string;
  signature?: string; // data URL
  collectedAt?: string;
}

// Combined activity item for the per-unit timeline.
export interface ActivityItem {
  id: string;
  kind: "visitor" | "parcel";
  label: string;
  detail: string;
  status: string;
  tone: "brand" | "ok" | "alert" | "muted";
  at: string; // ISO
}

export interface AuthUser {
  id: string;
  role: Role;
  name: string;
  unitId?: string; // residents only
}

// ---------------------------------------------------------------- eForms
// Residents submit eForms; management officers review (approve/reject);
// guards can view them read-only.

export type EFormType = "move" | "parking";
export type EFormStatus = "pending" | "approved" | "rejected";

// Move In / Move Out form.
export type MoveDirection = "move-in" | "move-out";

export interface MoveFormData {
  direction: MoveDirection;
  residentName: string;
  contactNo: string;
  moveDate: string; // yyyy-mm-dd
  timeSlot: string; // e.g. "09:00 – 12:00"
  movingCompany?: string;
  vehicleType: string; // Lorry / Van / Car / Other
  vehiclePlate?: string;
  itemsSummary?: string; // brief description of furniture / boxes
  agree: boolean; // acknowledges deposit & house rules
}

// Car Parking Rental application form (based on the Danau Kota sample).
export interface ParkingFormData {
  fullName: string;
  icPassport: string;
  email: string;
  contactNo: string;
  vehicleMakeModel: string;
  vehicleColor: string;
  licensePlate: string;
  agree: boolean; // acknowledges T&C
}

// Filled in by a management officer during review.
export interface EFormReviewMeta {
  bayNo?: string; // parking bay assigned on approval
  level?: string; // parking level
  accessCardNo?: string;
}

interface EFormCommon {
  id: string;
  unitId: string;
  submittedById: string; // resident id
  submittedByName: string;
  status: EFormStatus;
  createdAt: string; // ISO
  reviewedAt?: string; // ISO
  reviewedByName?: string;
  reviewNote?: string;
  reviewMeta?: EFormReviewMeta;
}

export interface MoveForm extends EFormCommon {
  type: "move";
  data: MoveFormData;
}

export interface ParkingForm extends EFormCommon {
  type: "parking";
  data: ParkingFormData;
}

export type EFormSubmission = MoveForm | ParkingForm;

export const EFORM_LABELS: Record<EFormType, string> = {
  move: "Move In / Move Out",
  parking: "Car Parking Rental",
};

export const EFORM_STATUS_LABELS: Record<EFormStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};
