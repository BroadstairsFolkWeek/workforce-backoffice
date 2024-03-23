import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import {
  modelGetApplicationTE,
  modelGetApplicationsTE,
  modelSaveApplicationChanges,
} from "../model/applications-repository";
import {
  ApplicationInfo,
  ApplicationStatus,
  ApplicationUpdates,
} from "../interfaces/applications";

export const getApplicationsTE = (): TE.TaskEither<
  Error,
  ApplicationInfo[]
> => {
  return modelGetApplicationsTE();
};

export const getApplication = (
  applicationId: string
): TE.TaskEither<Error | "not-found", ApplicationInfo> => {
  return modelGetApplicationTE(applicationId);
};

export const updateApplication =
  (applicationId: string) =>
  (applyToVersion: number) =>
  (
    changes: ApplicationUpdates
  ): TE.TaskEither<Error | "not-found" | "conflict", ApplicationInfo> => {
    return modelSaveApplicationChanges(applicationId)(applyToVersion)(changes);
  };

export const setApplicationStatus =
  (applicationId: string) =>
  (applyToVersion: number) =>
  (
    status: ApplicationStatus
  ): TE.TaskEither<Error | "not-found" | "conflict", ApplicationInfo> => {
    return pipe(
      { status: status },
      modelSaveApplicationChanges(applicationId)(applyToVersion)
    );
  };
