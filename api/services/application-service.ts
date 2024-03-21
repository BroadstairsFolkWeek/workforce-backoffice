import { getApplications as modelGetApplications } from "../model/applications-repository";
import { Application } from "../model/interfaces/application";

export const getApplications = async (): Promise<Application[]> => {
  return modelGetApplications();
};
