import { Config, Effect, Layer } from "effect";
import { Logger as EffectLogger } from "effect";
import { Debug, Error, Info, None, Trace, Warning } from "effect/LogLevel";
import { InvocationContext } from "@azure/functions";

export const logLevelLive = Config.logLevel("LOG_LEVEL").pipe(
  Effect.andThen((level) => EffectLogger.minimumLogLevel(level)),
  Layer.unwrapEffect
);

export const createEffectLogger = (context: InvocationContext) => {
  return EffectLogger.make(({ logLevel, message }) => {
    switch (logLevel) {
      case None:
        break;
      case Trace:
        context.trace(message);
        break;
      case Debug:
        context.debug(message);
        break;
      case Info:
        context.info(message);
        break;
      case Warning:
        context.warn(message);
        break;
      case Error:
        context.error(message);
        break;
      default:
        context.log(message);
        break;
    }
  });
};

export const createLoggerLayer = (context: InvocationContext) =>
  EffectLogger.replace(EffectLogger.defaultLogger, createEffectLogger(context));
