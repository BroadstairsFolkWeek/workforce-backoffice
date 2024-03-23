import * as E from "fp-ts/lib/Either";
import * as IOE from "fp-ts/lib/IOEither";
import { TeamsUserCredential } from "@microsoft/teamsfx";

let teamsUserCredential: TeamsUserCredential | undefined = undefined;

export function setTeamsUserCredential(credential: TeamsUserCredential) {
  teamsUserCredential = credential;
}

export function getTeamsUserCredential() {
  return teamsUserCredential;
}

export function getTeamsUserCredentialIOE(): IOE.IOEither<
  Error,
  TeamsUserCredential
> {
  return () =>
    E.fromNullable(new Error("TeamsUserCredential is not set"))(
      teamsUserCredential
    );
}
