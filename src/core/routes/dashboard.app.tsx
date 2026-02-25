import RequireAuth from "@/domains/auth/components/RequireAuth";
import { lazy } from "react";
import { DashboardLayout } from "../router/router";
import { Route } from "react-router-dom";

const DashboardPage = lazy(
  () => import("@/domains/dashboard/page/DashboardPage"),
);
const MarketingCoachChat = lazy(
  () =>
    import("@/domains/creation-studio/chat-coach/page/MarketingCoachChatPage"),
);
const ContentFeedbackPage = lazy(
  () =>
    import("@/domains/dashboard/calendar/content-post/page/ContentFeedbackPage"),
);
const CampaingnPage = lazy(
  () => import("@/domains/dashboard/management/campaigns/CampaingnPage"),
);

export const DashboardAppRoutes = () => (
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
  </Route>
);
