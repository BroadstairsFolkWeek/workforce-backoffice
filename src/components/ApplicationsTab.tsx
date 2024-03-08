import { useContext } from "react";
import { TeamsFxContext } from "./Context";
import { ApiContextProvider } from "../services/ApiContext";
import ApplicationList from "./applications/ApplicationList";
import { ApplicationsContextProvider } from "./applications/ApplicationsContextProvider";

export default function ApplicationsTab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <ApiContextProvider>
      <ApplicationsContextProvider>
        <div
          className={
            themeString === "default"
              ? "light"
              : themeString === "dark"
              ? "dark"
              : "contrast"
          }
        >
          <ApplicationList />
        </div>
      </ApplicationsContextProvider>
    </ApiContextProvider>
  );
}
