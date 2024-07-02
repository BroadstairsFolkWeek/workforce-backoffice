import { Context, Effect } from "effect";
import { logTrace } from "../utilities/logging";
import {
  ModelProfile,
  ModelProfileId,
  ModelProfile2,
} from "./interfaces/profile";
import {
  getProfileGraphListItems,
  getProfileGraphListItemsByProfileId,
  getProfileGraphListItemsByProfileIds,
} from "./graph/profiles-repository-graph";
import { PersistedProfileListItem } from "./interfaces/sp/profile-sp";

export class ProfileNotFound {
  readonly _tag = "ProfileNotFound";
}

export class ProfilesRepository extends Context.Tag("ProfilesRepository")<
  ProfilesRepository,
  {
    readonly modelGetProfileByProfileId: (
      profileId: ModelProfileId
    ) => Effect.Effect<ModelProfile2, ProfileNotFound>;

    readonly modelGetProfiles: () => Effect.Effect<readonly ModelProfile2[]>;
  }
>() {}

const listItemToProfile = (item: PersistedProfileListItem): ModelProfile => {
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

export const modelGetProfiles = async (): Promise<Array<ModelProfile>> => {
  logTrace("In profiles-repository: getProfiles");

  const profileGraphListItems = await getProfileGraphListItems();
  return profileGraphListItems.map((item) => listItemToProfile(item.fields));
};

export const modelGetProfilesByIds = async (
  profileIds: string[]
): Promise<Array<ModelProfile>> => {
  logTrace("In profiles-repository: getProfilesByIds");

  const profileGraphListItems = await getProfileGraphListItemsByProfileIds(
    profileIds
  );
  return profileGraphListItems.map((item) => listItemToProfile(item.fields));
};

export const modelGetProfileById = async (
  profileId: string
): Promise<ModelProfile> => {
  logTrace("In profiles-repository: getProfilesById");

  const profileGraphListItem = await getProfileGraphListItemsByProfileId(
    profileId
  );

  if (profileGraphListItem) {
    return listItemToProfile(profileGraphListItem.fields);
  }

  return null;
};
