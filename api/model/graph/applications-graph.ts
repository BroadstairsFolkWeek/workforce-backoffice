import { getAppAsyncContext } from "../../context/app-async-context";
import { List, Site } from "@microsoft/microsoft-graph-types";
import { logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";

export const getApplications = async () => {
  const context = getAppAsyncContext();
  const graphClient = getOboGraphClient(context.teamsfxContext);

  const site: Site = await graphClient
    .api(`/groups/${context.groupId}/sites/root`)
    .get();

  logTrace("Site from group: " + JSON.stringify(site, null, 2));

  const siteId = site.id;

  let lists: List[] = (await graphClient.api(`/sites/${siteId}/lists`).get())
    .value;

  const workforceApplicationsList: List = await graphClient
    .api(`/sites/${siteId}/lists/Workforce Applications`)
    .get();

  const workforceApplicationsListId = workforceApplicationsList.id;

  const workforceApplications = (
    await graphClient
      .api(`/sites/${siteId}/lists/${workforceApplicationsListId}/items`)
      .expand("fields")
      .get()
  ).value;

  return workforceApplications;
};
