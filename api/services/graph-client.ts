import { Client } from "@microsoft/microsoft-graph-client";
import {
  createMicrosoftGraphClient,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { getAppAsyncContext } from "../context/app-async-context";
import { TeamsfxContext } from "../interfaces/teams-context";

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

  const credential = new OnBehalfOfUserCredential(accessToken);

  const graphClient: Client = createMicrosoftGraphClient(credential, [
    ".default",
  ]);

  const newOboGraphClientContext: OboGraphClientContext = {
    oboClient: graphClient,
  };
  appContext.store[CONTEXT_KEY] = newOboGraphClientContext;

  return graphClient;
};
