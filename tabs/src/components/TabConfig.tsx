import React, { useCallback, useEffect } from "react";
import "./App.css";
import * as microsoftTeams from "@microsoft/teams-js";
import { useTeamsFx } from "./sample/lib/useTeamsFx";

const TabConfig: React.FC = () => {
  const { loading, context } = useTeamsFx();

  const saveHandler: Parameters<
    typeof microsoftTeams.settings.registerOnSaveHandler
  >[0] = useCallback(
    (saveEvent) => {
      if (!loading && context) {
        const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
        const contextQueryArgs = `tenant=${context.tid}&group=${context?.groupId}`;
        microsoftTeams.settings.setSettings({
          suggestedDisplayName: "Applications",
          entityId: "Applications",
          contentUrl: baseUrl + `/index.html?${contextQueryArgs}#/applications`,
          websiteUrl: baseUrl + `/index.html?${contextQueryArgs}#/applications`,
        });
        saveEvent.notifySuccess();
      }
    },
    [loading, context]
  );

  useEffect(() => {
    if (!loading) {
      microsoftTeams.settings.registerOnSaveHandler(saveHandler);
      microsoftTeams.settings.setValidityState(true);
    }
  }, [loading, saveHandler]);

  return (
    <div>
      <h1>Add Applications tab</h1>
      <div>
        Click Save to add a new tab to this channel for processing workforce
        applications.
      </div>
    </div>
  );
};

export default TabConfig;
