import type {
  Guard,
  Parcel,
  Resident,
  Unit,
  Visitor,
  VisitorPass,
} from "@/types";

// ---- relative timestamps so the demo always looks "today" ----
const now = Date.now();
const h = (n: number) => new Date(now - n * 3600_000).toISOString();
const inH = (n: number) => new Date(now + n * 3600_000).toISOString();
const d = (n: number) => new Date(now - n * 24 * 3600_000).toISOString();

// A reusable fake signature (orange squiggle) shown on collected parcels.
const SIG =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='240'%20height='80'%3E%3Cpath%20d='M8%2055%20C%2028%2012,%2046%2070,%2066%2038%20S%20104%2012,%20126%2046%20S%20168%2062,%20196%2028'%20stroke='%23f97316'%20fill='none'%20stroke-width='2.5'%20stroke-linecap='round'/%3E%3C/svg%3E";

export const seedUnits: Unit[] = [
  { id: "u1", block: "A", floor: 12, number: "A-12-3", residentIds: ["r1", "r1b"] },
  { id: "u2", block: "A", floor: 8, number: "A-08-1", residentIds: ["r2"] },
  { id: "u3", block: "A", floor: 15, number: "A-15-7", residentIds: ["r3"] },
  { id: "u4", block: "A", floor: 3, number: "A-03-2", residentIds: ["r4"] },
  { id: "u5", block: "B", floor: 5, number: "B-05-7", residentIds: ["r5"] },
  { id: "u6", block: "B", floor: 15, number: "B-15-2", residentIds: ["r6"] },
  { id: "u7", block: "B", floor: 9, number: "B-09-4", residentIds: ["r7"] },
  { id: "u8", block: "B", floor: 20, number: "B-20-1", residentIds: ["r8"] },
  { id: "u9", block: "C", floor: 3, number: "C-03-9", residentIds: ["r9"] },
  { id: "u10", block: "C", floor: 20, number: "C-20-4", residentIds: ["r10"] },
  { id: "u11", block: "C", floor: 11, number: "C-11-6", residentIds: ["r11"] },
  { id: "u12", block: "D", floor: 7, number: "D-07-3", residentIds: ["r12"] },
];

export const seedResidents: Resident[] = [
  { id: "r1", name: "Irfan Ghapar", phone: "0124298385", email: "demo@resident.com", unitId: "u1", password: "password" },
  { id: "r1b", name: "Aisyah Ghapar", phone: "0124300001", email: "aisyah@resident.com", unitId: "u1", password: "password" },
  { id: "r2", name: "Siti Aminah", phone: "0129001122", email: "siti@resident.com", unitId: "u2", password: "password" },
  { id: "r3", name: "Lim Wei Jie", phone: "0163344556", email: "lim@resident.com", unitId: "u3", password: "password" },
  { id: "r4", name: "Raj Kumar", phone: "0177788990", email: "raj@resident.com", unitId: "u4", password: "password" },
  { id: "r5", name: "Nurul Huda", phone: "0192223344", email: "nurul@resident.com", unitId: "u5", password: "password" },
  { id: "r6", name: "Tan Mei Ling", phone: "0145556677", email: "tan@resident.com", unitId: "u6", password: "password" },
  { id: "r7", name: "Daniel Wong", phone: "0181234567", email: "daniel@resident.com", unitId: "u7", password: "password" },
  { id: "r8", name: "Farah Iskandar", phone: "0198887766", email: "farah@resident.com", unitId: "u8", password: "password" },
  { id: "r9", name: "Goh Boon Huat", phone: "0162345678", email: "goh@resident.com", unitId: "u9", password: "password" },
  { id: "r10", name: "Priya Nair", phone: "0173456789", email: "priya@resident.com", unitId: "u10", password: "password" },
  { id: "r11", name: "Hafiz Rahman", phone: "0194567890", email: "hafiz@resident.com", unitId: "u11", password: "password" },
  { id: "r12", name: "Cheng Xiao", phone: "0165678901", email: "cheng@resident.com", unitId: "u12", password: "password" },
];

export const seedGuards: Guard[] = [
  { id: "g1", name: "Encik Yusof", phone: "0112223333", email: "demo@guard.com", password: "password", shiftStart: h(3) },
  { id: "g2", name: "Encik Rosli", phone: "0112224444", email: "rosli@guard.com", password: "password", shiftStart: d(1) },
];

