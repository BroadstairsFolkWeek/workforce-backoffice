import * as t from "io-ts";
import {
  ApplicationInfo,
  ApplicationStatus,
  ApplicationUpdates,
} from "../../interfaces/applications";

export { ApplicationInfo, ApplicationStatus, ApplicationUpdates };

export const GetApplicationResponse = t.type({
  application: t.exact(ApplicationInfo),
});

export const GetApplicationsResponse = t.type({
  applications: t.readonlyArray(t.exact(ApplicationInfo)),
});

export const ApplicationStatusUpdateRequest = t.type({
  status: ApplicationStatus,
  version: t.number,
});
export const ApplicationStatusUpdateResponse = GetApplicationResponse;

export const ApplicationUpdateRequest = t.type({
  version: t.number,
  changes: ApplicationUpdates,
});
export const ApplicationUpdateResponse = GetApplicationResponse;

export type GetApplicationResponse = t.TypeOf<typeof GetApplicationResponse>;
export type GetApplicationsResponse = t.TypeOf<typeof GetApplicationsResponse>;

export type ApplicationStatusUpdateRequest = t.TypeOf<
  typeof ApplicationStatusUpdateRequest
>;
export type ApplicationStatusUpdateResponse = t.TypeOf<
  typeof ApplicationStatusUpdateResponse
>;

export type ApplicationUpdateRequest = t.TypeOf<
  typeof ApplicationUpdateRequest
>;
export type ApplicationUpdateResponse = t.TypeOf<
  typeof ApplicationUpdateResponse
>;
