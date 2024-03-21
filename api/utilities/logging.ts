import * as IO from "fp-ts/lib/IO";

export interface FunctionLogger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  trace: (...args: any[]) => void;
}

let getLogger: () => FunctionLogger = () => {
  throw new Error("No getLogger function registered");
};

export const registerGetLogger = (func: () => FunctionLogger) => {
  getLogger = func;
};

export const logError = (...args: any[]) => getLogger().error(...args);
export const logWarn = (...args: any[]) => getLogger().warn(...args);
export const logInfo = (...args: any[]) => getLogger().info(...args);
export const logTrace = (...args: any[]) => getLogger().trace(...args);

export const logTraceIO = (message: string) => {
  logTrace(message);
  return IO.of(undefined);
};
