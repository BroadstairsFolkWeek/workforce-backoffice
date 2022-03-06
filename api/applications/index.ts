import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TeamsfxContext } from "../interfaces/teams-context";
import { getApplications } from "../services/application-service";
import { runAsAuthenticatedUserWithGroup } from "../common-handlers/authenticated-user-http-response-handler";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<void> {
  context.res = await runAsAuthenticatedUserWithGroup(
    context,
    req,
    teamsfxContext,
    async () => {
      const applications = await getApplications();

      return {
        status: 200 /* Defaults to 200 */,
        body: JSON.stringify(applications),
      };
    }
  );
};

export default httpTrigger;
