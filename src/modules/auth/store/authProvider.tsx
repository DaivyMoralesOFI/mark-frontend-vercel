// authProvider.tsx
//
// This file defines the AuthProvider and AuthContext for managing authentication state in a React context.
// It provides login and logout functions, stores the token in localStorage, and exposes authentication state to the app.

import React, { createContext, useState } from "react";

/**
 * AuthContextType
 * Shape of the authentication context value.
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

/**
 * AuthContext
 * React context for authentication state and actions.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 *
 * Provides authentication state and actions to its children via context.
 * Stores the token in localStorage and exposes login/logout functions.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for the authentication token
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  /**
   * Logs in by setting the token and saving it to localStorage.
   */
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  /**
   * Logs out by clearing the token from state and localStorage.
   */
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 