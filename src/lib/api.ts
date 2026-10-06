/**
 * Thin fetch wrapper for the MyUnitManager REST API.
 *
 * Responses use the standard envelope:
 *   success → { data: T }
 *   error   → { error_code: number, message: string }
 *
 * `apiFetch` throws an `ApiError` on non-2xx or on envelope-error responses,
 * and returns the unwrapped `data` payload on success.
 */

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080";

const TOKEN_KEY = "muam.access_token";
const REFRESH_KEY = "muam.refresh_token";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}
export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/**
 * App-level error code returned by `POST /auth/login` when the account exists
 * but its email hasn't been verified yet (HTTP 403). Mirrors the backend's
 * `dto.ErrCodeEmailNotVerified` and the mobile app's `kEmailNotVerifiedCode`.
 */
export const EMAIL_NOT_VERIFIED_CODE = 1001;

export class ApiError extends Error {
  status: number;
  code?: number;
  constructor(message: string, status: number, code?: number) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface Envelope<T> {
  data?: T;
  error_code?: number;
  message?: string;
}

interface Options {
  method?: Method;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = "GET", body, auth = false, headers = {} } = opts;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return undefined as T;

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await res.json()) as Envelope<T>;
  } catch {
    // no body
  }

  if (!res.ok || (envelope && envelope.error_code !== undefined)) {
    const msg =
      envelope?.message || res.statusText || `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, envelope?.error_code);
  }

  // Successful envelope — return `data` if present, else empty object.
  return (envelope?.data ?? (undefined as unknown)) as T;
}

// ─── Auth-domain shapes ──────────────────────────────────────────────────────

export interface UserPublic {
  id: string;
  email: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  phone: string | null;
  country: string | null;
  email_verified: boolean;
  email_verified_at: string | null;
  is_active: boolean;
  verification_level:
    | "unverified"
    | "email_verified"
    | "phone_verified"
    | "id_verified";
  two_factor_enabled: boolean;
  api_access: boolean;
  roles: string[];
  last_sign_in_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserPublic;
}

export interface MessageWithUserResponse {
  message: string;
  user: UserPublic;
}

// ─── Auth endpoints ──────────────────────────────────────────────────────────

export const authApi = {
  register: (email: string, password: string, full_name?: string) =>
    apiFetch<MessageWithUserResponse>("/api/v1/auth/register", {
      method: "POST",
      body: { email, password, full_name },
    }),

  login: (email: string, password: string) =>
    apiFetch<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  verifyEmail: (token: string) =>
    apiFetch<TokenResponse>(
      `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
    ),

  resendVerification: (email: string) =>
    apiFetch<void>("/api/v1/auth/resend-verification", {
      method: "POST",
      body: { email },
    }),

  forgotPassword: (email: string) =>
    apiFetch<void>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),

  validateResetToken: (token: string) =>
    apiFetch<void>(
      `/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`
    ),

  resetPassword: (token: string, new_password: string) =>
    apiFetch<MessageWithUserResponse>("/api/v1/auth/reset-password", {
      method: "POST",
      body: { token, new_password },
    }),

  refresh: (refresh_token: string) =>
    apiFetch<TokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: { refresh_token },
    }),

  logout: (refresh_token: string) =>
    apiFetch<void>("/api/v1/auth/logout", {
      method: "POST",
      body: { refresh_token },
      auth: true,
    }),

  getUser: (id: string) =>
    apiFetch<UserPublic>(`/api/v1/users/${id}`, { auth: true }),
};
