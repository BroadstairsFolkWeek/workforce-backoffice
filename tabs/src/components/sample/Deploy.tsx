import React, { useEffect } from "react";
import "./Deploy.css";
import { Image } from "@fluentui/react-northstar";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";

export function Deploy(props: { docsUrl?: string }) {
  const appInsights = useAppInsightsContext();

  useEffect(() => {
    const mountTime = Date.now();
    return () => {
      const unmountTime = Date.now();

      appInsights.trackMetric(
        { average: unmountTime - mountTime, name: "Mounted time (ms)" },
        { "Component name": "Deploy" }
      );
    };
  }, [appInsights]);

  const { docsUrl } = {
    docsUrl: "https://aka.ms/teamsfx-docs",
    ...props,
  };
  return (
    <div className="deploy page">
      <h2>Deploy to the Cloud</h2>
      <p>
        Before publishing your app to Teams App Catalog, you may want to
        provision and deploy your app's resources to the cloud to make sure your
        app will be running smoothly!
      </p>
      <p>
        To provision your resources, you can either use our CLI command "teamsfx
        provision" or apply "Teams: Provision in the cloud" in Command palette.
      </p>
      <p>
        To deploy your app, you can either use our CLI command "teamsfx deploy"
        or apply "Teams: Deploy to the Cloud" in Command palette.
      </p>
      <Image src="deploy.png" />
      <p>
        For more information, see the{" "}
        <a href={docsUrl} target="_blank" rel="noreferrer">
          docs
        </a>
        .
      </p>
    </div>
  );
}
