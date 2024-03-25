import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types";
import { Profile } from "./profile-data";

const TShirtSize = t.union([
  t.literal("S"),
  t.literal("M"),
  t.literal("L"),
  t.literal("XL"),
  t.literal("XXL"),
]);

const AgeGroup = t.union([
  t.literal("18-20"),
  t.literal("21-25"),
  t.literal("26-35"),
  t.literal("36-55"),
  t.literal("56-65"),
  t.literal("66+"),
]);

export const ApplicationStatus = t.union([
  t.literal("info-required"),
  t.literal("profile-required"),
  t.literal("photo-required"),
  t.literal("documents-required"),
  t.literal("ready-to-submit"),
  t.literal("submitted"),
  t.literal("complete"),
]);

// Set of fields that are optional for an application.
const applicationPartialFields = {
  telephone: t.string,
  address: t.string,
  emergencyContactName: t.string,
  emergencyContactTelephone: t.string,
  previousVolunteer: t.boolean,
  previousTeam: t.string,
  firstAidCertificate: t.boolean,
  occupationOrSkills: t.string,
  dbsDisclosureNumber: t.string,
  dbsDisclosureDate: t.string,
  camping: t.boolean,
  tShirtSize: TShirtSize,
  ageGroup: AgeGroup,
  otherInformation: t.string,
  teamPreference1: t.string,
  teamPreference2: t.string,
  teamPreference3: t.string,
  personsPreference: t.string,
  constraints: t.string,
  photoId: t.string,
};

// Set of fields that must be present for an application.
const applicationRequiredFields = {
  availableFirstFriday: t.boolean,
  availableSaturday: t.boolean,
  availableSunday: t.boolean,
  availableMonday: t.boolean,
  availableTuesday: t.boolean,
  availableWednesday: t.boolean,
  availableThursday: t.boolean,
  availableLastFriday: t.boolean,
  whatsApp: t.boolean,
  acceptedTermsAndConditions: t.boolean,
  consentNewlifeWills: t.boolean,
  newlifeHaveWillInPlace: t.boolean,
  newlifeHavePoaInPlace: t.boolean,
  newlifeWantFreeReview: t.boolean,
  profileId: t.string,
};

const applicationMetadata = {
  applicationId: t.string,
  status: ApplicationStatus,
  version: t.number,
  createdDate: DateFromISOString,
  modifiedDate: DateFromISOString,
};

// Application type that is a combination of the optional and required fields.
const Application = t.intersection([
  t.partial(applicationPartialFields),
  t.type(applicationRequiredFields),
  t.type(applicationMetadata),
]);

export const ApplicationInfo = t.intersection([
  Application,
  t.partial({ profile: Profile }),
]);

// Type of a collection of updates which can be applied to an application.
export const ApplicationUpdates = t.intersection([
  t.partial(applicationPartialFields),
  t.partial(applicationRequiredFields),
]);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationInfo = t.TypeOf<typeof ApplicationInfo>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationStatus = t.TypeOf<typeof ApplicationStatus>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationUpdates = t.TypeOf<typeof ApplicationUpdates>;
