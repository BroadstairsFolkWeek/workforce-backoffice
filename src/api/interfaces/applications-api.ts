import * as t from "io-ts";
import {
  ApplicationInfo,
  ApplicationStatus,
  ApplicationUpdates,
} from "../../interfaces/application-data";

export const GetApplicationsResponse = t.type({
  applications: t.array(t.exact(ApplicationInfo)),
});

export const GetApplicationResponse = t.type({
  application: t.exact(ApplicationInfo),
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GetApplicationResponse = t.TypeOf<typeof GetApplicationResponse>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GetApplicationsResponse = t.TypeOf<typeof GetApplicationsResponse>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationStatusUpdateRequest = t.TypeOf<
  typeof ApplicationStatusUpdateRequest
>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationStatusUpdateResponse = t.TypeOf<
  typeof ApplicationStatusUpdateResponse
>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationUpdateRequest = t.TypeOf<
  typeof ApplicationUpdateRequest
>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ApplicationUpdateResponse = t.TypeOf<
  typeof ApplicationUpdateResponse
>;
