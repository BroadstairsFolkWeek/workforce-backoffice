import React, { useCallback, useState } from "react";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import {
  ApplicationInfo,
  ApplicationStatus,
} from "../../interfaces/application-data";
import ApplicationsView from "./ApplicationsView";
import { draftAndDisplayWorkforceMail } from "../../services/mail";
import { apiSetApplicationStatusTE } from "../../api/applications-api";

type ApplicationsControllerProps = {
  applications: ApplicationInfo[];
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
  applications: ApplicationInfo[]
): ApplicationInfo[] => {
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
  applications: ApplicationInfo[]
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

const ApplicationsController: React.FC<ApplicationsControllerProps> = ({
  applications: applicationsFromRouteLoader,
}) => {
  const [applications, setApplications] = useState<Array<ApplicationInfo>>(
    applicationsFromRouteLoader
  );

  const [filterString, setFilterString] = React.useState("");
  const [filteredApplications, setFilteredApplications] = React.useState<
    ApplicationInfo[]
  >([]);

  const [filterSelectedStatuses, setFilterSelectedStatuses] = useState<
    Set<ApplicationStatus>
  >(new Set());

  const [selectedApplication, setSelectedApplication] = useState<
    ApplicationInfo | undefined
  >();

  const [statusButtonActionRunning, setStatusButtonActionRunning] =
    useState(false);

  const updateApplication = useCallback(
    (updatedApplication: ApplicationInfo) => {
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.applicationId === updatedApplication.applicationId
            ? updatedApplication
            : application
        )
      );
    },
    []
  );

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
          apiSetApplicationStatusTE(selectedApplication.applicationId)(
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
              setSelectedApplication(result);
              updateApplication(result);
            }
          )
        );
        await task();
        setStatusButtonActionRunning(false);
      }
    },
    [selectedApplication, updateApplication]
  );

  React.useEffect(() => {
    setFilteredApplications(
      filterApplicationsByTerm(
        filterString,
        filterApplicationsByStatus(filterSelectedStatuses, applications)
      )
    );
  }, [filterString, filterSelectedStatuses, applications]);

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
      currentStatus={selectedApplication?.status || "info-required"}
      statuses={selectableStatusValues}
      actionRunning={statusButtonActionRunning}
      setStatus={setApplicationStatus}
    />
  );
};

export default ApplicationsController;
