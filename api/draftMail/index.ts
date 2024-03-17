import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { TeamsfxContext } from "../interfaces/teams-context";
import { draftMail } from "../services/mail-service";
import { logTrace } from "../utilities/logging";
import { DraftMailRequest, DraftMailResult } from "../interfaces/mail";

const handlePostDraftMail = async function (
  recipientEmailAddress: string,
  recipientGivenName: string,
  recipientSurname: string
): Promise<Context["res"]> {
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
        body: result,
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

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<void> {
  context.res = await runAsAuthenticatedUser(
    context,
    req,
    teamsfxContext,
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

      const requestBody: DraftMailRequest = req.body;

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
