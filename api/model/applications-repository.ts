import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { logTrace, logWarn } from "../utilities/logging";
import {
  Application,
  ApplicationChanges,
  ApplicationInfo,
  PersistedApplication,
} from "./interfaces/application";
import {
  PersistedApplicationListItem,
  UpdatableApplicationListItem,
} from "./interfaces/sp/application-sp";
import {
  getApplicationGraphListItem,
  getApplicationGraphListItems,
  saveApplicationGraphListItemChanges,
} from "./graph/applications-repository-graph";
import { getProfileById, getProfilesByIds } from "./profiles-repository";

const listItemToTShirtSize = (
  item: PersistedApplicationListItem
): PersistedApplication["tShirtSize"] => {
  switch (item.TShirtSize) {
    case "S":
    case "M":
    case "L":
    case "XL":
    case "XXL":
    case null:
      return item.TShirtSize;
    default:
      throw new Error(
        "Invalid TShirtSize read from PersistedApplicationListItem: " +
          item.TShirtSize
      );
  }
};

const listItemToAgeGroup = (
  item: PersistedApplicationListItem
): PersistedApplication["ageGroup"] => {
  switch (item.AgeGroup) {
    case "18-20":
    case "21-25":
    case "26-35":
    case "36-55":
    case "56-65":
    case "66+":
    case null:
      return item.AgeGroup;
    default:
      throw new Error(
        "Invalid AgeGroup read from PersistedApplicationListItem: " +
          item.AgeGroup
      );
  }
};

const listItemToStatus = (
  item: PersistedApplicationListItem
): PersistedApplication["status"] => {
  switch (item.Status) {
    case "info-required":
    case "profile-required":
    case "photo-required":
    case "documents-required":
    case "ready-to-submit":
    case "submitted":
    case "complete":
      return item.Status;
    default:
      throw new Error(
        "Invalid Status read from PersistedApplicationListItem: " + item.Status
      );
  }
};

const listItemToApplication = (
  item: PersistedApplicationListItem
): Application => {
  return {
    applicationId: item.ApplicationId,
    telephone: item.Telephone ?? undefined,
    address: item.Address ?? undefined,
    emergencyContactName: item.EmergencyContactName ?? undefined,
    emergencyContactTelephone: item.EmergencyContactTelephone ?? undefined,
    previousVolunteer: item.PreviousVolunteer ?? undefined,
    previousTeam: item.PreviousTeam ?? undefined,
    firstAidCertificate: item.FirstAidCertificate ?? undefined,
    occupationOrSkills: item.OccupationOrSkills ?? undefined,
    dbsDisclosureNumber: item.DbsDisclosureNumber ?? undefined,
    dbsDisclosureDate: item.DbsDisclosureDate ?? undefined,
    camping: item.Camping ?? undefined,
    tShirtSize: listItemToTShirtSize(item) ?? undefined,
    ageGroup: listItemToAgeGroup(item) ?? undefined,
    otherInformation: item.OtherInformation ?? undefined,
    teamPreference1: item.TeamPreference1 ?? undefined,
    teamPreference2: item.TeamPreference2 ?? undefined,
    teamPreference3: item.TeamPreference3 ?? undefined,
    personsPreference: item.PersonsPreference ?? undefined,
    photoId: item.PhotoId ?? undefined,
    availableFirstFriday: item.AvailableFirstFriday,
    availableSaturday: item.AvailableSaturday,
    availableSunday: item.AvailableSunday,
    availableMonday: item.AvailableMonday,
    availableTuesday: item.AvailableTuesday,
    availableWednesday: item.AvailableWednesday,
    availableThursday: item.AvailableThursday,
    availableLastFriday: item.AvailableLastFriday,
    constraints: item.Constraints,
    whatsApp: item.WhatsApp ?? false,
    acceptedTermsAndConditions: item.AcceptedTermsAndConditions ?? false,
    consentNewlifeWills: item.ConsentNewlifeWills ?? false,
    newlifeHaveWillInPlace: item.NewlifeHaveWillInPlace ?? false,
    newlifeHavePoaInPlace: item.NewlifeHavePoaInPlace ?? false,
    newlifeWantFreeReview: item.NewlifeWantFreeReview ?? false,
    version: item.Version,
    profileId: item.ProfileId,
    status: listItemToStatus(item),
  };
};

