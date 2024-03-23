import React, { useCallback, useContext, useEffect, useState } from "react";
import { applicationsContextUninitialisedSymbol } from "./symbols";
import { useApiAccess } from "../../services/ApiContext";
import {
  Application,
  ApplicationData,
} from "../../interfaces/application-data";
import { apiGetApplications } from "../../services/api";

export type IApplicationsContext = {
  loaded: boolean;
  applications: Application[];
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
  const [applications, setApplications] = useState<ApplicationData[]>([]);

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
    const applicationsPromise = apiGetApplications().then((result) =>
      setApplications(result.applications)
    );

    Promise.all([applicationsPromise]).then(() => setLoaded(true));
  }, [callApiGet]);

  return (
    <Context.Provider
      value={{
        loaded,
        applications,
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
