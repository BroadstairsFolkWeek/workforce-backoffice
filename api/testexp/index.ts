import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TeamsfxContext } from "../interfaces/teams-context";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { saveApplicationChanges } from "../model/applications-repository";
import { logTrace } from "../utilities/logging";

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
      logTrace("In testexp. Creating savetask");
      const saveTask = saveApplicationChanges(
        "5fc69686-ff62-4985-b2bb-8949984ba5e7",
        { availableFirstFriday: true, availableSaturday: false },
        5
      );
      try {
        const response = await saveTask();
        logTrace("In testexp. savetask response: " + JSON.stringify(response));
      } catch (error) {
        logTrace("In testexp. savetask failed: " + error);
        throw error;
      }
      logTrace("In testexp. savetask finished");

      return {
        status: 200 /* Defaults to 200 */,
        body: JSON.stringify("hello"),
      };
    }
  );
};

export default httpTrigger;
