import React, { useContext, useEffect, useState } from "react";

export type IAppContext = {
  loaded: boolean;
  tenantId: string;
  groupId: string;
};

const Context = React.createContext<IAppContext>({
  loaded: false,
  tenantId: "",
  groupId: "",
});

const AppContextProvider = ({ children }: { children: JSX.Element }) => {
  const [loaded, setLoaded] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const tenantCandidate = searchParams.get("tenant");
    if (tenantCandidate) {
      setTenantId(tenantCandidate);
    }

    const groupCandidate = searchParams.get("group");
    if (groupCandidate) {
      setGroupId(groupCandidate);
    }

    if (tenantCandidate || groupCandidate) {
      setLoaded(true);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        loaded,
        groupId,
        tenantId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useAppContext = () => useContext(Context);

export { AppContextProvider, useAppContext };
