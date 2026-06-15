// Shared domain types for the condo management app.

export type Role = "resident" | "guard";

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
