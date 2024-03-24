import React, { useCallback, useState } from "react";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { useApplications } from "./ApplicationsContextProvider";
import {
  ApplicationData,
  ApplicationStatus,
} from "../../interfaces/application-data";
import ApplicationsView from "./ApplicationsView";
import { draftAndDisplayWorkforceMail } from "../../services/mail";
import {
  apiSetApplicationStatus,
  apiUpdateApplication,
} from "../../services/api";

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

const selectableStatusValues: ApplicationStatus[] = [
  "info-required",
  "documents-required",
  "photo-required",
  "ready-to-submit",
  "submitted",
  "complete",
];

const ApplicationsRoute: React.FC = () => {
  const { applications: applicationDatas, updateApplication } =
    useApplications();

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

  const [statusButtonActionRunning, setStatusButtonActionRunning] =
    useState(false);

  const clearSelectedApplication = useCallback(() => {
    setSelectedApplication(undefined);
  }, []);

  const emailSelected = useCallback(
    async (_: string) => {
      await draftAndDisplayWorkforceMail(
        selectedApplication?.profile?.email,
        selectedApplication?.profile?.givenName || "",
        selectedApplication?.profile?.surname || ""
      );
    },
    [selectedApplication]
  );

  const setApplicationStatus = useCallback(
    async (newStatus: ApplicationStatus) => {
      if (selectedApplication) {
        setStatusButtonActionRunning(true);
        const task = pipe(
          newStatus,
          apiSetApplicationStatus(selectedApplication.applicationId)(
            selectedApplication.version
          ),
          TE.match(
            (err) => {
              if (err === "conflict") {
                alert(
                  "Application status has been updated by another user. Please refresh the page."
                );
              } else if (err === "not-found") {
                alert(
                  "The server could not find the requested resource. Please refresh the page."
                );
              } else {
                alert(
                  "An error occurred. Please refresh the page and try again."
                );
              }
            },
            (result) => {
              setSelectedApplication(result.application);
              updateApplication(result.application);
            }
          )
        );
        await task();
        setStatusButtonActionRunning(false);
      }
    },
    [selectedApplication, updateApplication]
  );

  const testSelected = useCallback(async () => {
    if (selectedApplication) {
      await apiUpdateApplication(
        selectedApplication.applicationId,
        selectedApplication.version,
        {
          availableFirstFriday: !selectedApplication.availableFirstFriday,
        }
      );
    }
  }, [selectedApplication]);

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
      testSelected={testSelected}
      currentStatus={selectedApplication?.status || "info-required"}
      statuses={selectableStatusValues}
      actionRunning={statusButtonActionRunning}
      setStatus={setApplicationStatus}
    />
  );
};

export default ApplicationsRoute;
