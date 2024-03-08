import { getApplications as graphGetApplications } from "../model/graph/applications-graph";
import { PersistedApplication } from "../model/interfaces/application";

export const getApplications = async (): Promise<PersistedApplication[]> => {
  return graphGetApplications();
};
