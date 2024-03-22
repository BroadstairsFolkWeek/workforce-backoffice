import { String, Record, Static } from "runtypes";

export const CoreProfileRunType = Record({
  displayName: String,
  email: String,
  givenName: String,
  surname: String,
  address: String,
  telephone: String,
});

export const ProfileMetadataRunType = Record({
  profileId: String,
});

export const ProfileRunType = ProfileMetadataRunType.extend(
  CoreProfileRunType.fields
);

export type Profile = Static<typeof ProfileRunType>;

export type AddableProfile = {
  profileId: string;
  displayName: string;
  email: string;
  givenName: string;
  surname: string;
  address: string;
  telephone: string;
};

export type UpdatableProfile = Partial<AddableProfile>;

export type PersistedProfile = AddableProfile & {
  dbId: number;
  lastSaved: string;
};
