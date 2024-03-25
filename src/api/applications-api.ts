import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import {
  ApplicationStatus,
  ApplicationUpdates,
} from "../interfaces/application-data";
import {
  callApiGet,
  callApiGetTE,
  callApiPatchTE,
  callApiPostTE,
  commonAxiosErrorMapping,
} from "./api";
import {
  ApplicationStatusUpdateRequest,
  ApplicationStatusUpdateResponse,
  ApplicationUpdateResponse,
  GetApplicationResponse,
  GetApplicationsResponse,
} from "./interfaces/applications-api";
import axios, { AxiosError } from "axios";
import {
  sanitiseApplicationStatusUpdateResponse,
  sanitiseApplicationUpdateResponse,
  sanitiseGetApplicationResponse,
  sanitiseGetApplicationsResponse,
} from "./utilities/sanitise-applications-api";
import { ApiValidationError } from "./utilities/sanitise";

export const apiGetApplications = async () => {
  const result = await callApiGet<GetApplicationsResponse>(`applications`);
  return result;
};

export const apiGetApplicationsTE = () =>
  pipe(
    callApiGetTE<GetApplicationsResponse>(`applications`),
    TE.chainEitherKW(sanitiseGetApplicationsResponse),
    TE.mapLeft(
      (error: Error | AxiosError | ApiValidationError) =>
        // No status code specific error handling when retrieving applications since this is an operation
        // that should always succeed as long as the API service is running and the user is authenticated.
        // Therefore treat any Axios and validation errors as generic errors.
        error as Error
    ),
    TE.map((response) => response.applications)
  );

export const apiGetApplicationTE = (applicationId: string) =>
  pipe(
    callApiGetTE<GetApplicationResponse>(`applications/${applicationId}`),
    TE.chainEitherKW(sanitiseGetApplicationResponse),
    TE.mapLeft((error: Error | AxiosError | ApiValidationError) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 404) {
          return "not-found";
        }
      }

      // All other errors are treated as generic errors.
      return error as Error;
    }),
    TE.map((response) => response.application)
  );

export const apiUpdateApplicationTE =
  (applicationId: string) =>
  (version: number) =>
  (changes: ApplicationUpdates) =>
    pipe(
      callApiPatchTE<ApplicationUpdateResponse>(
        `applications/${applicationId}`,
        {
          changes,
          version,
        }
      ),
      TE.chainEitherKW(sanitiseApplicationUpdateResponse),
      TE.mapLeft((error: Error | AxiosError | ApiValidationError) => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.status === 404) {
            return "not-found";
          } else if (error?.response?.status === 409) {
            return "conflict";
          }
        }
        return error as Error;
      }),
      TE.map((response) => response.application)
    );

export const apiSetApplicationStatus =
  (applicationId: string) =>
  (version: number) =>
  (status: ApplicationStatus) => {
    return pipe(
      callApiPostTE<ApplicationStatusUpdateResponse>(
        `applications/${applicationId}/status`,
        {
          status,
          version,
        } as ApplicationStatusUpdateRequest
      ),
      TE.mapLeft(commonAxiosErrorMapping)
    );
  };

export const apiSetApplicationStatusTE =
  (applicationId: string) => (version: number) => (status: ApplicationStatus) =>
    pipe(
      callApiPostTE<ApplicationStatusUpdateResponse>(
        `applications/${applicationId}/status`,
        {
          status,
          version,
        }
      ),
      TE.chainEitherKW(sanitiseApplicationStatusUpdateResponse),
      TE.mapLeft((error: Error | AxiosError | ApiValidationError) => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.status === 404) {
            return "not-found";
          } else if (error?.response?.status === 409) {
            return "conflict";
          }
        }
        return error as Error;
      }),
      TE.map((response) => response.application)
    );
