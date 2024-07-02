import { Schema as S } from "@effect/schema";
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

export const ModelProfileId = S.String.pipe(S.brand("ProfileId"));
export type ModelProfileId = S.Schema.Type<typeof ModelProfileId>;

export const ModelProfile2 = S.Struct({
  profileId: ModelProfileId,
  email: S.optional(S.String),
  displayName: S.String,
  givenName: S.optional(S.String),
  surname: S.optional(S.String),
  address: S.optional(S.String),
  telephone: S.optional(S.String),
  version: S.Number,
  photoUrl: S.optional(S.String),
  photoIds: S.optional(S.Array(S.String)),
  dbId: S.Number,
});

export interface ModelProfile2 extends S.Schema.Type<typeof ModelProfile2> {}