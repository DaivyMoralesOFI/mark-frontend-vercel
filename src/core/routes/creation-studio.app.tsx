import { Route } from "react-router-dom";
import { lazy } from "react";
import CreationStudioLayout from "@/modules/create-post/layout/CreationStudioLayout";

const CreateNewContentPage = lazy(
  () => import("@/modules/create-post/pages/CreateNewContentPage"),
);

const WorkflowContentPage = lazy(
  () => import("@/modules/create-post/pages/WorkflowContentPage"),
);

const ExtractorDNAPage = lazy(
  () =>
    import("@/modules/brand-dna/brand-dna-extractor/pages/BrandExtractor"),
);

export const CreationStudioRoutes = () => (
  <Route path="creation-studio" element={<CreationStudioLayout />}>
    <Route path="extractor" element={<ExtractorDNAPage />} />
    <Route path="new">
      <Route path="content">
        <Route index element={<CreateNewContentPage />} />
        <Route path=":uuid" element={<WorkflowContentPage />} />
      </Route>
    </Route>
  </Route>
);
