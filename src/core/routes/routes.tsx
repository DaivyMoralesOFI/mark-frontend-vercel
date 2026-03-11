import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";
import DashboardLayout from "@/shared/layout/DashboardLayout";
import MarketingCoachChat from "@/domains/creation-studio/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "@/domains/dashboard/calendar/content-post/page/ContentFeedbackPage";
import DashboardPage from "@/domains/dashboard/page/DashboardPage";
import CampaingnPage from "@/domains/dashboard/management/campaigns/CampaingnPage";
import { BrandDashboard } from "@/domains/creation-studio/brand-dna/page/BrandDNAPage";
import AuthPage from "@/domains/auth/page/AuthPage";
import RequireAuth from "@/domains/auth/components/RequireAuth";
import { StyleProfilePage } from "@/domains/creation-studio/brand-dna/style-profile/StyleProfilePage";



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="auth" element={<AuthPage />} />


        <Route path="/app">
          {/* Dashboard Routes requiring auth and DashboardLayout */}
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="chat" element={<MarketingCoachChat />} />
            <Route path="calendar" element={<ContentFeedbackPage />} />
            <Route path="campaigns" element={<CampaingnPage />} />
            <Route path="brand-dna" element={<BrandDashboard />} />
            <Route path="style-profile" element={<StyleProfilePage />} />
          </Route>

          {/* Creation Studio Routes */}
          {CreationStudioRoutes()}
        </Route>
      </Routes>
    </BrowserRouter >
  );
};

export default AppRoutes;
