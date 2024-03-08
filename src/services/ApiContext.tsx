import React, { useCallback, useContext } from "react";
import axios, { ResponseType } from "axios";
import { apiContextUninitialisedSymbol } from "./symbols";
import { TeamsFxContext } from "../components/Context";

export type IApiContext = {
  callApiGet: (
    functionName: string,
    urlSearchParams?: URLSearchParams,
    responseType?: ResponseType
  ) => Promise<any>;
};

export const Context = React.createContext<
  IApiContext | typeof apiContextUninitialisedSymbol
>(apiContextUninitialisedSymbol);

const ApiContextProvider = ({ children }: { children: JSX.Element }) => {
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const callApiGet = useCallback(
    async (
      functionName: string,
      urlSearchParams?: URLSearchParams,
      responseType: ResponseType = "json"
    ) => {
      if (teamsUserCredential) {
        try {
          const accessToken = await teamsUserCredential.getToken("");

          const url = new URL(
            process.env.REACT_APP_FUNC_ENDPOINT + "/api/" + functionName
          );
          if (urlSearchParams) {
            urlSearchParams.forEach((value, name) =>
              url.searchParams.append(name, value)
            );
          }

          const response = await axios.get(url.href, {
            headers: {
              authorization: "Bearer " + accessToken?.token || "",
            },
            responseType,
          });
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
    },
    [teamsUserCredential]
  );

  return (
    <Context.Provider
      value={{
        callApiGet,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useApiAccess = () => {
  const currentContextValue = useContext(Context);
  if (currentContextValue === apiContextUninitialisedSymbol) {
    throw new Error("useApiAccess must be used within an ApiContextProvider");
  }
  return currentContextValue;
};

export { ApiContextProvider, useApiAccess };
