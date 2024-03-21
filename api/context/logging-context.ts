import { AsyncLocalStorage } from "async_hooks";
import { FunctionLogger, registerGetLogger } from "../utilities/logging";

export type LoggingAsyncContext = {
  logger: FunctionLogger;
};

const asyncLocalStorage = new AsyncLocalStorage<LoggingAsyncContext>();

registerGetLogger(() => {
  const context = getLoggingAsyncContext();
  return context.logger;
});

export const runWithLoggingAsyncContext = (
  context: LoggingAsyncContext,
  callback
) => {
  return asyncLocalStorage.run(context, callback);
};

export const getLoggingAsyncContext = () => {
  const context = asyncLocalStorage.getStore();
  if (!context) {
    throw new Error(
      "Attempt to retreive LoggingAsyncContext from callstack outside of runWithLoggingAsyncContext..."
    );
  }

  return context;
};
