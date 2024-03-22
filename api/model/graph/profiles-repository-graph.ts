import * as A from "fp-ts/lib/Array";

import { List } from "@microsoft/microsoft-graph-types";
import { logError, logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";
import { getSiteBaseApiPath } from "./site-graph";
import { PersistedProfileListItem } from "../interfaces/sp/profile-sp";

let _profilesListId: string | null = null;

const getProfilesListId = async (): Promise<string> => {
  if (_profilesListId) {
    return _profilesListId;
  }

  const siteBaseApiPath = await getSiteBaseApiPath();
  const graphClient = getOboGraphClient();

  const listByTitleApiPath = `${siteBaseApiPath}/lists/Profiles`;
  logTrace("Looking up Profiles list via Graph: " + listByTitleApiPath);
  const profilesList: List = await graphClient.api(listByTitleApiPath).get();

  _profilesListId = profilesList.id;
  logTrace("Profiles list ID: " + _profilesListId);
  return _profilesListId;
};

const getProfileGraphListItemsByFilter = async (
  filter?: string
): Promise<Array<PersistedGraphListItem<PersistedProfileListItem>>> => {
  logTrace("In profiles-repository-graph: getProfileGraphListItemsByFilters");

  const graphClient = getOboGraphClient();
  const siteBaseApiPath = await getSiteBaseApiPath();
  const profilesListId = await getProfilesListId();

  const listItemsApiPath = `${siteBaseApiPath}/lists/${profilesListId}/items`;

  const baseGraphRequest = graphClient.api(listItemsApiPath).expand("fields");
  const graphRequestWithFilter = filter
    ? baseGraphRequest.filter(filter)
    : baseGraphRequest;

  logTrace("Lookup up Profiles list items via Graph: " + listItemsApiPath);

  try {
    const profileGraphListItemsResponse = await graphRequestWithFilter.get();
    const profileGraphListItems = profileGraphListItemsResponse.value;
    logTrace(
      "getProfileGraphListItemsByFilter: Returned items count: " +
        profileGraphListItems.length
    );

    return profileGraphListItems;
  } catch (error) {
    logError("Error when getting profile graph list items: " + error);
    logError("Filter: " + filter);
  }
};

export const getProfileGraphListItems = async (): Promise<
  Array<PersistedGraphListItem<PersistedProfileListItem>>
> => {
  logTrace("In profiles-repository-graph: getProfileGraphListItems");
  return await getProfileGraphListItemsByFilter();
};

const getProfileGraphListItemsByProfileIdBatch = async (
  profileIdBatch: string[]
): Promise<Array<PersistedGraphListItem<PersistedProfileListItem>>> => {
  logTrace(
    "In profiles-repository-graph: getProfileGraphListItemsByProfileIdBatch"
  );

  const filter = profileIdBatch
    .map((profileId) => `fields/ProfileId eq '${profileId}'`)
    .join(" or ");

  return await getProfileGraphListItemsByFilter(filter);
};

export const getProfileGraphListItemsByProfileIds = async (
  profileIds: string[]
): Promise<Array<PersistedGraphListItem<PersistedProfileListItem>>> => {
  logTrace(
    "In profiles-repository-graph: getProfileGraphListItemsByProfileIds"
  );

  const chunks = A.chunksOf(10)(profileIds);
  const results = await Promise.all(
    chunks.map(getProfileGraphListItemsByProfileIdBatch)
  );
  return A.flatten(results);
};

export const getProfileGraphListItemsByProfileId = async (
  profileId: string
): Promise<PersistedGraphListItem<PersistedProfileListItem>> => {
  logTrace("In profiles-repository-graph: getProfileGraphListItemsByProfileId");

  const profiles = await getProfileGraphListItemsByProfileIds([profileId]);
  if (profiles.length > 0) {
    return profiles[0];
  }

  return null;
};
