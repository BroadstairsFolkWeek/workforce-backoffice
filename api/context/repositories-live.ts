import { Layer } from "effect";
import { wfApiClientLive } from "../wf-api/wf-client-live";
import { profilesRepositoryLive } from "../model/profiles-repository-live";
import { formsRepositoryLive } from "../model/forms-repository-live";

export const repositoriesLayerLive = Layer.mergeAll(
  profilesRepositoryLive,
  formsRepositoryLive
).pipe(Layer.provide(wfApiClientLive));
