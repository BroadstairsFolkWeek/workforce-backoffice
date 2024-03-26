import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";

import { List } from "@microsoft/microsoft-graph-types";

import { getSiteBaseApiPath, getSiteBaseApiPathTE } from "./site-graph";
import {
  getOboGraphClient,
  getViaOboGraphClient,
  patchViaOboGraphClient,
} from "../../services/graph-client";
import { logTrace, logTraceIO } from "../../utilities/logging";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";
import {
  PersistedApplicationListItem,
  UpdatableApplicationListItem,
} from "../interfaces/sp/application-sp";

let _workforceApplicationsListId: string | null = null;

const getWorkforceApplicationsListId = async (): Promise<string> => {
  if (_workforceApplicationsListId) {
    return _workforceApplicationsListId;
  }

  const siteBaseApiPath = await getSiteBaseApiPath();
  const graphClient = getOboGraphClient();

  const listByTitleApiPath = `${siteBaseApiPath}/lists/Workforce Applications`;
  logTrace(
    "Looking up Workforce Applications list via Graph: " + listByTitleApiPath
  );
  const workforceApplicationsList: List = await graphClient
    .api(listByTitleApiPath)
    .get();

  _workforceApplicationsListId = workforceApplicationsList.id;
  logTrace("Workforce Applications list ID: " + _workforceApplicationsListId);
  return _workforceApplicationsListId;
};

const getWorkforceApplicationsListIdTE = flow(
  getSiteBaseApiPathTE,
  TE.map(
    (siteBaseApiPath) => `${siteBaseApiPath}/lists/Workforce Applications`
  ),
  TE.chain(getViaOboGraphClient),
  TE.map((workforceApplicationsList: List) => workforceApplicationsList.id)
);

const getApplicationGraphListItemsByFilters = async (
  filters: string[]
): Promise<Array<PersistedGraphListItem<PersistedApplicationListItem>>> => {
  logTrace(
    "In applications-repository-graph: getApplicationGraphListItemsByFilters"
  );

  const graphClient = getOboGraphClient();
  const siteBaseApiPath = await getSiteBaseApiPath();
  const workforceApplicationsListId = await getWorkforceApplicationsListId();

  const listItemsApiPath = `${siteBaseApiPath}/lists/${workforceApplicationsListId}/items`;

  const baseGraphRequest = graphClient.api(listItemsApiPath).expand("fields");
  const graphRequestWithFilters = filters.reduce(
    (gr, filter) => gr.filter(filter),
    baseGraphRequest
  );

  logTrace("Lookup up application list items via Graph: " + listItemsApiPath);
  const workforceApplicationGraphListItemsResponse =
    await graphRequestWithFilters.get();
  const workforceApplicationGraphListItems =
    workforceApplicationGraphListItemsResponse.value;
  logTrace(
    "getApplicationGraphListItemsByFilters: Returned items count: " +
      workforceApplicationGraphListItems.length
  );

  return workforceApplicationGraphListItems;
};

export const getApplicationGraphListItems = async (): Promise<
  Array<PersistedGraphListItem<PersistedApplicationListItem>>
> => {
  logTrace("In applications-repository-graph: getApplicationGraphListItems");
  return getApplicationGraphListItemsByFilters([]);
};

export const getApplicationGraphListItem = async (
  applicationId: string
): Promise<PersistedGraphListItem<PersistedApplicationListItem>> => {
  logTrace(
    `In applications-repository-graph: getApplicationListItem(${applicationId})`
  );
  const graphListItems = await getApplicationGraphListItemsByFilters([
    `fields/ApplicationId eq '${applicationId}'`,
  ]);

  if (graphListItems.length > 0) {
    return graphListItems[0];
  }

  return null;
};

export const getApplicationGraphListItemTE = (applicationId: string) => {
  return TE.tryCatchK(getApplicationGraphListItem, E.toError)(applicationId);
};

const graphItemIdForApplicationId = (
  applicationId: string
): TE.TaskEither<Error | "not-found", string> => {
  return pipe(
    getApplicationGraphListItemTE(applicationId),
    TE.map((item) => item.id),
    TE.mapLeft(() => "not-found")
  );
};

export const saveApplicationGraphListItemChanges = (
  applicationId: string,
  changes: UpdatableApplicationListItem
): TE.TaskEither<Error | "not-found", PersistedApplicationListItem> => {
  return flow(
    getSiteBaseApiPathTE,
    TE.bindTo("siteBaseApiPath"),
    TE.bind("listId", getWorkforceApplicationsListIdTE),
    TE.bind("itemId", () => graphItemIdForApplicationId(applicationId)),
    TE.chainFirstIOK(({ listId }) =>
      logTraceIO(`saveApplicationGraphListItemChanges: List ID: ${listId}`)
    ),
    TE.chainW(({ siteBaseApiPath, listId, itemId }) =>
      patchViaOboGraphClient(changes)(
        `${siteBaseApiPath}/lists/${listId}/items/${itemId}/fields`
      )
    ),
    TE.chainFirstIOK((response) =>
      logTraceIO(
        `Updated application list item: ${JSON.stringify(response, null, 2)}`
      )
    )
  )();
};
