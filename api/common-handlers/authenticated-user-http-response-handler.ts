import { Context, HttpRequest } from "@azure/functions";
import { loadConfiguration } from "@microsoft/teamsfx";
import { runWithAppAsyncContext } from "../context/app-async-context";
import { runWithLoggingAsyncContext } from "../context/logging-context";
import { TeamsfxContext } from "../interfaces/teams-context";
import { isAuthenticated } from "../services/graph-client";
import { logError, logTrace, logWarn } from "../utilities/logging";

type ResponseObject = {
  [key: string]: any;
};

export const runAsAuthenticatedUserWithGroup = async <R, TArgs extends any[]>(
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

    if (!req.query.groupId) {
      logWarn("No groupId provided");
      return {
        status: 400,
        body: {
          error: "No groupId query parameter",
        },
      };
    }

    const groupId: string = req.query.groupId;
    logTrace("groupId: " + groupId);

    // Set default configuration for teamsfx SDK.
    try {
      loadConfiguration();
    } catch (e) {
      logError(e);
      return {
        status: 500,
        body: {
          error: "Failed to load app configuration.",
        },
      };
    }

    if (!isAuthenticated(teamsfxContext)) {
      return { status: 401 };
    }

    return runWithAppAsyncContext(
      { groupId, teamsfxContext },
      callback,
      ...args
    );
  });
};
