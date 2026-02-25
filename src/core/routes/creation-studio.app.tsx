import { Route } from "react-router-dom";
import { lazy } from "react";
import CreationStudioLayout from "@/modules/create-post/layout/creation-studio-layout";

const CreateNewContentPage = lazy(
  () => import("@/modules/create-post/pages/create-new-content-page"),
);

const WorkflowContentPage = lazy(
  () => import("@/modules/create-post/pages/workflow-content-page"),
);

export const CreationStudioRoutes = () => (
  <Route path="creation-studio" element={<CreationStudioLayout />}>
    <Route path="new">
      <Route path="content">
        <Route index element={<CreateNewContentPage />} />
        <Route path=":uuid" element={<WorkflowContentPage />} />
      </Route>
    </Route>
  </Route>
);
