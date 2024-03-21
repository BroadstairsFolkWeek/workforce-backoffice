import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { Client } from "@microsoft/microsoft-graph-client";
import {
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { getAppAsyncContext } from "../context/app-async-context";
import { TeamsfxContext } from "../interfaces/teams-context";
import config from "../config";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { logTraceIO } from "../utilities/logging";

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

export const getOboGraphClientIO = () => {
  return IO.of(getOboGraphClient());
};

export const getFromGraphClient = (path: string) => (graphClient: Client) =>
  TE.tryCatch(() => graphClient.api(path).get(), E.toError);

export const getViaOboGraphClient = (path: string) =>
  pipe(
    getOboGraphClientIO(),
    TE.fromIO,
    TE.chain((gc) => TE.tryCatch(() => gc.api(path).get(), E.toError))
  );

export const patchViaOboGraphClient = (body: any) => (path: string) =>
  pipe(
    getOboGraphClientIO(),
    TE.fromIO,
    TE.chainFirstIOK(() => logTraceIO(`patchViaOboGraphClient: Path: ${path}`)),
    TE.chainFirstIOK(() =>
      logTraceIO(
        `patchViaOboGraphClient: Body: ${JSON.stringify(body, null, 2)}`
      )
    ),
    TE.chain((gc) => TE.tryCatch(() => gc.api(path).patch(body), E.toError))
  );
