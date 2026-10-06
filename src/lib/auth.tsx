import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  authApi,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  type TokenResponse,
  type UserPublic,
} from "@/lib/api";

interface AuthContextValue {
  user: UserPublic | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserPublic>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setSession: (t: TokenResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Decode the "sub" (user id) claim from a JWT without verifying the signature —
// only used to bootstrap a user profile fetch after a page reload.
function decodeSub(jwt: string): string | null {
  try {
    const payload = jwt.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const claims = JSON.parse(json) as { sub?: string };
    return claims.sub ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have an access token, hydrate the user.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const sub = decodeSub(token);
      if (!sub) {
        clearTokens();
        setLoading(false);
        return;
      }
      try {
        const u = await authApi.getUser(sub);
        if (!cancelled) setUser(u);
      } catch {
        clearTokens();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback((t: TokenResponse) => {
    setTokens(t.access_token, t.refresh_token);
    setUser(t.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const t = await authApi.login(email, password);
      setSession(t);
      return t.user;
    },
    [setSession]
  );

  const logout = useCallback(async () => {
    const rt = getRefreshToken();
    if (rt) {
      try {
        await authApi.logout(rt);
      } catch {
        /* ignore — clear locally regardless */
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    const sub = decodeSub(token);
    if (!sub) return;
    try {
      const u = await authApi.getUser(sub);
      setUser(u);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout, refreshUser, setSession }),
    [user, loading, login, logout, refreshUser, setSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
