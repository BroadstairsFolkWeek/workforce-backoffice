import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

const APP_INSIGHTS_CONNECTION_STRING =
  process.env.APP_INSIGHTS_CONNECTION_STRING;

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    disableTelemetry: APP_INSIGHTS_CONNECTION_STRING === undefined,
    disableInstrumentationKeyValidation:
      APP_INSIGHTS_CONNECTION_STRING === undefined,
    connectionString: APP_INSIGHTS_CONNECTION_STRING ?? "dummy",
    instrumentationKey: APP_INSIGHTS_CONNECTION_STRING ?? "dummy",
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
  },
});
appInsights.loadAppInsights();
export { reactPlugin, appInsights };
