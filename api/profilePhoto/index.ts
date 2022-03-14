import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { runAsAuthenticatedUserWithGroup } from "../common-handlers/authenticated-user-http-response-handler";
import { TeamsfxContext } from "../interfaces/teams-context";
import { getProfilePicture } from "../services/profile-service";
import { logTrace } from "../utilities/logging";

const handleGetProfilePhoto = async function (
  combinedId: string
): Promise<Context["res"]> {
  if (combinedId) {
    const result = await getProfilePicture(combinedId);
    if (result) {
      return {
        status: 200,
        body: new Uint8Array(result.content),
        isRaw: true,
        headers: {
          "Content-Type": result.mimeType,
          "Cache-Control": "public, max-age=604800",
        },
      };
    } else {
      return {
        status: 404,
      };
    }
  } else {
    return {
      status: 400,
      body: "Missing id query parameter",
    };
  }
};

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
      if (
        req.method !== "GET" &&
        req.method !== "POST" &&
        req.method !== "DELETE"
      ) {
        logTrace(`profilePhoto: Invalid HTTP method: ${req.method}`);
        return {
          status: 405,
          headers: {
            Allow: "GET, POST, DELETE",
          },
        };
        return;
      }

      if (req.method === "GET") {
        const id = req.query.id;
        return handleGetProfilePhoto(id);
      } else {
        // Temporary 405 until methods are implemented.
        return {
          status: 405,
          headers: {
            Allow: "GET, POST, DELETE",
          },
        };
      }
    }
  );
};

export default httpTrigger;
