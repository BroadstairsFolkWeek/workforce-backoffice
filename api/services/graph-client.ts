import { Client } from "@microsoft/microsoft-graph-client";
import {
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { getAppAsyncContext } from "../context/app-async-context";
import { TeamsfxContext } from "../interfaces/teams-context";
import config from "../config";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

const CONTEXT_KEY = "graphClientContext";
interface OboGraphClientContext {
  oboClient: Client;
}

export const isAuthenticated = (teamsfxContext: TeamsfxContext) => {
  return !!teamsfxContext.AccessToken;
};

export const getOboGraphClient = () => {
  const appContext = getAppAsyncContext();

  const oboGraphClientContext: OboGraphClientContext =
    appContext.store[CONTEXT_KEY];
  if (oboGraphClientContext) {
    return oboGraphClientContext.oboClient;
  }

  const teamsfxContext = appContext.teamsfxContext;

  const accessToken: string = teamsfxContext.AccessToken;

  const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
  };

  const oboCredential = new OnBehalfOfUserCredential(
    accessToken,
    oboAuthConfig
  );

  const authProvider = new TokenCredentialAuthenticationProvider(
    oboCredential,
    {
      scopes: ["https://graph.microsoft.com/.default"],
    }
  );

  const graphClient = Client.initWithMiddleware({
    authProvider: authProvider,
  });

  const newOboGraphClientContext: OboGraphClientContext = {
    oboClient: graphClient,
  };
  appContext.store[CONTEXT_KEY] = newOboGraphClientContext;

  return graphClient;
};
