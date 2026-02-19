import { Route } from "react-router-dom";
import { lazy } from "react";
import CreationStudioLayout from "@/modules/creation-studio/layout/creation-studio-layout";

const CreateNewContentPage = lazy(
  () => import("@/modules/creation-studio/pages/create-new-content-page"),
);

const WorkflowContentPage = lazy(
  () => import("@/modules/creation-studio/pages/workflow-content-page"),
);

const BrandExtractorPage = lazy(
  () => import("@/modules/creation-studio/pages/brand-dna-extractor"),
);

export const CreationStudioRoutes = () => (
  <Route path="creation-studio" element={<CreationStudioLayout />}>
    <Route path="new">
      <Route path="content">
        <Route index element={<CreateNewContentPage />} />
        <Route path=":uuid" element={<WorkflowContentPage />} />
      </Route>
    </Route>
    <Route path="brand-dna-extractor" element={<BrandExtractorPage />} />
  </Route>
);
