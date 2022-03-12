import React, { useContext, useEffect, useState } from "react";
import { useTeams } from "msteams-react-base-component";
import { getApplications } from "../../model/application-repository";
import { PersistedApplication } from "../../model/interfaces/application";

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
  const [loaded, setLoaded] = useState(false);
  const [applications, setApplications] = useState<PersistedApplication[]>([]);

  const [result] = useTeams({});

  useEffect(() => {
    const groupId = result.context?.groupId;
    if (groupId)
      getApplications(groupId)
        .then(setApplications)
        .then(() => setLoaded(true));
  }, [result.context?.groupId]);

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
