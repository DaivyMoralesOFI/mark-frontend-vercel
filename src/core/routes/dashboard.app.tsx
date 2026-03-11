import RequireAuth from "@/modules/auth/components/RequireAuth";
import { lazy } from "react";
import { DashboardLayout } from "../router/router";
import { Route } from "react-router-dom";

const DashboardPage = lazy(
  () => import("@/modules/dashboard/page/DashboardPage"),
);
const MarketingCoachChat = lazy(
  () =>
    import("@/modules/chat-coach/page/MarketingCoachChatPage"),
);
const ContentFeedbackPage = lazy(
  () =>
    import("@/modules/content-post/page/ContentFeedbackPage"),
);
const CampaingnPage = lazy(
  () => import("@/modules/campaigns/CampaingnPage"),
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
