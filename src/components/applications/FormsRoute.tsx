import React from "react";

import FormsController from "./FormsController";
import store from "../../store/store";
import {
  fetchForms,
  selectForms,
  selectFormsLoadingStatus,
} from "../../store/forms/forms-slice";
import { useSelector } from "react-redux";

export async function formsLoader() {
  store.dispatch(fetchForms());
  return null;
}

const FormsRoute: React.FC = () => {
  const formsLoadingStatus = useSelector(selectFormsLoadingStatus);
  const forms = useSelector(selectForms);

  if (formsLoadingStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (formsLoadingStatus === "error") {
    return <div>Error loading forms</div>;
  }

  if (formsLoadingStatus === "not-authenticated") {
    return <div>Not authenticated</div>;
  }

  return <FormsController forms={forms} />;
};

export default FormsRoute;
