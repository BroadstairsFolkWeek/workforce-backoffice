import React, { useEffect } from "react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { Welcome } from "./sample/Welcome";

var showFunction = Boolean(process.env.REACT_APP_FUNC_NAME);

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
    <div>
      <Welcome showFunction={showFunction} />
    </div>
  );
}
