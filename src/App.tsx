// App.tsx
//
// This file defines the root App component for the React application.
// It sets up the main routing structure, authentication context, and layout for all pages.
// The app uses React Router for navigation and supports protected routes with authentication.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/shared/layout/dashboard-layout";
import Dashboard from "@/modules/dashboard/page/Page";
import MarketingCoachChat from "@/modules/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "./modules/content-post/page/ContentFeedbackPage";
import AnalyticsPage from "./modules/analytics/AnalyticsPage";
import CampaingnPage from "./modules/campaigns/CampaingnPage";
import AuthPage from "./modules/auth/page/authPage";
import { AuthProvider } from "./modules/auth/store/authProvider";
import RequireAuth from "./modules/auth/components/RequireAuth";

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
      {/* Set up client-side routing */}
      <BrowserRouter>
        <Routes>
          {/* Public route: authentication page */}
          <Route path="/auth" element={<AuthPage />} />
          {/* Protected routes: require authentication */}
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Main dashboard and feature pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<MarketingCoachChat />} />
            <Route path="/content" element={<ContentFeedbackPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/campaigns" element={<CampaingnPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 