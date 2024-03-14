import { PersistedApplication } from "../model/interfaces/application";
import { PersistedProfile } from "../model/interfaces/profile";

export interface ApplicationData extends PersistedApplication {
  profile: PersistedProfile | undefined;
}
