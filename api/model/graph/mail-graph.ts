import { Message } from "@microsoft/microsoft-graph-types";
import { logTrace } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";

export const createDraftEmail = async (
  recipientEmailAddress: string,
  recipientGivenName: string,
  recipientSurname: string
) => {
  logTrace("In mail-graph: createDraftEmail");
  const graphClient = getOboGraphClient();

  const draftMessage: Message = {
    toRecipients: [
      {
        emailAddress: {
          address: `${recipientGivenName} ${recipientSurname} <${recipientEmailAddress}>`,
        },
      },
    ],
    subject: "Your Broadstairs Folk Week Workforce Application",
    body: {
      contentType: "html",
      content: `Dear ${recipientGivenName},<br/><br/>`,
    },
  };

  const createMailResponse: Message = await graphClient
    .api("/me/messages")
    .post(draftMessage);

  return createMailResponse.webLink;
};