export const seedVisitors: Visitor[] = [
  // ---- Demo resident's unit (u1) — populates the resident screens ----
  { id: "v1", name: "Cousin Faiz", phone: "0195556666", plate: "JKL 4521", purpose: "Guest", unitId: "u1", status: "expected", blacklisted: false, createdAt: h(1), visitAt: inH(3) },
  { id: "v2", name: "Ahmad Razak", phone: "0181112222", plate: "WXY 1234", purpose: "Guest", unitId: "u1", status: "arrived", blacklisted: false, createdAt: h(5), visitAt: h(2), checkInAt: h(2) },
  { id: "v3", name: "Grab — Mr Lee", phone: "0183334444", plate: "VBA 9087", purpose: "Delivery", unitId: "u1", status: "departed", blacklisted: false, createdAt: h(8), visitAt: h(7), checkInAt: h(7), checkOutAt: h(6) },
  { id: "v4", name: "Cleaner Auntie May", phone: "0171239876", purpose: "Contractor", unitId: "u1", status: "expected", blacklisted: false, createdAt: h(2), visitAt: inH(20), },
  { id: "v5", name: "Lazada Rider", phone: "0188880000", plate: "BKT 7788", purpose: "Delivery", unitId: "u1", status: "departed", blacklisted: false, createdAt: d(1), visitAt: d(1), checkInAt: d(1), checkOutAt: d(1) },
  { id: "v6", name: "Uncle Tony", phone: "0192340987", plate: "PKL 1102", purpose: "Guest", unitId: "u1", status: "arrived", blacklisted: false, createdAt: h(3), visitAt: h(1), checkInAt: h(1) },

  // ---- Other units — populates the guard visitor log ----
  { id: "v7", name: "Aircon Technician", phone: "0177778888", purpose: "Contractor", unitId: "u2", status: "arrived", blacklisted: false, createdAt: h(4), visitAt: h(1), checkInAt: h(1) },
  { id: "v8", name: "Unknown Salesman", phone: "0166667777", plate: "PNG 2010", purpose: "Other", unitId: "u3", status: "expected", blacklisted: true, createdAt: h(2), visitAt: inH(1) },
  { id: "v9", name: "Food Panda", phone: "0188889999", purpose: "Delivery", unitId: "u4", status: "departed", blacklisted: false, createdAt: h(9), visitAt: h(9), checkInAt: h(9), checkOutAt: h(8) },
  { id: "v10", name: "James Tan", phone: "0181000200", plate: "WTF 3030", purpose: "Guest", unitId: "u5", status: "arrived", blacklisted: false, createdAt: h(6), visitAt: h(3), checkInAt: h(3) },
  { id: "v11", name: "Plumber Ravi", phone: "0173002001", purpose: "Contractor", unitId: "u6", status: "departed", blacklisted: false, createdAt: h(26), visitAt: h(26), checkInAt: h(26), checkOutAt: h(24) },
  { id: "v12", name: "Shopee Xpress", phone: "0189992211", plate: "JPN 5512", purpose: "Delivery", unitId: "u7", status: "arrived", blacklisted: false, createdAt: h(2), visitAt: h(1), checkInAt: h(1) },
  { id: "v13", name: "Mrs Kaur", phone: "0162224488", plate: "MEL 8080", purpose: "Guest", unitId: "u8", status: "expected", blacklisted: false, createdAt: h(1), visitAt: inH(5) },
  { id: "v14", name: "Repossessed Debtor", phone: "0160009999", plate: "BLK 6666", purpose: "Other", unitId: "u9", status: "expected", blacklisted: true, createdAt: h(3), visitAt: inH(2) },
  { id: "v15", name: "Birthday Caterer", phone: "0177712345", plate: "CAT 2024", purpose: "Contractor", unitId: "u10", status: "arrived", blacklisted: false, createdAt: h(5), visitAt: h(4), checkInAt: h(4) },
  { id: "v16", name: "DHL Courier", phone: "0188123456", plate: "DHL 1000", purpose: "Delivery", unitId: "u11", status: "departed", blacklisted: false, createdAt: h(28), visitAt: h(28), checkInAt: h(28), checkOutAt: h(27) },
  { id: "v17", name: "Estate Agent", phone: "0192345000", plate: "AGT 7001", purpose: "Other", unitId: "u12", status: "departed", blacklisted: false, createdAt: d(2), visitAt: d(2), checkInAt: d(2), checkOutAt: d(2) },
  { id: "v18", name: "Niece Sofea", phone: "0195550011", purpose: "Guest", unitId: "u2", status: "expected", blacklisted: false, createdAt: h(1), visitAt: inH(8) },
];

