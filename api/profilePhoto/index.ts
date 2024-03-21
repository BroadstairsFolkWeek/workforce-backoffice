import {
  InvocationContext,
  HttpRequest,
  HttpResponseInit,
} from "@azure/functions";
import { runAsAuthenticatedUser } from "../common-handlers/authenticated-user-http-response-handler";
import { TeamsfxContext } from "../interfaces/teams-context";
import { getProfilePicture } from "../services/profile-service";
import { logTrace } from "../utilities/logging";

const handleGetProfilePhoto = async function (
  combinedId: string
): Promise<HttpResponseInit> {
  if (combinedId) {
    const result = await getProfilePicture(combinedId);
    if (result) {
      return {
        status: 200,
        body: new Uint8Array(result.content),
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

export const httpTrigger = async function (
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  return await runAsAuthenticatedUser(context, req, async () => {
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
    }

    if (req.method === "GET") {
      const id = req.query["id"];
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
  });
};

export default httpTrigger;
