import { callApiGet } from "../services/api-access";
import { PersistedApplication } from "./interfaces/application";

export const getApplications = async (
  groupId: string
): Promise<PersistedApplication[]> => {
  try {
    const applications: PersistedApplication[] = await callApiGet(
      "applications",
      groupId
    );
    return applications;
  } catch (err) {
    throw err;
  }
};
