import {
  ApplicationInfo as apiApplication,
  ApplicationUpdates as apiApplicationChanges,
} from "../../api/functions/interfaces/applications-api";

export type Application = apiApplication;

export interface ApplicationData extends Application {}

export type ApplicationStatus = Application["status"];

export type ApplicationChanges = apiApplicationChanges;
