import React, { useEffect } from "react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { ApplicationsContextProvider } from "../components/contexts/applications-context";
import ApplicationList from "./ApplicationList";
import { AppContextProvider } from "./contexts/app-context-provider";

export default function Tab() {
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    const tabStartTime = Date.now();
    return () => {
      const tabEndTime = Date.now();

      appInsights.trackMetric(
        { average: tabEndTime - tabStartTime, name: "Tab display time (ms)" },
        { "Component name": "Tab" }
      );
    };
  }, [appInsights]);

  return (
    <AppContextProvider>
      <ApplicationsContextProvider>
        <div>
          <ApplicationList />
        </div>
      </ApplicationsContextProvider>
    </AppContextProvider>
  );
}
