import { useEffect, useState } from "react";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  tokens,
} from "@fluentui/react-components";

import { setTeamsUserCredential } from "../services/teams-app";
import config from "./config";
import { TeamsFxContext } from "./Context";
import AppRouter from "./AppRouter";
import { TeamsUserCredential } from "@microsoft/teamsfx";

// Ensures TeamsFX is initialised before rendering the rest of the app. Initialising TeamsFX
// will also ensure the Teams JS SDK is initialised.
export default function InitialisedTeamsApp() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const { loading, inTeams, theme, themeString, teamsUserCredential } =
    useTeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint!,
      clientId: config.clientId!,
    });

  // Keep track of when the TeamsUserCredential has been applied to the teams-app service. We do not
  // start the app until this has been done.
  const [appliedTeamsUserCredential, setAppliedTeamsUserCredential] = useState<
    TeamsUserCredential | undefined
  >(undefined);

  useEffect(() => {
    if (loading === false) {
      if (!inTeams) {
        setErrorMessage(
          "Failed to initialise the application. Not loaded in Teams, Outlook or M365."
        );
      } else {
        if (teamsUserCredential) {
          setTeamsUserCredential(teamsUserCredential);
          setAppliedTeamsUserCredential(teamsUserCredential);
        } else {
          setErrorMessage(
            "Failed to initialise the application. Please try refreshing the page/app."
          );
        }
      }
    }
  }, [loading, inTeams, teamsUserCredential]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (loading || !appliedTeamsUserCredential) {
    return (
      <>
        <div>Initialising application</div>
      </>
    );
  }

  return (
    <TeamsFxContext.Provider
      value={{ theme, themeString, teamsUserCredential }}
    >
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        <AppRouter />
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
