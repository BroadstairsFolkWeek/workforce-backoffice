import { getAppAsyncContext } from "../../context/app-async-context";
import { List, Site } from "@microsoft/microsoft-graph-types";
import { logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import { PersistedApplicationListItem } from "../interfaces/sp/application-sp";
import { PersistedApplication } from "../interfaces/application";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";

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
    version: item.Version,
    profileId: item.ProfileId,
    dbId: item.id,
    lastSaved: item.Modified,
    status: listItemToStatus(item),
  };
};

export const getApplications = async () => {
  const context = getAppAsyncContext();
  const graphClient = getOboGraphClient();

  const site: Site = await graphClient
    .api(`/groups/${context.groupId}/sites/root`)
    .get();

  logTrace("Site from group: " + JSON.stringify(site, null, 2));

  const siteId = site.id;

  const workforceApplicationsList: List = await graphClient
    .api(`/sites/${siteId}/lists/Workforce Applications`)
    .get();

  const workforceApplicationsListId = workforceApplicationsList.id;

  const workforceApplicationListItems: PersistedGraphListItem<PersistedApplicationListItem>[] =
    (
      await graphClient
        .api(`/sites/${siteId}/lists/${workforceApplicationsListId}/items`)
        .expand("fields")
        .get()
    ).value;

  return workforceApplicationListItems.map((item) =>
    listItemToApplication(item.fields)
  );
};
