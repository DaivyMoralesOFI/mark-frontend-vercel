import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";
import DashboardLayout from "@/shared/layout/DashboardLayout";
import MarketingCoachChat from "@/modules/chat-coach/page/MarketingCoachChatPage";
import ContentFeedbackPage from "@/modules/content-post/page/ContentFeedbackPage";
import DashboardPage from "@/modules/dashboard/page/DashboardPage";
import CampaingnPage from "@/modules/campaigns/CampaingnPage";
import { BrandDashboard } from "@/modules/brand-dna/page/BrandDNAPage";
import AuthPage from "@/modules/auth/page/AuthPage";
import RequireAuth from "@/modules/auth/components/RequireAuth";

import { StyleProfilePage } from "@/modules/brand-dna/style-profile/StyleProfilePage";



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
