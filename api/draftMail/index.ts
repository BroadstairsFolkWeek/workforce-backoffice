import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { draftMail } from "../services/mail-service";
import { logTrace } from "../utilities/logging";
import { DraftMailRequest, DraftMailResult } from "../interfaces/mail";

const handlePostDraftMail = async function (
  recipientEmailAddress: string,
  recipientGivenName: string,
  recipientSurname: string
): Promise<HttpResponseInit> {
  if (recipientEmailAddress) {
    const draftMailUrl = await draftMail(
      recipientEmailAddress,
      recipientGivenName,
      recipientSurname
    );
    const result: DraftMailResult = {
      draftMailUrl: draftMailUrl.toString(),
    };
    if (draftMailUrl) {
      return {
        status: 200,
        jsonBody: result,
      };
    } else {
      return {
        status: 500,
      };
    }
  } else {
    return {
      status: 400,
      body: "Missing recipient body parameter",
    };
  }
};

export const httpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(
    context,
    req,

    async () => {
      if (req.method !== "POST") {
        logTrace(`draftMail: Invalid HTTP method: ${req.method}`);
        return {
          status: 405,
          headers: {
            Allow: "POST",
          },
        };
      }

      const requestBody: DraftMailRequest =
        (await req.json()) as DraftMailRequest;

      logTrace(
        `draftMail: Received request for ${requestBody.recipient.emailAddress}`
      );

      return handlePostDraftMail(
        requestBody.recipient.emailAddress,
        requestBody.recipient.givenName,
        requestBody.recipient.surname
      );
    }
  );
};

export default httpTrigger;
