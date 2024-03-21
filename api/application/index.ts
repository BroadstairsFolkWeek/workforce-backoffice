import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TeamsfxContext } from "../interfaces/teams-context";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import {
  getApplicationTE,
  saveApplicationChanges,
} from "../model/applications-repository";
import { logTrace } from "../utilities/logging";
import { SaveApplicationChangesRequest } from "../api/interfaces/applications-api";

const handleGetApplication = async function (
  applicationId: string
): Promise<Context["res"]> {
  const getApplicationResponseTask = pipe(
    applicationId,
    getApplicationTE,
    TE.fold(
      (err) => {
        if (err === "not-found") {
          return T.of({
            status: 404,
          });
        } else {
          logTrace("Error: " + err);
          return T.of({
            status: 500,
          });
        }
      },
      (application) => {
        return T.of({
          status: 200,
          body: JSON.stringify(application),
        });
      }
    )
  );

  return await getApplicationResponseTask();
};

const handlePatchApplication = async function (
  applicationId: string,
  changeRequest: SaveApplicationChangesRequest
): Promise<Context["res"]> {
  const applyToVersion = changeRequest.changedVersion;
  const changes = changeRequest.changes;

  const patchApplicationResponseTask = pipe(
    saveApplicationChanges(applicationId, changes, applyToVersion),
    TE.fold(
      (err) => {
        if (err === "not-found") {
          return T.of({
            status: 404,
          });
        } else if (err === "conflict") {
          return T.of({
            status: 409,
          });
        } else {
          logTrace("Error: " + err);
          return T.of({
            status: 500,
          });
        }
      },
      (application) => {
        return T.of({
          status: 200,
          body: JSON.stringify(application),
        });
      }
    )
  );

  return await patchApplicationResponseTask();
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<void> {
  context.res = await runAsAuthenticatedUser(
    context,
    req,
    teamsfxContext,
    async () => {
      if (req.method !== "GET" && req.method !== "PATCH") {
        logTrace(`application: Invalid HTTP method: ${req.method}`);
        return {
          status: 405,
          headers: {
            Allow: "GET, PATCH",
          },
        };
      }

      const applicationId: string = context.bindingData.applicationId;
      if (!applicationId) {
        return {
          status: 400,
          body: "Missing applicationId path parameter",
        };
      }

      if (req.method === "GET") {
        return await handleGetApplication(applicationId);
      } else {
        const changeRequest: SaveApplicationChangesRequest = req.body;
        return await handlePatchApplication(applicationId, changeRequest);
      }
    }
  );
};

export default httpTrigger;
