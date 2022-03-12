import React, { useEffect } from "react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { ApplicationsContextProvider } from "../components/contexts/applications-context";
import ApplicationList from "./ApplicationList";

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
    <ApplicationsContextProvider>
      <div>
        <ApplicationList />
      </div>
    </ApplicationsContextProvider>
  );
}
