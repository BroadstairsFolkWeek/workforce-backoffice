import { List } from "@microsoft/microsoft-graph-types";
import { logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";
import { getSiteBaseApiPathForCurrentGroup } from "./site-graph";
import { PersistedProfile } from "../interfaces/profile";
import { PersistedProfileListItem } from "../interfaces/sp/profile-sp";

const listItemToProfile = (
  item: PersistedProfileListItem
): PersistedProfile => {
  return {
    profileId: item.ProfileId,
    email: item.Email,
    displayName: item.Title,
    givenName: item.GivenName,
    surname: item.Surname,
    telephone: item.Telephone ?? undefined,
    address: item.Address ?? undefined,
    dbId: item.id,
    lastSaved: item.Modified,
  };
};

export const getProfiles = async () => {
  logTrace("In profiles-graph: getProfiles");
  const siteBaseApiPath = await getSiteBaseApiPathForCurrentGroup();

  const graphClient = getOboGraphClient();

  const listByTitleApiPath = `${siteBaseApiPath}/lists/Profiles`;
  logTrace("Looking up Profiles list via Graph: " + listByTitleApiPath);
  const profilesList: List = await graphClient.api(listByTitleApiPath).get();
  logTrace("List lookup response: " + JSON.stringify(profilesList, null, 2));

  const profilesListId = profilesList.id;
  logTrace("Profiles list ID: " + profilesListId);

  const listItemsApiPath = `${siteBaseApiPath}/lists/${profilesListId}/items`;
  logTrace("Lookup up profile list items via Graph: " + listItemsApiPath);
  const profilesListItems: PersistedGraphListItem<PersistedProfileListItem>[] =
    (await graphClient.api(listItemsApiPath).expand("fields").get()).value;
  logTrace("Returned items count: " + profilesListItems.length);

  return profilesListItems.map((item) => listItemToProfile(item.fields));
};
