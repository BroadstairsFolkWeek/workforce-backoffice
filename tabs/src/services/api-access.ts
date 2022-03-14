import * as axios from "axios";
import {
  TeamsUserCredential,
  getResourceConfiguration,
  ResourceType,
} from "@microsoft/teamsfx";
import { URLSearchParams } from "url";

export const callApiGet = async (
  functionName: string,
  groupId: string,
  urlSearchParams?: URLSearchParams,
  responseType: axios.ResponseType = "json"
) => {
  try {
    const credential = new TeamsUserCredential();
    const accessToken = await credential.getToken("");
    const apiConfig = getResourceConfiguration(ResourceType.API);

    const url = new URL(apiConfig.endpoint + "/api/" + functionName, undefined);
    url.searchParams.append("groupId", groupId);
    if (urlSearchParams) {
      urlSearchParams.forEach((value, name) =>
        url.searchParams.append(name, value)
      );
    }

    const response = await axios.default.get(url.href, {
      headers: {
        authorization: "Bearer " + accessToken?.token || "",
      },
      responseType,
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.default.isAxiosError(err)) {
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
};
