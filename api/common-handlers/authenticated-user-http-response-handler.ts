import {
  FunctionResult,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { runWithAppAsyncContext } from "../context/app-async-context";
import { runWithLoggingAsyncContext } from "../context/logging-context";
import { TeamsfxContext } from "../interfaces/teams-context";
import { isAuthenticated } from "../services/graph-client";
import { logTrace } from "../utilities/logging";

type ResponseObject = HttpResponseInit;
export const runAsAuthenticatedUser = async <
  R extends ResponseObject,
  TArgs extends any[]
>(
  invocationContext: InvocationContext,
  req: HttpRequest,
  callback: (...args: TArgs) => FunctionResult<R>,
  ...args: TArgs
): Promise<ResponseObject> => {
  return runWithLoggingAsyncContext({ logger: invocationContext }, () => {
    logTrace(
      `${invocationContext.functionName}: entry. Invocation ID: ${invocationContext.invocationId}`
    );

    const teamsfxContext: TeamsfxContext = invocationContext.extraInputs.get(
      "teamsfxContext"
    ) as TeamsfxContext;

    if (!isAuthenticated(teamsfxContext)) {
      return { status: 401 };
    }

    return runWithAppAsyncContext({ teamsfxContext }, callback, ...args);
  });
};
