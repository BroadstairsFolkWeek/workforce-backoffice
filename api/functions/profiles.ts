import {
  InvocationContext,
  HttpRequest,
  HttpResponseInit,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { getProfiles } from "../model/graph/profiles-graph";

const profilesHttpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const profiles = await getProfiles();

    return {
      status: 200,
      body: JSON.stringify(profiles),
    };
  });
};

export default profilesHttpTrigger;
