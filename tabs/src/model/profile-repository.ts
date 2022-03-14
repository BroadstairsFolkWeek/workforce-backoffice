import { callApiGet } from "../services/api-access";
import { PersistedProfile } from "./interfaces/profile";

export const getProfiles = async (
  groupId: string
): Promise<PersistedProfile[]> => {
  try {
    const profiles: PersistedProfile[] = await callApiGet("profiles", groupId);
    return profiles;
  } catch (err) {
    throw err;
  }
};
