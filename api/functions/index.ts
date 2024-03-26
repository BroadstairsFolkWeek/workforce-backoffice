import { app, input } from "@azure/functions";

import httpGetApplications from "./applications";
import profilesHttpTrigger from "./profiles";
import draftMailHttpTrigger from "./mail";
import {
  httpGetApplication,
  httpPatchApplication,
  httpPostApplicationStatus,
} from "./application";

const teamsFxContextInput = input.generic({
  type: "TeamsFx",
  name: "teamsfxContext",
});

app.get("applications-get", {
  route: "applications",
  extraInputs: [teamsFxContextInput],
  handler: httpGetApplications,
});

app.get("application-get", {
  route: "applications/{applicationId}",
  extraInputs: [teamsFxContextInput],
  handler: httpGetApplication,
});

app.patch("application-patch", {
  route: "applications/{applicationId}",
  extraInputs: [teamsFxContextInput],
  handler: httpPatchApplication,
});

app.post("application-status-post", {
  route: "applications/{applicationId}/status",
  extraInputs: [teamsFxContextInput],
  handler: httpPostApplicationStatus,
});

app.http("profiles", {
  methods: ["GET"],
  extraInputs: [teamsFxContextInput],
  handler: profilesHttpTrigger,
});

app.http("draftMail", {
  methods: ["POST"],
  extraInputs: [teamsFxContextInput],
  handler: draftMailHttpTrigger,
});
