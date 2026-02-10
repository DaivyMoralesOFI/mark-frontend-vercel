// App.tsx
//
// This file defines the root App component for the React application.
// It sets up the main routing structure, authentication context, and layout for all pages.
// The app uses React Router for navigation and supports protected routes with authentication.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/shared/layout/dashboard-layout";
import MarketingCoachChat from "@/domains/creation-studio/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "@/domains/dashboard/calendar/content-post/page/ContentFeedbackPage";
import DashboardPage from "@/domains/dashboard/page/DashboardPage";
import CampaingnPage from "@/domains/dashboard/management/campaigns/CampaingnPage";
import { BrandDashboard } from "@/domains/creation-studio/brand-dna/page/Brand-DNA-Page";
import AuthPage from "@/domains/auth/page/authPage";
import { AuthProvider } from "@/domains/auth/store/authProvider";
import RequireAuth from "@/domains/auth/components/RequireAuth";
import { lazy } from "react";
import { StyleProfilePage } from "@/domains/creation-studio/brand-dna/style-profile/StyleProfilePage";
import { ThemeProvider } from "@/core/router/router";
import FirebaseProvider from "./core/context/firebase-context";

const ExtractorDNAPage = lazy(
  () => import("@/domains/creation-studio/brand-dna/brand-dna-extractor/pages/brand-extractor"),
);

/**
 * App
 *
 * The root component of the application. Sets up:
 * - Authentication provider context
 * - React Router for navigation
 * - Protected routes using RequireAuth
 * - Main dashboard layout and feature pages
 */
export default function App() {
  return (
    // Provide authentication context to the entire app
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <FirebaseProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route: authentication page */}
              <Route path="/auth" element={<AuthPage />} />
              {/*Experimental Brand DNA routes*/}
              <Route
                path="/brand-dna-extractor"
                element={<ExtractorDNAPage />}
              />
              {/* Protected routes: require authentication */}
              <Route
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                {/* Redirect root to dashboard */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                {/* Main dashboard and feature pages */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/chat" element={<MarketingCoachChat />} />
                <Route path="/calendar" element={<ContentFeedbackPage />} />
                <Route path="/campaigns" element={<CampaingnPage />} />
                <Route path="/brand-dna" element={<BrandDashboard />} />
                <Route path="/style-profile" element={<StyleProfilePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FirebaseProvider>
      </ThemeProvider>
      {/* Set up client-side routing */}
    </AuthProvider>
  );
}
