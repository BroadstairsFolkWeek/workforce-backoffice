import { String, Record, Static } from "runtypes";

export const ModelCoreProfileRunType = Record({
  displayName: String,
  email: String,
  givenName: String,
  surname: String,
  address: String,
  telephone: String,
});

export const ModelProfileMetadataRunType = Record({
  profileId: String,
});

export const ModelProfileRunType = ModelProfileMetadataRunType.extend(
  ModelCoreProfileRunType.fields
);

export type ModelProfile = Static<typeof ModelProfileRunType>;

export type ModelAddableProfile = {
  profileId: string;
  displayName: string;
  email: string;
  givenName: string;
  surname: string;
  address: string;
  telephone: string;
};

export type ModelUpdatableProfile = Partial<ModelAddableProfile>;

export type ModelPersistedProfile = ModelAddableProfile & {
  dbId: number;
  lastSaved: string;
};
