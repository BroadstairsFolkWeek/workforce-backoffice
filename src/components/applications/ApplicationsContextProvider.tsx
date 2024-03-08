import React, { useCallback, useContext, useEffect, useState } from "react";
import { applicationsContextUninitialisedSymbol } from "./symbols";
import { PersistedApplication } from "../../../api/model/interfaces/application";
import { PersistedProfile } from "../../../api/model/interfaces/profile";
import { useApiAccess } from "../../services/ApiContext";

export type IApplicationsContext = {
  loaded: boolean;
  applications: PersistedApplication[];
  profiles: PersistedProfile[];
  getPhoto: (photoId: string) => Promise<string>;
};

export const Context = React.createContext<
  IApplicationsContext | typeof applicationsContextUninitialisedSymbol
>(applicationsContextUninitialisedSymbol);

const ApplicationsContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { callApiGet } = useApiAccess();
  const [loaded, setLoaded] = useState(false);
  const [applications, setApplications] = useState<PersistedApplication[]>([]);
  const [profiles, setProfiles] = useState<PersistedProfile[]>([]);

  const getPhoto = useCallback(
    async (photoId: string) => {
      try {
        const searchParams = new URLSearchParams();
        searchParams.append("id", photoId);
        const photoData = await callApiGet(
          "profilePhoto",
          searchParams,
          "blob"
        );
        const dataSrcUrl = URL.createObjectURL(photoData);
        return dataSrcUrl;
      } catch (err) {
        throw err;
      }
    },
    [callApiGet]
  );

  useEffect(() => {
    const applicationsPromise =
      callApiGet("applications").then(setApplications);
    const profilesPromise = callApiGet("profiles").then(setProfiles);

    Promise.all([applicationsPromise, profilesPromise]).then(() =>
      setLoaded(true)
    );
  }, [callApiGet]);

  return (
    <Context.Provider
      value={{
        loaded,
        applications,
        profiles,
        getPhoto,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useApplications = () => {
  const currentContextValue = useContext(Context);
  if (currentContextValue === applicationsContextUninitialisedSymbol) {
    throw new Error(
      "useApplications must be used within an ApplicationsContextProvider"
    );
  }
  return currentContextValue;
};

export { ApplicationsContextProvider, useApplications };
