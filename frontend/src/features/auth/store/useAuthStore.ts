import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Extracts user id (sub) and email safely from a JWT without external libraries.
 */
export function parseJwtUser(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    const id = decoded.sub || decoded.user_id || decoded.id;
    if (!id) return null;
    return {
      id: String(id),
      email: decoded.email || '',
    };
  } catch {
    return null;
  }
}

type LogoutListener = () => void;
const logoutListeners: Set<LogoutListener> = new Set();

export function registerLogoutListener(listener: LogoutListener): () => void {
  logoutListeners.add(listener);
  return () => {
    logoutListeners.delete(listener);
  };
}

export function notifyLogoutListeners(): void {
  logoutListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
}

/**
 * Removes all dsa_* keys and any session/auth keys from localStorage.
 */
export function clearAllSessionStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.clear();
  } catch {
    // fallback if clear is restricted
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('dsa_') || key.startsWith('ai_dsa_') || key.includes('session'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }
}

/**
 * Clears leftover active session keys from previous users from localStorage.
 */
export function clearLeftoverSessionKeys(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('dsa_active_session') ||
          key.startsWith('ai_dsa_active_session') ||
          key.includes('active_session'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  email: string | null;
  setAuth: (
    token: string,
    userOrEmail?: AuthUser | string | null,
    fallbackEmail?: string
  ) => void;
  setUser: (user: AuthUser | null) => void;
  setEmail: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      email: null,

      setAuth: (token, userOrEmail, fallbackEmail) => {
        let user: AuthUser | null = null;
        let email: string | null = null;

        if (userOrEmail && typeof userOrEmail === 'object' && 'id' in userOrEmail) {
          user = userOrEmail;
          email = userOrEmail.email || fallbackEmail || null;
        } else if (typeof userOrEmail === 'string') {
          email = userOrEmail;
        } else if (fallbackEmail) {
          email = fallbackEmail;
        }

        if ((!user || !user.id) && token) {
          const parsed = parseJwtUser(token);
          if (parsed) {
            user = {
              id: parsed.id,
              email: email || parsed.email,
            };
            if (!email && parsed.email) {
              email = parsed.email;
            }
          }
        }

        set({
          token,
          user,
          email: email || user?.email || null,
        });
      },

      setUser: (user) =>
        set((state) => ({
          user,
          email: user?.email || state.email,
        })),

      setEmail: (email) =>
        set((state) => ({
          email,
          user: state.user ? { ...state.user, email } : state.user,
        })),

      logout: () => {
        clearAllSessionStorage();
        set({ token: null, user: null, email: null });
        notifyLogoutListeners();
      },
    }),
    {
      name: 'dsa_auth',
    }
  )
);
