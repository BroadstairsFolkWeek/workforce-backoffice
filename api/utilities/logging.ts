import { Logger } from "@azure/functions";

let getLogger: () => Logger = () => {
  throw new Error("No getLogger function registered");
};

export const registerGetLogger = (func: () => Logger) => {
  getLogger = func;
};

export const logError = (...args: any[]) => getLogger().error(...args);
export const logWarn = (...args: any[]) => getLogger().warn(...args);
export const logInfo = (...args: any[]) => getLogger().info(...args);
export const logVerbose = (...args: any[]) => getLogger().verbose(...args);
export const logTrace = (...args: any[]) => getLogger()(...args);
