import { AsyncLocalStorage } from "async_hooks";
import { TeamsfxContext } from "../interfaces/teams-context";

export type AppAsyncContext = {
  groupId: string;
  teamsfxContext: TeamsfxContext;
  store: { [key: string]: any };
};

const asyncLocalStorage = new AsyncLocalStorage<AppAsyncContext>();

export const runWithAppAsyncContext = <R, TArgs extends any[]>(
  context: Omit<AppAsyncContext, "store">,
  callback: (...args: TArgs) => R,
  ...args: TArgs
): R => {
  return asyncLocalStorage.run({ ...context, store: {} }, callback, ...args);
};

export const getAppAsyncContext = () => {
  const context = asyncLocalStorage.getStore();
  if (!context) {
    throw new Error(
      "Attempt to retreive AppAsyncContext from callstack outside of runWithAppAsyncContext."
    );
  }

  return context;
};
