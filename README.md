# MyUnitManager — Web

React + TypeScript + Vite web app for the **MyUnitManager** platform (Malaysia-first condominium / apartment / strata management).

This is a fresh scaffold — currently it ships only the **authentication** slice wired to the Go backend at `../condo-backend`. Property, billing, visitor, facility and complaint screens will follow the phased plan in `../condo-backend/FEATURES_PLAN.md`.

## Stack

- **React 18** + **TypeScript** + **Vite 6**
- **TanStack Router** — file-less code-defined routing + protected routes
- **Tailwind CSS 3** — white background + orange (#F97316) brand theme
- **sonner** (toasts), **lucide-react** (icons)
- Native `fetch` API client in `src/lib/api.ts` — no external HTTP lib

## Run

```bash
npm install
npm run dev       # http://localhost:5180
npm run build     # typecheck + production build
npm run typecheck # tsc --noEmit
```

Configure the API base URL via `.env` (copy `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

## Structure

```
src/
├── main.tsx                     # bootstrap + providers
├── router.tsx                   # TanStack Router route tree
├── index.css                    # theme variables + Tailwind entry
├── lib/
│   ├── api.ts                   # fetch wrapper + authApi endpoints
│   ├── auth.tsx                 # AuthProvider + useAuth
│   └── cn.ts                    # tailwind-merge helper
├── components/
│   ├── AuthShell.tsx            # centered card layout for auth pages
│   ├── Logo.tsx                 # MyUnitManager wordmark + shield SVG
│   ├── RequireAuth.tsx          # guards protected routes
│   ├── Redirect.tsx             # <Redirect to="…" />
│   └── ui/                      # Button, Input, Card, Skeleton, StatusBadge, …
└── routes/
    ├── DashboardPage.tsx        # authenticated landing (placeholder)
    └── auth/
        ├── LoginPage.tsx
        ├── SignupPage.tsx
        ├── ForgotPasswordPage.tsx
        ├── ResetPasswordPage.tsx
        └── VerifyEmailPage.tsx
```

## Auth flow

1. `POST /api/v1/auth/register` → verification email sent
2. User clicks link → `/verify-email?token=…` → backend returns `TokenResponse`
3. Access + refresh tokens stored in `localStorage`; `AuthProvider` re-hydrates on reload from `sub` claim.
4. `AuthProvider` exposes `login`, `logout`, `refreshUser`, `setSession`.
5. `RequireAuth` guards the dashboard; unauthenticated users redirect to `/login`.

## Theme

CSS variables in `src/index.css` (fixed light theme for MVP). Primary brand: `--brand: 249 115 22` (`#F97316`, orange-500). Backgrounds default to white; `.auth-bg` adds subtle orange radial gradients on auth pages.
