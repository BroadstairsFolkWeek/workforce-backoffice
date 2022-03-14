import React, { useContext, useEffect, useState } from "react";
import { getApplications } from "../../model/application-repository";
import { PersistedApplication } from "../../model/interfaces/application";
import { PersistedProfile } from "../../model/interfaces/profile";
import { getProfiles } from "../../model/profile-repository";
import { useAppContext } from "./app-context-provider";

export type IApplicationsContext = {
  loaded: boolean;
  applications: PersistedApplication[];
  profiles: PersistedProfile[];
};

const Context = React.createContext<IApplicationsContext>({
  loaded: false,
  applications: [],
  profiles: [],
});

const ApplicationsContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { loaded: appContextLoaded, groupId } = useAppContext();
  const [loaded, setLoaded] = useState(false);
  const [applications, setApplications] = useState<PersistedApplication[]>([]);
  const [profiles, setProfiles] = useState<PersistedProfile[]>([]);

  useEffect(() => {
    if (appContextLoaded && groupId) {
      const applicationsPromise =
        getApplications(groupId).then(setApplications);
      const profilesPromise = getProfiles(groupId).then(setProfiles);

      Promise.all([applicationsPromise, profilesPromise]).then(() =>
        setLoaded(true)
      );
    }
  }, [appContextLoaded, groupId]);

  return (
    <Context.Provider
      value={{
        loaded,
        applications,
        profiles,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useApplications = () => useContext(Context);

export { ApplicationsContextProvider, useApplications };
