import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_KEY, getProfile } from "../service/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Read the stored session (also picks up sessions saved by the old "user"/"userInfo" keys)
const readStoredUser = () => {
  for (const key of [AUTH_KEY, "user", "userInfo"]) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value?.token) {
        if (key !== AUTH_KEY) {
          localStorage.setItem(AUTH_KEY, JSON.stringify(value));
          ["user", "userInfo", "role"].forEach((k) => localStorage.removeItem(k));
        }
        return value;
      }
    } catch {
      /* ignore broken JSON */
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const loginUser = useCallback((data) => {
    setUser(data);
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }, []);

  // Merge fresh profile fields while keeping the token
  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const next = { ...prev, ...data, token: data.token || prev?.token };
      localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  // Token rejected by the API → sign out
  useEffect(() => {
    const onExpired = () => logoutUser();
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [logoutUser]);

  // Refresh profile once on load (picks up role changes made by an admin)
  useEffect(() => {
    if (!user?.token) return;
    getProfile()
      .then(({ data }) => updateUser(data))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === "admin", isEmployer: user?.role === "employer", isCandidate: !!user && !["admin", "employer"].includes(user.role), loginUser, updateUser, logoutUser }),
    [user, loginUser, updateUser, logoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
