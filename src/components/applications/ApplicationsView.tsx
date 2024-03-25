import React from "react";
import {
  Button,
  Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  makeStyles,
  OverlayDrawer,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

import {
  ApplicationInfo,
  ApplicationStatus,
} from "../../interfaces/application-data";
import ApplicationsList from "./ApplicationsList";
import ApplicationsHeaderView from "./ApplicationsHeaderView";
import ApplicationsDetails, {
  ApplicationsDetailsProps,
} from "./ApplicationDetails";

type ApplicationsViewProps = Omit<ApplicationsDetailsProps, "application"> & {
  applications: ApplicationInfo[];
  selectedApplication: ApplicationInfo | undefined;
  filterString: string;
  filterSelectedStatuses: Set<ApplicationStatus>;
  setFilterString: (s: string) => void;
  setFilterSelectedStatuses: (statuses: Set<ApplicationStatus>) => void;
  applicationSelected: (application: ApplicationInfo) => void;
  clearSelectedApplication: () => void;
  emailSelected: (email: string) => void;
};

const useStyles = makeStyles({
  root: {
    height: "98%",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  drawerBody: {
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
});

const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  selectedApplication,
  filterString,
  filterSelectedStatuses,
  setFilterString,
  setFilterSelectedStatuses,
  applicationSelected,
  clearSelectedApplication,
  ...applicationDetailsProps
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ApplicationsHeaderView
        filterString={filterString}
        filterSelectedStatuses={filterSelectedStatuses}
        counterValue={applications.length}
        setFilterString={setFilterString}
        setFilterSelectedStatuses={setFilterSelectedStatuses}
      />

      <Divider />

      <ApplicationsList
        applications={applications}
        selectedApplication={selectedApplication}
        applicationSelected={applicationSelected}
        clearSelectedApplication={clearSelectedApplication}
      />

      {selectedApplication ? (
        <OverlayDrawer
          size="medium"
          position="end"
          open={true}
          onOpenChange={() => clearSelectedApplication()}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => clearSelectedApplication()}
                />
              }
            >
              {selectedApplication.profile?.givenName}{" "}
              {selectedApplication.profile?.surname}
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className={classes.drawerBody}>
            <ApplicationsDetails
              {...applicationDetailsProps}
              application={selectedApplication}
            />
          </DrawerBody>
        </OverlayDrawer>
      ) : null}
    </div>
  );
};

export default ApplicationsView;
