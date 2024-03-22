import { app, input } from "@azure/functions";

import applicationsHttpTrigger from "./functions/applications";
import profilesHttpTrigger from "./functions/profiles";
import profilePhotoHttpTrigger from "./functions/profile-photos";

const teamsFxContextInput = input.generic({
  type: "TeamsFx",
  name: "teamsfxContext",
});

console.error("Preping API");

app.http("applications", {
  methods: ["GET"],
  route: "applications/",
  extraInputs: [teamsFxContextInput],
  handler: applicationsHttpTrigger,
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

console.error("API is running...");
console.error(JSON.stringify(app, null, 2));
