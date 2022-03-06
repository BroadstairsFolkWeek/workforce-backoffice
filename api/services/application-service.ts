import { PersistedApplicationListItem } from "../model/interfaces/sp/application-sp";
import { getApplications as graphGetApplications } from "../model/graph/applications-graph";

export const getApplications = async (): Promise<
  PersistedApplicationListItem[]
> => {
  return graphGetApplications();
};
