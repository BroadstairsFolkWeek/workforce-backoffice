import { Array, Effect, Option } from "effect";
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
import { ModelApplication } from "../model/interfaces/application";
import {
  ProfileNotFound,
  ProfilesRepository,
} from "../model/profiles-repository";
import { ModelProfile2, ModelProfileId } from "../model/interfaces/profile";
import { repositoriesLayerLive } from "../context/repositories-live";
import { isConfigError } from "effect/ConfigError";

const getProfiles = () =>
  ProfilesRepository.pipe(
    Effect.andThen((profilesRepo) => profilesRepo.modelGetProfiles())
  );

const findProfileForApplication =
  (profiles: readonly ModelProfile2[]) => (application: ModelApplication) =>
    Array.findFirst(
      profiles,
      (profile) => profile.profileId === application.profileId
    );

const findAndMergeProfileForApplication =
  (profiles: readonly ModelProfile2[]) => (application: ModelApplication) =>
    Option.map(findProfileForApplication(profiles)(application), (profile) => ({
      ...application,
      profile,
    }));

const mergeApplicationsAndProfiles =
  (profiles: readonly ModelProfile2[]) =>
  (applications: readonly ModelApplication[]) =>
    Array.flatMap(
      applications,
      Array.liftOption(findAndMergeProfileForApplication(profiles))
    );

const addProfilesToApplications = (applications: ModelApplication[]) =>
  TE.tryCatch(
    () => {
      const program = getProfiles().pipe(
        Effect.andThen((profiles) =>
          mergeApplicationsAndProfiles(profiles)(applications)
        )
      );

      const runnable = program.pipe(Effect.provide(repositoriesLayerLive));

      return Effect.runPromise(runnable);
    },
    (e) => e as Error
  );

export const getApplicationsTE = (): TE.TaskEither<
  Error,
  readonly ApplicationInfo[]
> => {
  return pipe(modelGetApplicationsTE(), TE.chain(addProfilesToApplications));
};

const getProfileForApplication = (application: ModelApplication) =>
  ProfilesRepository.pipe(
    Effect.andThen((profilesRepository) =>
      profilesRepository.modelGetProfileByProfileId(
        ModelProfileId.make(application.profileId)
      )
    )
  );

const addProfileToApplicationEffect = (application: ModelApplication) =>
  getProfileForApplication(application).pipe(
    Effect.andThen((profile) => ({
      ...application,
      profile,
    }))
  );

const addProfileToApplication = (
  application: ModelApplication
): TE.TaskEither<Error | "not-found", ApplicationInfo> =>
  TE.tryCatch(
    () => {
      const program = addProfileToApplicationEffect(application);

      const runnable = program.pipe(Effect.provide(repositoriesLayerLive));

      return Effect.runPromise(runnable);
    },
    (e) => {
      if (e instanceof ProfileNotFound) {
        return "not-found";
      }
      if (isConfigError(e)) {
        throw new Error("Configuration error");
      }
      return e as Error;
    }
  );

export const getApplication = (
  applicationId: string
): TE.TaskEither<Error | "not-found", ApplicationInfo> => {
  return pipe(
    modelGetApplicationTE(applicationId),
    TE.chain(addProfileToApplication)
  );
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
