// useAuth.ts
//
// This file defines the useAuth custom React hook, which provides access to the authentication context.
// It throws an error if used outside of an AuthProvider.

import { useContext } from "react";
import { AuthContext } from "../store/authProvider";

/**
 * useAuth
 *
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 *
 * @returns {AuthContextType} The authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
} 