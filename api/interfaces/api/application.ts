import { Static } from "runtypes";
import {
  ApplicationChangesRunType as ModelUpdatableApplicationRunType,
  PersistedApplicationRunType as ModelPersistedApplicationRunType,
} from "../../model/interfaces/application";

export const UpdateApplicationRequestDtoRunType =
  ModelUpdatableApplicationRunType;
export type UpdateApplicationRequestDto = Static<
  typeof UpdateApplicationRequestDtoRunType
>;

export const UpdateApplicationResponseDtoRunType =
  ModelPersistedApplicationRunType;
export type UpdateApplicationResponseDto = Static<
  typeof UpdateApplicationResponseDtoRunType
>;

const foo: UpdateApplicationRequestDto = {
  // version: 1,
  // telephone: "123",
  address: "123",
  emergencyContactName: "123",
  emergencyContactTelephone: "123",
  previousVolunteer: true,
  previousTeam: "123",
  firstAidCertificate: true,
  occupationOrSkills: "123",
  dbsDisclosureNumber: "123",
  dbsDisclosureDate: "123",
  camping: true,
  tShirtSize: "XL",
  ageGroup: "18-20",
  otherInformation: "123",
  teamPreference1: "123",
  // teamPreference2: "123",
  teamPreference3: "123",
  personsPreference: "123",
  availableFirstFriday: true,
  availableSaturday: true,
  // availableSunday: true,
  availableMonday: true,
  availableTuesday: true,
  availableWednesday: true,
  availableThursday: true,
  availableLastFriday: true,
  constraints: "123",
  whatsApp: true,
  acceptedTermsAndConditions: true,
  consentNewlifeWills: true,
  newlifeHaveWillInPlace: true,
  newlifeHavePoaInPlace: true,
  newlifeWantFreeReview: true,
  profileId: "123",
  photoId: "123",
  status: "submitted",
};
