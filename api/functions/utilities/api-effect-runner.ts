import { Effect } from "effect";
import { ConfigError } from "effect/ConfigError";
import { repositoriesLayerLive } from "../../context/repositories-live";
import { FormsRepository } from "../../model/forms-repository";
import { createLoggerLayer, logLevelLive } from "./api-logging";
import { ProfilesRepository } from "../../model/profiles-repository";
import { InvocationContext } from "@azure/functions";

export const runApiEffect = async <A extends any>(
  program: Effect.Effect<A, ConfigError, FormsRepository | ProfilesRepository>,
  context: InvocationContext
) => {
  const logLayer = createLoggerLayer(context);

  const runnable: Effect.Effect<A, ConfigError> = program.pipe(
    Effect.provide(repositoriesLayerLive),
    Effect.provide(logLayer),
    Effect.provide(logLevelLive)
  );

  return await Effect.runPromise(runnable);
};