const addProfilesToApplications = async (
  applications: Application[]
): Promise<Array<ApplicationInfo>> => {
  const profileIds = applications.map((application) => application.profileId);
  const profiles = await getProfilesByIds(profileIds);

  return applications.map((application) => {
    const profile = profiles.find(
      (profile) => profile.profileId === application.profileId
    );
    if (!profile) {
      logWarn(
        "Profile not found for application: " + application.applicationId
      );
    }

    return {
      ...application,
      profile,
    };
  });
};

const addProfileToApplication = async (
  application: Application
): Promise<ApplicationInfo> => {
  const profile = await getProfileById(application.profileId);
  return {
    ...application,
    profile,
  };
};

export const getApplications = async (): Promise<Array<ApplicationInfo>> => {
  logTrace("In applications: getApplications");

  const applicationGraphListItems = await getApplicationGraphListItems();
  console.log(
    `Got applicationGraphListItems. Typeof: ${typeof applicationGraphListItems}`
  );
  console.log(JSON.stringify(applicationChangesToListItem));

  const applications = applicationGraphListItems.map((item) =>
    listItemToApplication(item.fields)
  );

  return addProfilesToApplications(applications);
};

export const getApplication = async (
  applicationId: string
): Promise<Application | null> => {
  logTrace(`In applications: getApplication(${applicationId})`);

  const applicationGraphListItem = await getApplicationGraphListItem(
    applicationId
  );
  if (applicationGraphListItem) {
    const application = listItemToApplication(applicationGraphListItem.fields);
    return addProfileToApplication(application);
  }

  return null;
};

export const getApplicationTE = (
  applicationId: string
): TE.TaskEither<Error | "not-found", Application> => {
  return pipe(
    TE.tryCatch(
      () => getApplication(applicationId),
      (error) => error as Error
    ),
    TE.chain((application) =>
      application ? TE.right(application) : TE.left("not-found")
    )
  );
};

const applicationChangesToListItem = (
  changes: ApplicationChanges
): UpdatableApplicationListItem => {
  return {
    AcceptedTermsAndConditions: changes.acceptedTermsAndConditions,
    Address: changes.address,
    AgeGroup: changes.ageGroup,
    AvailableFirstFriday: changes.availableFirstFriday,
    AvailableLastFriday: changes.availableLastFriday,
    AvailableMonday: changes.availableMonday,
    AvailableSaturday: changes.availableSaturday,
    AvailableSunday: changes.availableSunday,
    AvailableThursday: changes.availableThursday,
    AvailableTuesday: changes.availableTuesday,
    AvailableWednesday: changes.availableWednesday,
    Camping: changes.camping,
    ConsentNewlifeWills: changes.consentNewlifeWills,
    Constraints: changes.constraints,
    DbsDisclosureDate: changes.dbsDisclosureDate,
    DbsDisclosureNumber: changes.dbsDisclosureNumber,
    EmergencyContactName: changes.emergencyContactName,
    EmergencyContactTelephone: changes.emergencyContactTelephone,
    FirstAidCertificate: changes.firstAidCertificate,
    NewlifeHavePoaInPlace: changes.newlifeHavePoaInPlace,
    NewlifeHaveWillInPlace: changes.newlifeHaveWillInPlace,
    NewlifeWantFreeReview: changes.newlifeWantFreeReview,
    OccupationOrSkills: changes.occupationOrSkills,
    OtherInformation: changes.otherInformation,
    PersonsPreference: changes.personsPreference,
    PhotoId: changes.photoId,
    PreviousTeam: changes.previousTeam,
    PreviousVolunteer: changes.previousVolunteer,
    ProfileId: changes.profileId,
    Status: changes.status,
    TShirtSize: changes.tShirtSize,
    TeamPreference1: changes.teamPreference1,
    TeamPreference2: changes.teamPreference2,
    TeamPreference3: changes.teamPreference3,
    Telephone: changes.telephone,
    WhatsApp: changes.whatsApp,
  };
};

export const saveApplicationChanges = (
  applicationId: string,
  changes: ApplicationChanges,
  applyToVersion: number
): TE.TaskEither<
  Error | "not-found" | "conflict",
  PersistedApplicationListItem
> => {
  return pipe(
    getApplicationTE(applicationId),
    TE.chainW((application) =>
      application.version === applyToVersion
        ? TE.right(application)
        : TE.left("conflict" as const)
    ),
    TE.bindTo("application"),
    TE.bind("changedFields", () =>
      TE.of({
        ...applicationChangesToListItem(changes),
        Version: applyToVersion + 1,
      })
    ),
    TE.chainW(({ application, changedFields }) =>
      saveApplicationGraphListItemChanges(applicationId, changedFields)
    )
  );
};
