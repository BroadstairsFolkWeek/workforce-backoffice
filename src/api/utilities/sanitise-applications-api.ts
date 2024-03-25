import {
  ApplicationStatusUpdateResponse,
  ApplicationUpdateResponse,
  GetApplicationResponse,
  GetApplicationsResponse,
} from "../interfaces/applications-api";
import { wrapInputDecoder } from "./sanitise";

export const sanitiseGetApplicationResponse = wrapInputDecoder(
  GetApplicationResponse.decode
);

export const sanitiseGetApplicationsResponse = wrapInputDecoder(
  GetApplicationsResponse.decode
);

export const sanitiseApplicationUpdateResponse = wrapInputDecoder(
  ApplicationUpdateResponse.decode
);

export const sanitiseApplicationStatusUpdateResponse = wrapInputDecoder(
  ApplicationStatusUpdateResponse.decode
);
