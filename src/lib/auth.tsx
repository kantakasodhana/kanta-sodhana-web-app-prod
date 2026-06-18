"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const AUTH_API = "";
const SESSION_POLL_MS = 5 * 60 * 1000;

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)ks_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_approved: boolean;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${AUTH_API}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    pollRef.current = setInterval(() => {
      refresh();
    }, SESSION_POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${AUTH_API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error };
      setUser(data);
      return {};
    } catch {
      return { error: "Cannot reach auth server" };
    }
  };

  const logout = async () => {
    await fetch(`${AUTH_API}/api/auth/logout`, {
      method: "POST",
      headers: { "X-CSRF-Token": getCsrfToken() },
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
