import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import FormsRoute, { formsLoader } from "./applications/FormsRoute";
import Root from "../routes/Root";
import ErrorPage from "./Error";
import { Provider } from "react-redux";
import store from "../store/store";

const AppRouter: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route errorElement={<ErrorPage />}>
          <Route path="privacy" element={<Privacy />} />
          <Route path="termsofuse" element={<TermsOfUse />} />
          <Route
            path="applications"
            element={<FormsRoute />}
            loader={formsLoader}
          />
          <Route path="*" element={<Navigate to={"/applications"} />}></Route>
        </Route>
      </Route>
    )
  );

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default AppRouter;
