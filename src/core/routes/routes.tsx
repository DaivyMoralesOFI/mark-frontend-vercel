import CreationStudioLayout from "@/modules/creation-studio/layout/creation-studio-layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";
import AuthPage from "@/domains/auth/page/authPage";
import { DashboardAppRoutes } from "./dashboard.app";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="auth" element={<AuthPage />} />

        <Route path="/app">
          {DashboardAppRoutes()}
          {CreationStudioRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
