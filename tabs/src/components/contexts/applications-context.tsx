import React, { useContext, useEffect, useState } from "react";
import { getApplications } from "../../model/application-repository";
import { PersistedApplication } from "../../model/interfaces/application";
import { useAppContext } from "./app-context-provider";

export type IApplicationsContext = {
  loaded: boolean;
  applications: PersistedApplication[];
};

const Context = React.createContext<IApplicationsContext>({
  loaded: false,
  applications: [],
});

const ApplicationsContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { loaded: appContextLoaded, groupId } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const [applications, setApplications] = useState<PersistedApplication[]>([]);

  useEffect(() => {
    if (appContextLoaded && groupId) {
      getApplications(groupId)
        .then(setApplications)
        .then(() => setLoaded(true));
    }
  }, [appContextLoaded, groupId]);

  return (
    <Context.Provider
      value={{
        loaded,
        applications,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useApplications = () => useContext(Context);

export { ApplicationsContextProvider, useApplications };
