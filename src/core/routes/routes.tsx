import CreationStudioLayout from "@/modules/creation-studio/layout/creation-studio-layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";
import DashboardLayout from "@/shared/layout/dashboard-layout";
import MarketingCoachChat from "@/domains/creation-studio/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "@/domains/dashboard/calendar/content-post/page/ContentFeedbackPage";
import DashboardPage from "@/domains/dashboard/page/DashboardPage";
import CampaingnPage from "@/domains/dashboard/management/campaigns/CampaingnPage";
import { BrandDashboard } from "@/domains/creation-studio/brand-dna/page/Brand-DNA-Page";
import AuthPage from "@/domains/auth/page/authPage";
import RequireAuth from "@/domains/auth/components/RequireAuth";
import { lazy } from "react";
import { StyleProfilePage } from "@/domains/creation-studio/brand-dna/style-profile/StyleProfilePage";

const ExtractorDNAPage = lazy(
  () =>
    import("@/domains/creation-studio/brand-dna/brand-dna-extractor/pages/brand-extractor"),
);

const AppRoutes = () => {
  return (
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<MarketingCoachChat />} />
          <Route path="/calendar" element={<ContentFeedbackPage />} />
          <Route path="/campaigns" element={<CampaingnPage />} />
          <Route path="/brand-dna" element={<BrandDashboard />} />
          <Route path="/style-profile" element={<StyleProfilePage />} />
        </Route>

        {/* Creation Studio Routes */}
        <Route path="app" element={<CreationStudioLayout />}>
          {CreationStudioRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
