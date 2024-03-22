import { getApplications as modelGetApplications } from "../model/applications-repository";
import { ApplicationInfo } from "../model/interfaces/application";

export const getApplications = async (): Promise<ApplicationInfo[]> => {
  return modelGetApplications();
};
