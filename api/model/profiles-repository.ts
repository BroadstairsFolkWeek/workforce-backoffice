import { logTrace } from "../utilities/logging";
import { Profile } from "./interfaces/profile";
import {
  getProfileGraphListItems,
  getProfileGraphListItemsByProfileId,
  getProfileGraphListItemsByProfileIds,
} from "./graph/profiles-repository-graph";
import { PersistedProfileListItem } from "./interfaces/sp/profile-sp";

const listItemToProfile = (item: PersistedProfileListItem): Profile => {
  return {
    profileId: item.ProfileId,
    email: item.Email,
    displayName: item.Title,
    givenName: item.GivenName,
    surname: item.Surname,
    telephone: item.Telephone ?? undefined,
    address: item.Address ?? undefined,
  };
};

export const getProfiles = async (): Promise<Array<Profile>> => {
  logTrace("In profiles-repository: getProfiles");

  const profileGraphListItems = await getProfileGraphListItems();
  return profileGraphListItems.map((item) => listItemToProfile(item.fields));
};

export const getProfilesByIds = async (
  profileIds: string[]
): Promise<Array<Profile>> => {
  logTrace("In profiles-repository: getProfilesByIds");

  const profileGraphListItems = await getProfileGraphListItemsByProfileIds(
    profileIds
  );
  return profileGraphListItems.map((item) => listItemToProfile(item.fields));
};

export const getProfileById = async (profileId: string): Promise<Profile> => {
  logTrace("In profiles-repository: getProfilesById");

  const profileGraphListItem = await getProfileGraphListItemsByProfileId(
    profileId
  );

  if (profileGraphListItem) {
    return listItemToProfile(profileGraphListItem.fields);
  }

  return null;
};
