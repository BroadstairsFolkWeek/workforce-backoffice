import axios, { AxiosRequestConfig, ResponseType } from "axios";
import { URLSearchParams } from "url";

import { getTeamsUserCredential } from "./teams-app";
import config from "../components/config";
import { DraftMailResult } from "../../api/interfaces/mail";
import { ApplicationChanges } from "../interfaces/application-data";

const callApi = async <ResponseDataType = any>(
  method: "GET" | "POST" | "PATCH",
  functionName: string,
  body?: any,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  const teamsUserCredential = getTeamsUserCredential();

  if (teamsUserCredential) {
    try {
      const accessToken = await teamsUserCredential.getToken("");

      const url = new URL(config.apiEndpoint + "/api/" + functionName);
      if (urlSearchParams) {
        urlSearchParams.forEach((value, name) =>
          url.searchParams.append(name, value)
        );
      }

      const requestConfig: AxiosRequestConfig = {
        url: url.href,
        method,
        headers: {
          authorization: "Bearer " + accessToken?.token || "",
        },
        data: body,
        responseType,
      };

      const response = await axios.request<ResponseDataType>(requestConfig);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        let funcErrorMsg = "";

        if (err?.response?.status === 404) {
          funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy to the cloud") first before running this App`;
        } else if (err.message === "Network Error") {
          funcErrorMsg =
            "Cannot call Azure Function due to network error, please check your network connection status and ";
          if (err.config?.url && err.config.url.indexOf("localhost") >= 0) {
            funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
          } else {
            funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision in the cloud" and "Teams: Deploy to the cloud) first before running this App`;
          }
        } else {
          funcErrorMsg = err.message;
          if (err.response?.data?.error) {
            funcErrorMsg += ": " + err.response.data.error;
          }
        }

        throw new Error(funcErrorMsg);
      }
      throw err;
    }
  } else {
    throw new Error("No Teams User Credential");
  }
};

export const callApiGet = <ResponseDataType = any>(
  functionName: string,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  return callApi<ResponseDataType>(
    "GET",
    functionName,
    undefined,
    urlSearchParams,
    responseType
  );
};

export const callApiPost = <ResponseDataType = any>(
  functionName: string,
  body?: any,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  return callApi<ResponseDataType>(
    "POST",
    functionName,
    body,
    urlSearchParams,
    responseType
  );
};

export const callApiPatch = <ResponseDataType = any>(
  functionName: string,
  body?: any,
  urlSearchParams?: URLSearchParams,
  responseType: ResponseType = "json"
) => {
  return callApi<ResponseDataType>(
    "PATCH",
    functionName,
    body,
    urlSearchParams,
    responseType
  );
};

export const apiDraftWorkforceMail = async (
  emailAddress: any,
  givenName: string,
  surname: string
) => {
  const result = await callApiPost<DraftMailResult>("draftMail", {
    recipient: {
      emailAddress: emailAddress,
      givenName: givenName,
      surname: surname,
    },
  });
  return result.draftMailUrl;
};

export const apiTestexp = async () => {
  const result = await callApiGet("testexp");
  return result;
};

export const apiGetApplication = async (applicationId: string) => {
  const result = await callApiGet(`applications/${applicationId}`);
  return result;
};

export const apiUpdateApplication = async (
  applicationId: string,
  version: number,
  changes: ApplicationChanges
) => {
  const result = await callApiPatch(`applications/${applicationId}`, {
    changes,
    changedVersion: version,
  });
  return result;
};
