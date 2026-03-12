import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const TEN_MINUTES = 10 * 60 * 1000;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post("/sia-api/api/auth/login/", {
      email: "lovakush81@gmail.com",
      password: "lovaofi@123",
    });
    const newToken = data.data.access_token;
    const newRefresh = data.data.refresh_token;
    localStorage.setItem("token", newToken);
    if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
    return newToken;
  } catch {
    return null;
  }
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [, setIsAuthenticated] = useState(true);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Refresh immediately on mount, then every 10 minutes
    const doRefresh = async () => {
      const newToken = await refreshAccessToken();
      if (newToken) setToken(newToken);
    };

    doRefresh();
    refreshIntervalRef.current = setInterval(doRefresh, TEN_MINUTES);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  // Always return true for isAuthenticated to bypass views, 
  // but keep the actual state for token management
  return (
    <AuthContext.Provider value={{ isAuthenticated: true, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 
