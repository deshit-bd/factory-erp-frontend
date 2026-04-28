import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { login as loginRequest } from "@/shared/lib/auth-api";
import { sidebarItems } from "@/shared/config/sidebar-navigation";

const AuthContext = createContext(null);
const storageKey = "factory-erp-auth-user";
const adminPermissionKeys = sidebarItems.map((item) => item.permissionKey);

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const normalizedPermissions = Array.isArray(user.permissions) ? user.permissions.filter(Boolean) : [];

  if (user.role === "admin") {
    return {
      ...user,
      permissions: adminPermissionKeys,
    };
  }

  return {
    ...user,
    permissions: normalizedPermissions,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem(storageKey);
      if (storedUser) {
        const normalizedUser = normalizeUser(JSON.parse(storedUser));
        setUser(normalizedUser);
        window.localStorage.setItem(storageKey, JSON.stringify(normalizedUser));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setAuthReady(true);
    }
  }, []);

  async function signIn(credentials) {
    const loggedInUser = normalizeUser(await loginRequest(credentials));
    setUser(loggedInUser);
    window.localStorage.setItem(storageKey, JSON.stringify(loggedInUser));
    return loggedInUser;
  }

  function signOut() {
    setUser(null);
    window.localStorage.removeItem(storageKey);
  }

  const value = useMemo(
    () => ({
      authReady,
      isAuthenticated: Boolean(user),
      user,
      signIn,
      signOut,
    }),
    [authReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
