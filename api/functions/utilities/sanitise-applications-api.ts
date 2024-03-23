import {
  ApplicationStatusUpdateRequest,
  ApplicationStatusUpdateResponse,
  ApplicationUpdateRequest,
  ApplicationUpdateResponse,
  GetApplicationResponse,
  GetApplicationsResponse,
} from "../interfaces/applications-api";
import { wrapInputDecoder, wrapOutputDecoder } from "./sanitise";

export const sanitiseGetApplicationResponse = wrapOutputDecoder(
  GetApplicationResponse.decode
);

export const sanitiseGetApplicationsResponse = wrapOutputDecoder(
  GetApplicationsResponse.decode
);

export const sanitiseApplicationUpdateRequest = wrapInputDecoder(
  ApplicationUpdateRequest.decode
);
export const sanitiseApplicationUpdateResponse = wrapOutputDecoder(
  ApplicationUpdateResponse.decode
);

export const sanitiseApplicationStatusUpdateRequest = wrapInputDecoder(
  ApplicationStatusUpdateRequest.decode
);
export const sanitiseApplicationStatusUpdateResponse = wrapOutputDecoder(
  ApplicationStatusUpdateResponse.decode
);
