import React, { useMemo } from "react";

import { useApplications } from "./ApplicationsContextProvider";
import { PersistedProfile } from "../../model/interfaces/profile";
import { PersistedApplication } from "../../model/interfaces/application";
import { ApplicationData } from "../../interfaces/application-data";
import ApplicationsView from "./ApplicationsView";

const mergeApplicationsAndProfiles = (
  applications: PersistedApplication[],
  profiles: PersistedProfile[]
): ApplicationData[] => {
  return applications.map((application) => {
    const profile = profiles.find(
      (profile) => profile.profileId === application.profileId
    );
    return {
      ...application,
      profile,
    };
  });
};

const filterValueByTerm = (
  value: string | undefined,
  termLc: string
): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  return value.toLowerCase().includes(termLc);
};

const filterApplicationsByTerm = (
  term: string,
  applications: ApplicationData[]
): ApplicationData[] => {
  return applications.filter((data) => {
    const termLc = term.toLowerCase();
    return (
      filterValueByTerm(data.profile?.displayName, termLc) ||
      filterValueByTerm(data.profile?.email, termLc) ||
      filterValueByTerm(data.profile?.telephone, termLc) ||
      filterValueByTerm(data.profile?.address, termLc) ||
      filterValueByTerm(data.profile?.givenName, termLc) ||
      filterValueByTerm(data.profile?.surname, termLc) ||
      filterValueByTerm(data.teamPreference1, termLc) ||
      filterValueByTerm(data.teamPreference2, termLc) ||
      filterValueByTerm(data.teamPreference3, termLc)
    );
  });
};

const ApplicationsRoute: React.FC = () => {
  const { applications, profiles } = useApplications();

  const applicationDatas = useMemo(
    () => mergeApplicationsAndProfiles(applications, profiles),
    [applications, profiles]
  );

  const [filterString, setFilterString] = React.useState("");
  const [filteredApplications, setFilteredApplications] = React.useState<
    ApplicationData[]
  >([]);

  React.useEffect(() => {
    if (filterString.length === 0) {
      setFilteredApplications(applicationDatas);
    } else {
      setFilteredApplications(
        filterApplicationsByTerm(filterString, applicationDatas)
      );
    }
  }, [filterString, applicationDatas]);

  return (
    <ApplicationsView
      applications={filteredApplications}
      filterString={filterString}
      setFilterString={setFilterString}
    />
  );
};

export default ApplicationsRoute;
