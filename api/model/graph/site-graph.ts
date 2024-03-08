import { Site } from "@microsoft/microsoft-graph-types";
import { getOboGraphClient } from "../../services/graph-client";
import { logTrace } from "../../utilities/logging";
import config from "../../config";

const cache: { [groupId: string]: string } = {};

export const getSiteBaseApiPathForCurrentGroup = async () => {
  logTrace("In site-graph: getSiteBaseApiPathForCurrentGroup");
  const groupId = config.groupId;

  if (cache[groupId]) {
    logTrace(
      `Returning cached base API path for group ${groupId}: ${cache[groupId]}`
    );
    return cache[groupId];
  } else {
    const graphClient = getOboGraphClient();
    const lookupGroupRootSiteByPath = `/groups/${groupId}/sites/root`;
    logTrace(
      "Looking up group root site via Graph: " + lookupGroupRootSiteByPath
    );
    const groupRootSite: Site = await graphClient
      .api(lookupGroupRootSiteByPath)
      .get();

    const siteBaseApiPath = `/sites/${groupRootSite.id}`;
    cache[groupId] = siteBaseApiPath;
    logTrace(
      `Returning base API path for group ${groupId}: ${siteBaseApiPath}`
    );
    return siteBaseApiPath;
  }
};
