// RequireAuth.tsx
//
// This file defines the RequireAuth component, which protects routes by requiring authentication.
// If the user is not authenticated, it redirects to the login page and preserves the intended destination.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";

/**
 * RequireAuth
 *
 * Protects a route by requiring authentication.
 * If not authenticated, redirects to the login page and saves the intended location.
 *
 * @param {React.PropsWithChildren} props - The children to render if authenticated
 */
export default function RequireAuth({ children }: React.PropsWithChildren<{}>) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 