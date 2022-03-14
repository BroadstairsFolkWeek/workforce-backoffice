import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { runAsAuthenticatedUserWithGroup } from "../common-handlers/authenticated-user-http-response-handler";
import { TeamsfxContext } from "../interfaces/teams-context";
import { getProfiles } from "../model/graph/profiles-graph";

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
      const profiles = await getProfiles();

      return {
        status: 200,
        body: JSON.stringify(profiles),
      };
    }
  );
};

export default httpTrigger;
