import CreationStudioLayout from "@/modules/create-post/layout/creation-studio-layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";
import DashboardLayout from "@/shared/layout/dashboard-layout";
import MarketingCoachChat from "@/modules/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "@/modules/content-post/page/ContentFeedbackPage";
import DashboardPage from "@/modules/dashboard/page/DashboardPage";
import CampaingnPage from "@/modules/campaigns/CampaingnPage";
import { BrandDashboard } from "@/modules/brand-dna/page/Brand-DNA-Page";
import AuthPage from "@/modules/auth/page/authPage";
import RequireAuth from "@/modules/auth/components/RequireAuth";
import { lazy } from "react";
import { StyleProfilePage } from "@/modules/brand-dna/style-profile/StyleProfilePage";

const ExtractorDNAPage = lazy(
  () =>
    import("@/modules/brand-dna/brand-dna-extractor/pages/brand-extractor"),
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: authentication page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Experimental Brand DNA routes */}
        <Route
          path="/brand-dna-extractor"
          element={
            <RequireAuth>
              <ExtractorDNAPage />
            </RequireAuth>
          }
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
        <Route
          path="app"
          element={
            <RequireAuth>
              <CreationStudioLayout />
            </RequireAuth>
          }
        >
          {CreationStudioRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