export const seedPasses: VisitorPass[] = [
  { id: "p1", visitorId: "v1", type: "single", validFrom: h(1), validTo: inH(6), code: "VIS-9XQ2", qrValue: "PASS:VIS-9XQ2:v1" },
  { id: "p2", visitorId: "v2", type: "single", validFrom: h(5), validTo: inH(3), code: "VIS-7F3K", qrValue: "PASS:VIS-7F3K:v2" },
  { id: "p3", visitorId: "v3", type: "single", validFrom: h(8), validTo: h(4), code: "VIS-2M8Q", qrValue: "PASS:VIS-2M8Q:v3" },
  { id: "p4", visitorId: "v4", type: "recurring", validFrom: h(2), validTo: inH(720), code: "VIS-CL77", qrValue: "PASS:VIS-CL77:v4", recurringDays: [1, 4] },
  { id: "p5", visitorId: "v5", type: "single", validFrom: d(1), validTo: d(1), code: "VIS-LZ31", qrValue: "PASS:VIS-LZ31:v5" },
  { id: "p6", visitorId: "v6", type: "window", validFrom: h(3), validTo: inH(4), code: "VIS-TNY8", qrValue: "PASS:VIS-TNY8:v6" },
  { id: "p8", visitorId: "v8", type: "single", validFrom: h(2), validTo: inH(2), code: "VIS-BAD1", qrValue: "PASS:VIS-BAD1:v8" },
  { id: "p13", visitorId: "v13", type: "window", validFrom: h(1), validTo: inH(6), code: "VIS-KAU5", qrValue: "PASS:VIS-KAU5:v13" },
  { id: "p18", visitorId: "v18", type: "single", validFrom: h(1), validTo: inH(10), code: "VIS-SOF2", qrValue: "PASS:VIS-SOF2:v18" },
];

export const seedParcels: Parcel[] = [
  // ---- Demo resident's unit (u1) ----
  { id: "pc1", trackingNo: "JT0098213471", unitId: "u1", courier: "J&T", size: "M", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(4) },
  { id: "pc2", trackingNo: "SPX774120093", unitId: "u1", courier: "Shopee", size: "S", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(1) },
  { id: "pc3", trackingNo: "NV5521008842", unitId: "u1", courier: "Ninja Van", size: "L", status: "awaiting", loggedBy: "Encik Rosli", loggedAt: h(9) },
  { id: "pc4", trackingNo: "POS1102934AB", unitId: "u1", courier: "Pos Laju", size: "S", status: "collected", loggedBy: "Encik Yusof", loggedAt: d(2), collectedByName: "Irfan Ghapar", collectedAt: d(2), signature: SIG },
  { id: "pc5", trackingNo: "JT0044112299", unitId: "u1", courier: "J&T", size: "M", status: "collected", loggedBy: "Encik Rosli", loggedAt: d(3), collectedByName: "Aisyah Ghapar", collectedAt: d(3), signature: SIG },

  // ---- Other units ----
  { id: "pc6", trackingNo: "NV5521117733", unitId: "u2", courier: "Ninja Van", size: "L", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(6) },
  { id: "pc7", trackingNo: "SPX889201337", unitId: "u5", courier: "Shopee", size: "S", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(2) },
  { id: "pc8", trackingNo: "JT0098771234", unitId: "u4", courier: "J&T", size: "M", status: "collected", loggedBy: "Encik Yusof", loggedAt: d(1), collectedByName: "Raj Kumar (helper)", collectedAt: d(1), signature: SIG },
  { id: "pc9", trackingNo: "DHL77120093MY", unitId: "u11", courier: "Other", size: "S", status: "collected", loggedBy: "Encik Rosli", loggedAt: d(1), collectedByName: "Hafiz Rahman", collectedAt: h(20), signature: SIG },
  { id: "pc10", trackingNo: "POS9981200ZZ", unitId: "u6", courier: "Pos Laju", size: "M", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(3) },
  { id: "pc11", trackingNo: "SPX120093774", unitId: "u8", courier: "Shopee", size: "L", status: "awaiting", loggedBy: "Encik Rosli", loggedAt: h(7) },
  { id: "pc12", trackingNo: "NV1200937745", unitId: "u10", courier: "Ninja Van", size: "S", status: "collected", loggedBy: "Encik Yusof", loggedAt: d(2), collectedByName: "Priya Nair", collectedAt: d(2), signature: SIG },
  { id: "pc13", trackingNo: "JT0011223344", unitId: "u3", courier: "J&T", size: "M", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(5) },
  { id: "pc14", trackingNo: "SPX556677889", unitId: "u7", courier: "Shopee", size: "S", status: "awaiting", loggedBy: "Encik Rosli", loggedAt: h(8) },
  { id: "pc15", trackingNo: "POS4455667788", unitId: "u12", courier: "Pos Laju", size: "L", status: "collected", loggedBy: "Encik Yusof", loggedAt: d(4), collectedByName: "Cheng Xiao", collectedAt: d(3), signature: SIG },
  { id: "pc16", trackingNo: "NV9988776655", unitId: "u9", courier: "Ninja Van", size: "M", status: "awaiting", loggedBy: "Encik Yusof", loggedAt: h(10) },
];
