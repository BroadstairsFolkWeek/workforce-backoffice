import { Context, HttpRequest } from "@azure/functions";
import { runWithAppAsyncContext } from "../context/app-async-context";
import { runWithLoggingAsyncContext } from "../context/logging-context";
import { TeamsfxContext } from "../interfaces/teams-context";
import { isAuthenticated } from "../services/graph-client";
import { logTrace } from "../utilities/logging";

type ResponseObject = {
  [key: string]: any;
};

export const runAsAuthenticatedUser = async <R, TArgs extends any[]>(
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext,
  callback: (...args: TArgs) => R,
  ...args: TArgs
): Promise<ResponseObject> => {
  return runWithLoggingAsyncContext({ logger: context.log }, () => {
    logTrace(
      context.executionContext.functionName +
        ": entry. Invocation ID: " +
        context.executionContext.invocationId
    );

    if (!isAuthenticated(teamsfxContext)) {
      return { status: 401 };
    }

    return runWithAppAsyncContext({ teamsfxContext }, callback, ...args);
  });
};
