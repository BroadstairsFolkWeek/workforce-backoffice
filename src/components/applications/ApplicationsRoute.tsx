import React from "react";
import { useLoaderData } from "react-router-dom";
import * as E from "fp-ts/lib/Either";

import ApplicationsController from "./ApplicationsController";
import { getApplicationsTE } from "../../applications/applications-services";

export async function applicationsLoader() {
  const applicationsTask = getApplicationsTE();

  const applicationsEither = await applicationsTask();

  if (E.isLeft(applicationsEither)) {
    throw applicationsEither.left;
  }

  return applicationsEither.right;
}

const ApplicationsRoute: React.FC = () => {
  const data = useLoaderData() as Awaited<
    ReturnType<typeof applicationsLoader>
  >;

  return <ApplicationsController applications={data} />;
};

export default ApplicationsRoute;
