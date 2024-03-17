import { URL } from "url";
import { createDraftEmail } from "../model/graph/mail-graph";

export const draftMail = async (
  recipientEmailAddress: string,
  recipientGivenName: string,
  recipientSurname: string
): Promise<URL> => {
  const urlString = await createDraftEmail(
    recipientEmailAddress,
    recipientGivenName,
    recipientSurname
  );
  return new URL(urlString);
};
