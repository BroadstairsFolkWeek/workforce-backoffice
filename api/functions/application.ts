import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";

import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import {
  getApplicationTE,
  saveApplicationChanges,
} from "../model/applications-repository";
import { logTrace } from "../utilities/logging";
import { SaveApplicationChangesRequest } from "./interfaces/applications-api";

const handleGetApplication = async function (
  applicationId: string
): Promise<HttpResponseInit> {
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
): Promise<HttpResponseInit> {
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

export const applicationHttpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    if (req.method !== "GET" && req.method !== "PATCH") {
      logTrace(`application: Invalid HTTP method: ${req.method}`);
      return {
        status: 405,
        headers: {
          Allow: "GET, PATCH",
        },
      };
    }

    const applicationId: string = req.params.applicationId;
    if (!applicationId) {
      return {
        status: 400,
        body: "Missing applicationId path parameter",
      };
    }

    if (req.method === "GET") {
      return await handleGetApplication(applicationId);
    } else {
      const changeRequest: SaveApplicationChangesRequest =
        (await req.json()) as SaveApplicationChangesRequest;
      return await handlePatchApplication(applicationId, changeRequest);
    }
  });
};

export default applicationHttpTrigger;
