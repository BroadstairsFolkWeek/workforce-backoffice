import { List } from "@microsoft/microsoft-graph-types";
import { logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import { PersistedApplicationListItem } from "../interfaces/sp/application-sp";
import { PersistedApplication } from "../interfaces/application";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";
import { getSiteBaseApiPath } from "./site-graph";

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
): PersistedApplication => {
  return {
    applicationId: item.ApplicationId,
    title: item.Title,
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
    whatsapp: item.WhatsApp,
    acceptedTermsAndConditions: item.AcceptedTermsAndConditions,
    consentNewlifeWills: item.ConsentNewlifeWills,
    version: item.Version,
    profileId: item.ProfileId,
    dbId: item.id,
    lastSaved: item.Modified,
    status: listItemToStatus(item),
  };
};

export const getApplications = async () => {
  logTrace("In applications-graph: getApplications");
  const siteBaseApiPath = await getSiteBaseApiPath();

  const graphClient = getOboGraphClient();

  const listByTitleApiPath = `${siteBaseApiPath}/lists/Workforce Applications`;
  logTrace(
    "Looking up Workforce Applications list via Graph: " + listByTitleApiPath
  );
  const workforceApplicationsList: List = await graphClient
    .api(listByTitleApiPath)
    .get();
  logTrace(
    "List lookup response: " +
      JSON.stringify(workforceApplicationsList, null, 2)
  );

  const workforceApplicationsListId = workforceApplicationsList.id;
  logTrace("Workforce Applications list ID: " + workforceApplicationsListId);

  const listItemsApiPath = `${siteBaseApiPath}/lists/${workforceApplicationsListId}/items`;
  logTrace("Lookup up application list items via Graph: " + listItemsApiPath);
  const workforceApplicationListItems: PersistedGraphListItem<PersistedApplicationListItem>[] =
    (await graphClient.api(listItemsApiPath).expand("fields").get()).value;
  logTrace("Returned items count: " + workforceApplicationListItems.length);

  return workforceApplicationListItems.map((item) =>
    listItemToApplication(item.fields)
  );
};
