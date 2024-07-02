import { Effect, Layer } from "effect";
import { Schema } from "@effect/schema";

import { WfApiClient } from "../wf-api/wf-client";
import { ProfileNotFound, ProfilesRepository } from "./profiles-repository";
import { ModelProfile2 } from "./interfaces/profile";

const SingleProfileApiResponseSchema = Schema.Struct({
  data: ModelProfile2,
});

const MultipleProfileApiResponseSchema = Schema.Struct({
  data: Schema.Array(ModelProfile2),
});

const getProfileByProfileId = (profileId: string) =>
  WfApiClient.pipe(
    Effect.andThen((apiClient) =>
      apiClient.getJson(`/api/profiles/${profileId}/profile`)
    ),
    Effect.andThen(Schema.decodeUnknown(SingleProfileApiResponseSchema)),
    Effect.andThen((response) => response.data)
  ).pipe(
    Effect.catchTags({
      RequestError: (e) => Effect.die("Failed to get profile by user id: " + e),
      ResponseError: (e) => {
        switch (e.response.status) {
          case 404:
            return Effect.fail(new ProfileNotFound());
          default:
            return Effect.die("Failed to get profile by user id: " + e);
        }
      },
      // Parse errors of data from the WF API are considered unrecoverable.
      ParseError: (e) => Effect.die(e),
    })
  );

const getProfiles = () =>
  WfApiClient.pipe(
    Effect.andThen((apiClient) => apiClient.getJson(`/api/profiles`)),
    Effect.andThen(Schema.decodeUnknown(MultipleProfileApiResponseSchema)),
    Effect.andThen((response) => response.data)
  ).pipe(
    Effect.catchTags({
      RequestError: (e) => Effect.die("Failed to get profiles: " + e),
      ResponseError: (e) => {
        switch (e.response.status) {
          default:
            return Effect.die("Failed to get profiles: " + e);
        }
      },
      // Parse errors of data from the WF API are considered unrecoverable.
      ParseError: (e) => Effect.die(e),
    })
  );

export const profilesRepositoryLive = Layer.effect(
  ProfilesRepository,
  Effect.all([WfApiClient]).pipe(
    Effect.andThen(([wfApiClient]) => ({
      modelGetProfileByProfileId: (profileId: string) =>
        getProfileByProfileId(profileId).pipe(
          Effect.provideService(WfApiClient, wfApiClient)
        ),

      modelGetProfiles: () =>
        getProfiles().pipe(Effect.provideService(WfApiClient, wfApiClient)),
    }))
  )
);
