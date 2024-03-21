import {
  Application as apiApplication,
  ApplicationChanges as apiApplicationChanges,
} from "../../api/model/interfaces/application";
import { PersistedProfile } from "../model/interfaces/profile";

export type Application = apiApplication;

export interface ApplicationData extends Application {
  profile: PersistedProfile | undefined;
}

export type ApplicationStatus = Application["status"];

export type ApplicationChanges = apiApplicationChanges;
