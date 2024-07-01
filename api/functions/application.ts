import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";

import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { logError, logInfo } from "../utilities/logging";
import {
  getApplication,
  setApplicationStatus,
  updateApplication,
} from "../applications/application-service";
import {
  sanitiseApplicationStatusUpdateRequest,
  sanitiseApplicationStatusUpdateResponse,
  sanitiseApplicationUpdateRequest,
  sanitiseGetApplicationResponse,
} from "./utilities/sanitise-applications-api";
import {
  getJsonBody,
  getRequestParam,
  isMissingParamError,
} from "./utilities/http-functions";
import { isApiInputValidationError } from "./utilities/sanitise";

export const httpGetApplication = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const loggingPrefix = "GET Application: ";

    const task = pipe(
      getRequestParam("applicationId")(req),
      TE.fromEither,
      TE.chainW(getApplication),
      TE.map((application) => ({
        application,
      })),
      TE.map(sanitiseGetApplicationResponse),
      TE.fold(
        (validationErr) => {
          if (isMissingParamError(validationErr)) {
            logInfo(
              `${loggingPrefix} missing parameter: ${JSON.stringify(
                validationErr.paramName
              )}`
            );
            return T.of({
              status: 400,
              body: "Missing parameter: " + validationErr.paramName,
            });
          } else if (validationErr === "not-found") {
            return T.of({ status: 404, body: "Application not found" });
          } else {
            logError(
              `${loggingPrefix} Error: ${JSON.stringify(validationErr)}`
            );
            return T.of({ status: 500 });
          }
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

export const httpPatchApplication = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const loggingPrefix = "PATCH Application: ";

    const task = pipe(
      getRequestParam("applicationId")(req),
      TE.fromEither,
      TE.bindTo("applicationId"),
      TE.bindW("jsonBody", () => TE.fromTask(getJsonBody(req))),
      TE.bindW("applicationUpdateRequest", ({ jsonBody }) =>
        TE.fromEither(sanitiseApplicationUpdateRequest(jsonBody))
      ),
      TE.map(({ applicationId, applicationUpdateRequest }) => ({
        applicationId,
        version: applicationUpdateRequest.version,
        changes: applicationUpdateRequest.changes,
      })),
      TE.chainW(({ applicationId, version, changes }) =>
        updateApplication(applicationId)(version)(changes)
      ),
      TE.map((application) => ({
        application,
      })),
      TE.map(sanitiseApplicationStatusUpdateResponse),
      TE.fold(
        (validationErr) => {
          if (isApiInputValidationError(validationErr)) {
            logInfo(
              `${loggingPrefix} Cannot parse ApplicationUpdate request: ${JSON.stringify(
                validationErr.errors
              )}`
            );
            return T.of({
              status: 400,
              body:
                "Invalid request body: " + JSON.stringify(validationErr.errors),
            });
          } else if (isMissingParamError(validationErr)) {
            logInfo(
              `${loggingPrefix} missing parameter: ${JSON.stringify(
                validationErr.paramName
              )}`
            );
            return T.of({
              status: 400,
              body: "Missing parameter: " + validationErr.paramName,
            });
          } else if (validationErr === "not-found") {
            return T.of({ status: 404, body: "Application not found" });
          } else if (validationErr === "conflict") {
            return T.of({ status: 409, body: "Version number conflict" });
          } else {
            logError(
              `${loggingPrefix} Error: ${JSON.stringify(validationErr)}`
            );
            return T.of({ status: 500 });
          }
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

export const httpPostApplicationStatus = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const loggingPrefix = "POST ApplicationStatus: ";

    const task = pipe(
      getRequestParam("applicationId")(req),
      TE.fromEither,
      TE.bindTo("applicationId"),
      TE.bindW("jsonBody", () => TE.fromTask(getJsonBody(req))),
      TE.bindW("statusUpdateRequest", ({ jsonBody }) =>
        TE.fromEither(sanitiseApplicationStatusUpdateRequest(jsonBody))
      ),
      TE.map(({ applicationId, statusUpdateRequest }) => ({
        applicationId,
        version: statusUpdateRequest.version,
        status: statusUpdateRequest.status,
      })),
      TE.chainW(({ applicationId, version, status }) =>
        setApplicationStatus(applicationId)(version)(status)
      ),
      TE.map((application) => ({
        application,
      })),
      TE.map(sanitiseApplicationStatusUpdateResponse),
      TE.fold(
        (validationErr) => {
          if (isApiInputValidationError(validationErr)) {
            logInfo(
              `${loggingPrefix} Cannot parse StatusUpdate request: ${JSON.stringify(
                validationErr.errors
              )}`
            );
            return T.of({
              status: 400,
              body:
                "Invalid request body: " + JSON.stringify(validationErr.errors),
            });
          } else if (isMissingParamError(validationErr)) {
            logInfo(
              `${loggingPrefix} missing parameter: ${JSON.stringify(
                validationErr.paramName
              )}`
            );
            return T.of({
              status: 400,
              body: "Missing parameter: " + validationErr.paramName,
            });
          } else if (validationErr === "not-found") {
            return T.of({ status: 404, body: "Application not found" });
          } else if (validationErr === "conflict") {
            return T.of({ status: 409, body: "Version number conflict" });
          } else {
            logError(
              `${loggingPrefix} Error: ${JSON.stringify(validationErr)}`
            );
            return T.of({ status: 500 });
          }
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
