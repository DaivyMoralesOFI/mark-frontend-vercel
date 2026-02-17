import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/core/config/firebase-database";

/**
 * AuthContextType
 * Shape of the authentication context value.
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
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
  // State for the authenticated user
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        currentUser.getIdToken().then((idToken) => {
          setToken(idToken);
          localStorage.setItem("token", idToken);
        });
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe();
  }, []);

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
    const auth = getAuth(app);
    auth.signOut();
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token || !!user, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 