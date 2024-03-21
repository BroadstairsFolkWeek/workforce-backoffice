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

export const TShirtSizeRunType = Union(
  Literal("S"),
  Literal("M"),
  Literal("L"),
  Literal("XL"),
  Literal("XXL")
);

export const AgeGroupRunType = Union(
  Literal("18-20"),
  Literal("21-25"),
  Literal("26-35"),
  Literal("36-55"),
  Literal("56-65"),
  Literal("66+")
);

export const ApplicationStatusRunType = Union(
  Literal("info-required"),
  Literal("profile-required"),
  Literal("photo-required"),
  Literal("documents-required"),
  Literal("ready-to-submit"),
  Literal("submitted"),
  Literal("complete")
);

export const CoreApplicationRunType = Record({
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
  tShirtSize: Optional(TShirtSizeRunType),
  ageGroup: Optional(AgeGroupRunType),
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
  status: ApplicationStatusRunType,
});

export const ApplicationMetadataRunType = Record({
  applicationId: String,
});

export const ApplicationRunType = ApplicationMetadataRunType.extend(
  CoreApplicationRunType.fields
);

// Application ID and version should not be included in an update request as they are managed
// by the model.
export const ApplicationChangesRunType = ApplicationRunType.omit(
  "applicationId",
  "version"
).asPartial();

export const PersistedApplicationRunType = ApplicationRunType.extend({
  dbId: Number,
  lastSaved: String,
});

export type Application = Static<typeof ApplicationRunType>;

export type AddableApplication = Application;

export type ApplicationChanges = Static<typeof ApplicationChangesRunType>;

export type PersistedApplication = Static<typeof PersistedApplicationRunType>;
