import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getApplicationsTE } from "../applications/application-service";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { logError } from "../utilities/logging";
import { sanitiseGetApplicationsResponse } from "./utilities/sanitise-applications-api";
import { isApiOutputValidationError } from "./utilities/sanitise";

export const httpGetApplications = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const task = pipe(
      getApplicationsTE(),
      TE.map((applications) => ({ applications })),
      TE.chainEitherKW(sanitiseGetApplicationsResponse),
      TE.fold(
        (validationErr) => {
          if (isApiOutputValidationError(validationErr)) {
            logError(
              "Error sanitising GetApplications response: " +
                JSON.stringify(validationErr.errors)
            );
          } else {
            logError(
              "Error in GetApplications: " + JSON.stringify(validationErr)
            );
          }
          return T.of({
            status: 500,
          });
        },
        (response) =>
          T.of({
            status: 200,
            jsonBody: response,
          })
      )
    );

    return await task();
  });
};

export default httpGetApplications;
