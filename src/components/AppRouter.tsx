import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import { ApiContextProvider } from "../services/ApiContext";
import { ApplicationsContextProvider } from "./applications/ApplicationsContextProvider";
import ApplicationsRoute from "./applications/ApplicationsRoute";
import Root from "../routes/Root";
import ErrorPage from "./Error";

const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route errorElement={<ErrorPage />}>
          <Route path="privacy" element={<Privacy />} />
          <Route path="termsofuse" element={<TermsOfUse />} />
          <Route path="applications" element={<ApplicationsRoute />} />
          <Route path="*" element={<Navigate to={"/applications"} />}></Route>
        </Route>
      </Route>
    )
  );

  return (
    <ApiContextProvider>
      <ApplicationsContextProvider>
        <RouterProvider router={router} />
      </ApplicationsContextProvider>
    </ApiContextProvider>
  );
};

export default AppRouter;
