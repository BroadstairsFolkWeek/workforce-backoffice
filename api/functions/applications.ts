import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getApplications } from "../services/application-service";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { sanitiseApplication } from "./utilities/applications-api-sanitise";
import { logError } from "../utilities/logging";

export const applicationsHttpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const applications = await getApplications();

    return pipe(
      applications,
      A.map(sanitiseApplication),
      E.sequenceArray,
      E.fold(
        (validationErr) => {
          logError(
            "Error sanitising applications response: " +
              JSON.stringify(validationErr)
          );
          return {
            status: 500,
          } as HttpResponseInit;
        },
        (applications) =>
          ({
            status: 200,
            jsonBody: applications,
          } as HttpResponseInit)
      )
    );
  });
};

export default applicationsHttpTrigger;
