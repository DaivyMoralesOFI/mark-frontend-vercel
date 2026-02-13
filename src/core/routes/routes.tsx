import CreationStudioLayout from "@/modules/creation-studio/layout/creation-studio-layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreationStudioRoutes } from "./creation-studio.app";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="app" element={<CreationStudioLayout />}>
          {CreationStudioRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
