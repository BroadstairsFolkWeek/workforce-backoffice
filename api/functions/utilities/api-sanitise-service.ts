import {
  Application,
  SaveApplicationChangesRequest,
  SaveApplicationChangesRequestRunType,
} from "../interfaces/applications-api";

const API_SANITISE_SERVICE_ERROR_TYPE_VAL =
  "sanitise-service-error-5285b9b9-b97e-4585-a0ee-bb4e8e311ea4";

type ApiSanitiseServiceErrorType = "invalid-request";

export class ApiSantiiseServiceError {
  private type: typeof API_SANITISE_SERVICE_ERROR_TYPE_VAL =
    API_SANITISE_SERVICE_ERROR_TYPE_VAL;
  public error: ApiSanitiseServiceErrorType;
  public arg1: any | null;

  constructor(error: ApiSanitiseServiceErrorType, arg1?: any) {
    this.error = error;
    this.arg1 = arg1 ?? null;
  }
}

export function isApiSanitiseServiceError(
  obj: any
): obj is ApiSantiiseServiceError {
  return obj?.type === API_SANITISE_SERVICE_ERROR_TYPE_VAL;
}

const removeNullProperties = <T>(obj: T) => {
  for (const prop in obj) {
    if (obj[prop] === null) {
      delete obj[prop];
    }
  }
};

export const sanitiseSaveApplicationRequest = (
  maybeSaveRequestDto: any
): SaveApplicationChangesRequest => {
  removeNullProperties(maybeSaveRequestDto);
  const saveRequestDto =
    SaveApplicationChangesRequestRunType.check(maybeSaveRequestDto);

  const changesDto = saveRequestDto.changes;

  const sanitisedUpdateApplicationRequestDto: SaveApplicationChangesRequest = {
    changedVersion: saveRequestDto.changedVersion,
    changes: {
      telephone: changesDto.telephone,
      address: changesDto.address,
      emergencyContactName: changesDto.emergencyContactName,
      emergencyContactTelephone: changesDto.emergencyContactTelephone,
      previousVolunteer: changesDto.previousVolunteer,
      previousTeam: changesDto.previousTeam,
      firstAidCertificate: changesDto.firstAidCertificate,
      occupationOrSkills: changesDto.occupationOrSkills,
      dbsDisclosureNumber: changesDto.dbsDisclosureNumber,
      dbsDisclosureDate: changesDto.dbsDisclosureDate,
      camping: changesDto.camping,
      tShirtSize: changesDto.tShirtSize,
      ageGroup: changesDto.ageGroup,
      otherInformation: changesDto.otherInformation,
      teamPreference1: changesDto.teamPreference1,
      teamPreference2: changesDto.teamPreference2,
      teamPreference3: changesDto.teamPreference3,
      personsPreference: changesDto.personsPreference,
      availableFirstFriday: changesDto.availableFirstFriday,
      availableSaturday: changesDto.availableSaturday,
      availableSunday: changesDto.availableSunday,
      availableMonday: changesDto.availableMonday,
      availableTuesday: changesDto.availableTuesday,
      availableWednesday: changesDto.availableWednesday,
      availableThursday: changesDto.availableThursday,
      availableLastFriday: changesDto.availableLastFriday,
      constraints: changesDto.constraints,
      whatsApp: changesDto.whatsApp,
      consentNewlifeWills: changesDto.consentNewlifeWills,
      newlifeHaveWillInPlace: changesDto.newlifeHaveWillInPlace,
      newlifeHavePoaInPlace: changesDto.newlifeHavePoaInPlace,
      newlifeWantFreeReview: changesDto.newlifeWantFreeReview,
      acceptedTermsAndConditions: changesDto.acceptedTermsAndConditions,
    },
  };

  return sanitisedUpdateApplicationRequestDto;
};

export const sanitiseApplication = (maybeApplication: any) => {
  return Application.decode(maybeApplication);
};
