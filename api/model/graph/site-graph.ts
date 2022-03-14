import { Site } from "@microsoft/microsoft-graph-types";
import { getAppAsyncContext } from "../../context/app-async-context";
import { getOboGraphClient } from "../../services/graph-client";

const cache: { [groupId: string]: string } = {};

export const getSiteBaseApiForCurrentGroup = async () => {
  const appContext = getAppAsyncContext();
  const groupId = appContext.groupId;

  if (cache[groupId]) {
    return cache[groupId];
  } else {
    const graphClient = getOboGraphClient();
    const groupRootSite: Site = await graphClient
      .api(`/groups/${groupId}/sites/root`)
      .get();

    return `/sites/${groupRootSite.id}`;
  }
};
