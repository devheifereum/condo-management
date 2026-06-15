import type {
  AuthUser,
  Parcel,
  Resident,
  Unit,
  Visitor,
  VisitorPass,
  VisitorPurpose,
  PassType,
  Courier,
  ParcelSize,
} from "@/types";
import {
  seedGuards,
  seedParcels,
  seedPasses,
  seedResidents,
  seedUnits,
  seedVisitors,
} from "./data";

// Mutable in-memory tables (reset on full page reload).
const db = {
  units: structuredClone(seedUnits),
  residents: structuredClone(seedResidents),
  guards: structuredClone(seedGuards),
  visitors: structuredClone(seedVisitors),
  passes: structuredClone(seedPasses),
  parcels: structuredClone(seedParcels),
};

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const code = () => `VIS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// ---------------------------------------------------------------- auth
export async function login(
  identifier: string,
  password: string,
  role: "resident" | "guard"
): Promise<AuthUser> {
  await delay();
  const idf = identifier.trim().toLowerCase();
  if (role === "resident") {
    const r = db.residents.find(
      (x) => x.email.toLowerCase() === idf || x.phone === identifier.trim()
    );
    if (!r || r.password !== password) throw new Error("Invalid credentials");
    return { id: r.id, role: "resident", name: r.name, unitId: r.unitId };
  }
  const g = db.guards.find(
    (x) => x.email.toLowerCase() === idf || x.phone === identifier.trim()
  );
  if (!g || g.password !== password) throw new Error("Invalid credentials");
  return { id: g.id, role: "guard", name: g.name };
}

export interface SignupInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  block: string;
  floor: number;
  number: string;
}

export async function signup(input: SignupInput): Promise<AuthUser> {
  await delay();
  if (db.residents.some((r) => r.email.toLowerCase() === input.email.toLowerCase()))
    throw new Error("Email already registered");
  let unit = db.units.find((u) => u.number === input.number);
  if (!unit) {
    unit = {
      id: id("u"),
      block: input.block,
      floor: input.floor,
      number: input.number,
      residentIds: [],
    };
    db.units.push(unit);
  }
  const resident: Resident = {
    id: id("r"),
    name: input.name,
    phone: input.phone,
    email: input.email,
    unitId: unit.id,
    password: input.password,
  };
  db.residents.push(resident);
  unit.residentIds.push(resident.id);
  return { id: resident.id, role: "resident", name: resident.name, unitId: unit.id };
}

// ---------------------------------------------------------------- units
export async function listUnits(): Promise<Unit[]> {
  await delay(150);
  return structuredClone(db.units);
}

export async function getUnit(unitId: string): Promise<Unit | undefined> {
  await delay(150);
  return db.units.find((u) => u.id === unitId);
}

export function unitLabel(unitId: string): string {
  return db.units.find((u) => u.id === unitId)?.number ?? "—";
}

export async function residentsForUnit(unitId: string): Promise<Resident[]> {
  await delay(120);
  return db.residents.filter((r) => r.unitId === unitId);
}

export async function listResidents(): Promise<Resident[]> {
  await delay(150);
  return structuredClone(db.residents);
}

// ---------------------------------------------------------------- visitors
export async function listVisitors(filter?: {
  unitId?: string;
}): Promise<Visitor[]> {
  await delay();
  let rows = structuredClone(db.visitors);
  if (filter?.unitId) rows = rows.filter((v) => v.unitId === filter.unitId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getVisitor(visitorId: string): Promise<Visitor | undefined> {
  await delay(150);
  return db.visitors.find((v) => v.id === visitorId);
}

export async function getPassForVisitor(
  visitorId: string
): Promise<VisitorPass | undefined> {
  await delay(120);
  return db.passes.find((p) => p.visitorId === visitorId);
}

export async function getPassByCode(
  inputCode: string
): Promise<{ pass: VisitorPass; visitor: Visitor } | undefined> {
  await delay(250);
  const pass = db.passes.find(
    (p) => p.code.toLowerCase() === inputCode.trim().toLowerCase() ||
      p.qrValue.toLowerCase() === inputCode.trim().toLowerCase()
  );
  if (!pass) return undefined;
  const visitor = db.visitors.find((v) => v.id === pass.visitorId);
  if (!visitor) return undefined;
  return { pass, visitor };
}

export interface RegisterVisitorInput {
  name: string;
  phone: string;
  plate?: string;
  purpose: VisitorPurpose;
  visitAt: string;
  passType: PassType;
  recurringDays?: number[];
  unitId: string;
}

export async function registerVisitor(
  input: RegisterVisitorInput
): Promise<{ visitor: Visitor; pass: VisitorPass }> {
  await delay();
  const visitor: Visitor = {
    id: id("v"),
    name: input.name,
    phone: input.phone,
    plate: input.plate,
    purpose: input.purpose,
    unitId: input.unitId,
    status: "expected",
    blacklisted: false,
    createdAt: new Date().toISOString(),
    visitAt: input.visitAt,
  };
  const c = code();
  const validFrom = new Date().toISOString();
  const validTo =
    input.passType === "recurring"
      ? new Date(Date.now() + 30 * 24 * 3600_000).toISOString()
      : new Date(Date.now() + 12 * 3600_000).toISOString();
  const pass: VisitorPass = {
    id: id("p"),
    visitorId: visitor.id,
    type: input.passType,
    validFrom,
    validTo,
    code: c,
    qrValue: `PASS:${c}:${visitor.id}`,
    recurringDays: input.recurringDays,
  };
  db.visitors.push(visitor);
  db.passes.push(pass);
  return { visitor, pass };
}

export interface WalkInInput {
  name: string;
  phone: string;
  ic: string;
  plate?: string;
  purpose: VisitorPurpose;
  unitId: string;
}

export async function logWalkIn(input: WalkInInput): Promise<Visitor> {
  await delay();
  const visitor: Visitor = {
    id: id("v"),
    name: input.name,
    phone: input.phone,
    plate: input.plate,
    purpose: input.purpose,
    unitId: input.unitId,
    status: "arrived",
    blacklisted: isBlacklisted(input.name, input.plate),
    createdAt: new Date().toISOString(),
    visitAt: new Date().toISOString(),
    checkInAt: new Date().toISOString(),
  };
  db.visitors.push(visitor);
  return visitor;
}

export async function logEntry(visitorId: string): Promise<Visitor> {
  await delay(200);
  const v = db.visitors.find((x) => x.id === visitorId);
  if (!v) throw new Error("Visitor not found");
  v.status = "arrived";
  v.checkInAt = new Date().toISOString();
  return structuredClone(v);
}

export async function checkOut(visitorId: string): Promise<Visitor> {
  await delay(200);
  const v = db.visitors.find((x) => x.id === visitorId);
  if (!v) throw new Error("Visitor not found");
  v.status = "departed";
  v.checkOutAt = new Date().toISOString();
  return structuredClone(v);
}

export async function cancelPass(visitorId: string): Promise<void> {
  await delay(200);
  db.visitors = db.visitors.filter((v) => v.id !== visitorId);
  db.passes = db.passes.filter((p) => p.visitorId !== visitorId);
}

// crude blacklist check against existing flagged records
function isBlacklisted(name: string, plate?: string): boolean {
  return db.visitors.some(
    (v) =>
      v.blacklisted &&
      (v.name.toLowerCase() === name.toLowerCase() ||
        (!!plate && v.plate?.toLowerCase() === plate.toLowerCase()))
  );
}

export async function checkBlacklist(
  name: string,
  plate?: string
): Promise<boolean> {
  await delay(120);
  return isBlacklisted(name, plate);
}

// ---------------------------------------------------------------- parcels
export async function listParcels(filter?: {
  unitId?: string;
}): Promise<Parcel[]> {
  await delay();
  let rows = structuredClone(db.parcels);
  if (filter?.unitId) rows = rows.filter((p) => p.unitId === filter.unitId);
  return rows.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
}

export async function getParcel(parcelId: string): Promise<Parcel | undefined> {
  await delay(150);
  return db.parcels.find((p) => p.id === parcelId);
}

export interface LogParcelInput {
  trackingNo: string;
  unitId: string;
  courier?: Courier;
  size?: ParcelSize;
  loggedBy: string;
}

export async function logParcel(input: LogParcelInput): Promise<Parcel> {
  await delay();
  const parcel: Parcel = {
    id: id("pc"),
    trackingNo: input.trackingNo,
    unitId: input.unitId,
    courier: input.courier,
    size: input.size,
    status: "awaiting",
    loggedBy: input.loggedBy,
    loggedAt: new Date().toISOString(),
  };
  db.parcels.push(parcel);
  return parcel;
}

export interface CollectParcelInput {
  parcelId: string;
  collectedByName: string;
  signature: string;
}

export async function collectParcel(
  input: CollectParcelInput
): Promise<Parcel> {
  await delay();
  const p = db.parcels.find((x) => x.id === input.parcelId);
  if (!p) throw new Error("Parcel not found");
  p.status = "collected";
  p.collectedByName = input.collectedByName;
  p.signature = input.signature;
  p.collectedAt = new Date().toISOString();
  return structuredClone(p);
}
