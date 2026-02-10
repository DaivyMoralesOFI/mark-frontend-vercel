import CreationStudioLayout from "@/modules/creation-studio/layout/creation-studio-layout";
import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const CreateNewContentPage = lazy(
  () => import("@/modules/creation-studio/pages/create-new-content-page"),
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="app" element={<CreationStudioLayout />}>
          <Route path="creation-studio">
            <Route path="new">
              <Route path="content">
                <Route path=":uuid" element={<CreateNewContentPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
