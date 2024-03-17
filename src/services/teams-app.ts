import { app } from "@microsoft/teams-js";
import { TeamsUserCredential } from "@microsoft/teamsfx";

let teamsUserCredential: TeamsUserCredential;

export function setTeamsUserCredential(credential: TeamsUserCredential) {
  teamsUserCredential = credential;
}

export function getTeamsUserCredential() {
  return teamsUserCredential;
}
