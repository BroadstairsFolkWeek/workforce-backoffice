import {
  ApplicationStatusUpdateRequest,
  ApplicationStatusUpdateResponse,
  ApplicationUpdateRequest,
  ApplicationUpdateResponse,
  GetApplicationResponse,
  GetApplicationsResponse,
} from "../interfaces/applications-api";
import { wrapInputDecoder } from "./sanitise";

export const sanitiseGetApplicationResponse = GetApplicationResponse.decode;

export const sanitiseGetApplicationsResponse = GetApplicationsResponse.encode;

export const sanitiseApplicationUpdateRequest = wrapInputDecoder(
  ApplicationUpdateRequest.decode
);
export const sanitiseApplicationUpdateResponse =
  ApplicationUpdateResponse.encode;

export const sanitiseApplicationStatusUpdateRequest = wrapInputDecoder(
  ApplicationStatusUpdateRequest.decode
);
export const sanitiseApplicationStatusUpdateResponse =
  ApplicationStatusUpdateResponse.encode;
