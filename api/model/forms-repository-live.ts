import { Context, Effect, Layer } from "effect";
import { Schema } from "@effect/schema";

import { WfApiClient } from "../wf-api/wf-client";
import { FormsRepository } from "./forms-repository";
import { Form } from "./interfaces/form";

type WfApiClientType = Context.Tag.Service<WfApiClient>;

const FormsApiResponseSchema = Schema.Struct({
  data: Schema.Array(Form),
});

const getForms = (apiClient: WfApiClientType) => () =>
  apiClient
    .getJson(`/api/forms`)
    .pipe(
      Effect.andThen(Schema.decodeUnknown(FormsApiResponseSchema)),
      Effect.andThen((response) => response.data)
    )
    .pipe(
      Effect.catchTags({
        RequestError: (e) => Effect.die("Failed to get forms: " + e),
        ResponseError: (e) => Effect.die("Failed to get forms: " + e),
        // Parse errors of data from the WF API are considered unrecoverable.
        ParseError: (e) => Effect.die(e),
      })
    );

export const formsRepositoryLive = Layer.effect(
  FormsRepository,
  Effect.all([WfApiClient]).pipe(
    Effect.andThen(([wfApiClient]) =>
      FormsRepository.of({
        modelGetForms: getForms(wfApiClient),
      })
    )
  )
);
