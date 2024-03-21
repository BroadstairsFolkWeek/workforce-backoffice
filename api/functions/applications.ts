import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { TeamsfxContext } from "../interfaces/teams-context";
import { getApplications } from "../services/application-service";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";

export const applicationsHttpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const applications = await getApplications();

    return {
      status: 200 /* Defaults to 200 */,
      body: JSON.stringify(applications),
    };
  });
};

export default applicationsHttpTrigger;
