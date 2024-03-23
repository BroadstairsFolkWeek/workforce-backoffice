import {
  Boolean,
  Number,
  String,
  Literal,
  Record,
  Union,
  Static,
  Optional,
} from "runtypes";
import { ModelProfileRunType } from "./profile";

export const ModelTShirtSizeRunType = Union(
  Literal("S"),
  Literal("M"),
  Literal("L"),
  Literal("XL"),
  Literal("XXL")
);

export const ModelAgeGroupRunType = Union(
  Literal("18-20"),
  Literal("21-25"),
  Literal("26-35"),
  Literal("36-55"),
  Literal("56-65"),
  Literal("66+")
);

export const ModelApplicationStatusRunType = Union(
  Literal("info-required"),
  Literal("profile-required"),
  Literal("photo-required"),
  Literal("documents-required"),
  Literal("ready-to-submit"),
  Literal("submitted"),
  Literal("complete")
);

export const ModelCoreApplicationRunType = Record({
  telephone: Optional(String),
  address: Optional(String),
  emergencyContactName: Optional(String),
  emergencyContactTelephone: Optional(String),
  previousVolunteer: Optional(Boolean),
  previousTeam: Optional(String),
  firstAidCertificate: Optional(Boolean),
  occupationOrSkills: Optional(String),
  dbsDisclosureNumber: Optional(String),
  dbsDisclosureDate: Optional(String),
  camping: Optional(Boolean),
  tShirtSize: Optional(ModelTShirtSizeRunType),
  ageGroup: Optional(ModelAgeGroupRunType),
  otherInformation: Optional(String),
  teamPreference1: Optional(String),
  teamPreference2: Optional(String),
  teamPreference3: Optional(String),
  personsPreference: Optional(String),
  availableFirstFriday: Boolean,
  availableSaturday: Boolean,
  availableSunday: Boolean,
  availableMonday: Boolean,
  availableTuesday: Boolean,
  availableWednesday: Boolean,
  availableThursday: Boolean,
  availableLastFriday: Boolean,
  constraints: Optional(String),
  whatsApp: Boolean,
  acceptedTermsAndConditions: Boolean,
  consentNewlifeWills: Boolean,
  newlifeHaveWillInPlace: Boolean,
  newlifeHavePoaInPlace: Boolean,
  newlifeWantFreeReview: Boolean,
  version: Number,
  profileId: String,
  photoId: Optional(String),
  status: ModelApplicationStatusRunType,
});

export const ModelApplicationMetadataRunType = Record({
  applicationId: String,
});

export const ModelApplicationRunType = ModelApplicationMetadataRunType.extend(
  ModelCoreApplicationRunType.fields
);

export const ModelApplicationInfoRunType = ModelApplicationRunType.extend({
  profile: ModelProfileRunType,
});

// Application ID and version should not be included in an update request as they are managed
// by the model.
export const ModelApplicationChangesRunType = ModelApplicationRunType.omit(
  "applicationId",
  "version"
).asPartial();

export const ModelPersistedApplicationRunType = ModelApplicationRunType.extend({
  dbId: Number,
  lastSaved: String,
});

export type ModelApplicationStatus = Static<
  typeof ModelApplicationStatusRunType
>;

export type ModelApplication = Static<typeof ModelApplicationRunType>;

export type ModelApplicationInfo = Static<typeof ModelApplicationInfoRunType>;

export type ModelAddableApplication = ModelApplication;

export type ModelApplicationChanges = Static<
  typeof ModelApplicationChangesRunType
>;

export type PersistedApplication = Static<
  typeof ModelPersistedApplicationRunType
>;
