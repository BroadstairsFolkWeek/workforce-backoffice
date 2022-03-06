import { Client } from "@microsoft/microsoft-graph-client";
import {
  createMicrosoftGraphClient,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { TeamsfxContext } from "../interfaces/teams-context";

export const isAuthenticated = (teamsfxContext: TeamsfxContext) => {
  return !!teamsfxContext.AccessToken;
};

export const getOboGraphClient = (teamsfxContext: TeamsfxContext) => {
  const accessToken: string = teamsfxContext.AccessToken;

  const credential = new OnBehalfOfUserCredential(accessToken);

  const graphClient: Client = createMicrosoftGraphClient(credential, [
    ".default",
  ]);

  return graphClient;
};
