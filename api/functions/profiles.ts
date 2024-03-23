import {
  InvocationContext,
  HttpRequest,
  HttpResponseInit,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { modelGetProfiles } from "../model/profiles-repository";

const profilesHttpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
    const profiles = await modelGetProfiles();

    return {
      status: 200,
      body: JSON.stringify(profiles),
    };
  });
};

export default profilesHttpTrigger;
