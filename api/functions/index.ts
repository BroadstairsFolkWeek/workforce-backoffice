import { app, input } from "@azure/functions";

import applicationsHttpTrigger from "./applications";
import profilesHttpTrigger from "./profiles";
import profilePhotoHttpTrigger from "./profile-photos";
import draftMailHttpTrigger from "./mail";
import applicationHttpTrigger from "./application";

const teamsFxContextInput = input.generic({
  type: "TeamsFx",
  name: "teamsfxContext",
});

console.error("Preping API");

app.http("applications", {
  methods: ["GET"],
  extraInputs: [teamsFxContextInput],
  handler: applicationsHttpTrigger,
});

app.http("application", {
  methods: ["GET", "PATCH"],
  route: "applications/{applicationId}",
  extraInputs: [teamsFxContextInput],
  handler: applicationHttpTrigger,
});

app.http("profiles", {
  methods: ["GET"],
  extraInputs: [teamsFxContextInput],
  handler: profilesHttpTrigger,
});

app.http("profilePhoto", {
  methods: ["GET"],
  extraInputs: [teamsFxContextInput],
  handler: profilePhotoHttpTrigger,
});

app.http("draftMail", {
  methods: ["POST"],
  extraInputs: [teamsFxContextInput],
  handler: draftMailHttpTrigger,
});

console.error("API is running...");
console.error(JSON.stringify(app, null, 2));
