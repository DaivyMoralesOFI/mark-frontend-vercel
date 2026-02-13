import { Route } from "react-router-dom";
import { lazy } from "react";

const CreateNewContentPage = lazy(
  () => import("@/modules/creation-studio/pages/create-new-content-page"),
);

const WorkflowContentPage = lazy(
  () => import("@/modules/creation-studio/pages/workflow-content-page"),
);

export const CreationStudioRoutes = () => (
  <Route path="creation-studio">
    <Route path="new">
      <Route path="content">
        <Route index element={<CreateNewContentPage />} />
        <Route path=":uuid" element={<WorkflowContentPage />} />
      </Route>
    </Route>
  </Route>
);
