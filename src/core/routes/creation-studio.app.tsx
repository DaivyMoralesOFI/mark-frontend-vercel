import { Route } from "react-router-dom";
import { lazy } from "react";
import CreationStudioLayout from "@/modules/creation-studio/layout/CreationStudioLayout";

const CreateNewContentPage = lazy(
  () => import("@/modules/creation-studio/pages/CreateNewContentPage"),
);

const WorkflowContentPage = lazy(
  () => import("@/modules/creation-studio/pages/WorkflowContentPage"),
);

const CarouselEditorPage = lazy(
  () => import("@/modules/creation-studio/pages/CarouselEditorPage"),
);

const ExtractorDNAPage = lazy(
  () =>
    import("@/domains/creation-studio/brand-dna/brand-dna-extractor/pages/BrandExtractor"),
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
    <Route path="carousel-editor" element={<CarouselEditorPage />} />
  </Route>
);
