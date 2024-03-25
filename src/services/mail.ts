import { app } from "@microsoft/teams-js";

import { apiDraftWorkforceMail } from "../api/api";

export const draftAndDisplayWorkforceMail = async (
  emailAddress: any,
  givenName: string,
  surname: string
) => {
  const result = await apiDraftWorkforceMail(emailAddress, givenName, surname);
  await app.openLink(result);
};
