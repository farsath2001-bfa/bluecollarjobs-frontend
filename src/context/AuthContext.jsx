import React, { createContext, useState, useEffect } from "react";

// 1. Create the Context object
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing token/user on app boot
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  } , []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};