import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("api/auth/profile"); // API returns logged-in user info
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchProfile(); // Immediately update user state
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
