import React, { useCallback, useMemo, useState } from "react";

import { useApplications } from "./ApplicationsContextProvider";
import { PersistedProfile } from "../../model/interfaces/profile";
import { PersistedApplication } from "../../model/interfaces/application";
import {
  ApplicationData,
  ApplicationStatus,
} from "../../interfaces/application-data";
import ApplicationsView from "./ApplicationsView";
import { draftAndDisplayWorkforceMail } from "../../services/mail";

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
  if (term.length === 0) {
    return applications;
  }

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

const filterApplicationsByStatus = (
  statuses: Set<ApplicationStatus>,
  applications: ApplicationData[]
) => {
  if (statuses.size === 0) {
    return applications;
  }

  return applications.filter((application) => statuses.has(application.status));
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

  const [filterSelectedStatuses, setFilterSelectedStatuses] = useState<
    Set<ApplicationStatus>
  >(new Set());

  const [selectedApplication, setSelectedApplication] = useState<
    ApplicationData | undefined
  >();

  const clearSelectedApplication = useCallback(() => {
    setSelectedApplication(undefined);
  }, []);

  const emailSelected = useCallback(async (email: string) => {
    await draftAndDisplayWorkforceMail(email, "John", "Doe");
  }, []);

  React.useEffect(() => {
    setFilteredApplications(
      filterApplicationsByTerm(
        filterString,
        filterApplicationsByStatus(filterSelectedStatuses, applicationDatas)
      )
    );
  }, [filterString, filterSelectedStatuses, applicationDatas]);

  return (
    <ApplicationsView
      applications={filteredApplications}
      selectedApplication={selectedApplication}
      filterString={filterString}
      filterSelectedStatuses={filterSelectedStatuses}
      setFilterString={setFilterString}
      setFilterSelectedStatuses={setFilterSelectedStatuses}
      applicationSelected={setSelectedApplication}
      clearSelectedApplication={clearSelectedApplication}
      emailSelected={emailSelected}
    />
  );
};

export default ApplicationsRoute;
