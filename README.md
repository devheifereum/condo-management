# Kondo — Condo Management (Visitor + Parcel)

Frontend UI for a condo management app with two features — **Visitor Management** and
**Parcel Management** — on a shared resident/unit foundation. Clickable UI with a typed
in-memory mock layer (no backend). Built with React + TypeScript and the TanStack suite.

## Stack

- **React 18 + TypeScript + Vite**
- **TanStack Router** — routing + role-based route protection
- **TanStack Query** — all reads/writes against the mock store
- **TanStack Table** — visitor and parcel logs
- **TanStack Form** — login, sign up, visitor registration, walk-in
- **Tailwind CSS** — black & orange theme
- `qrcode.react` (passes), `sonner` (toasts), `lucide-react` (icons)

## Run

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # typecheck + production build
```

## Demo logins (password: `password`)

- **Resident** — `demo@resident.com` (Irfan, unit A-12-3)
- **Guard** — `demo@guard.com`

Use the Resident / Guard toggle on the login screen.

## What to try

- **Resident:** register a visitor → get a QR pass; open an awaiting parcel → sign to collect.
- **Guard:** Scan QR (press **Demo** to load a valid pass) → Log entry; Log parcel
  (scan → unit → save, form re-focuses for the next one); Visitor / Parcel logs with
  search, sort, filters; click a parcel row for the detail drawer + signature.
- **Shared:** per-unit timeline mixing visitor + parcel events.

## Notes

- State is in-memory and resets on full page reload (by design — no real backend).
- Auth is not persisted; a reload returns you to the login screen.
- A blacklisted visitor (`Unknown Salesman`, plate `PNG 2010`) is seeded to demo alerts.
