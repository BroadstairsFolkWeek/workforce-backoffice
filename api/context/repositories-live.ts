import { Layer } from "effect";
import { wfApiClientLive } from "../wf-api/wf-client-live";
import { profilesRepositoryLive } from "../model/profiles-repository-live";

export const repositoriesLayerLive = Layer.mergeAll(
  profilesRepositoryLive
).pipe(Layer.provide(wfApiClientLive));
