import { Route, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
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

// Forces a full remount of WorkflowContentPage when UUID changes,
// preventing stale nodes/store state from a previous creation bleeding in.
const KeyedWorkflowPage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  return <WorkflowContentPage key={uuid} />;
};

const PageLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-surface dark:bg-[#0F0F0F]" />
);

export const CreationStudioRoutes = () => (
  <Route path="creation-studio" element={<CreationStudioLayout />}>
    <Route
      path="extractor"
      element={
        <Suspense fallback={<PageLoader />}>
          <ExtractorDNAPage />
        </Suspense>
      }
    />
    <Route path="new">
      <Route path="content">
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <CreateNewContentPage />
            </Suspense>
          }
        />
        <Route
          path=":uuid"
          element={
            <Suspense fallback={<PageLoader />}>
              <KeyedWorkflowPage />
            </Suspense>
          }
        />
      </Route>
    </Route>
    <Route
      path="carousel-editor"
      element={
        <Suspense fallback={<PageLoader />}>
          <CarouselEditorPage />
        </Suspense>
      }
    />
  </Route>
);
