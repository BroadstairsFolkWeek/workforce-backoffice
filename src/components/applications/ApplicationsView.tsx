import React from "react";

import {
  ApplicationData,
  ApplicationStatus,
} from "../../interfaces/application-data";
import { Divider, makeStyles } from "@fluentui/react-components";
import ApplicationsList from "./ApplicationsList";
import ApplicationsHeaderView from "./ApplicationsHeaderView";

interface ApplicationsViewProps {
  applications: ApplicationData[];
  filterString: string;
  filterSelectedStatuses: Set<ApplicationStatus>;
  setFilterString: (s: string) => void;
  setFilterSelectedStatuses: (statuses: Set<ApplicationStatus>) => void;
}

const useStyles = makeStyles({
  root: {
    height: "98%",
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
});

const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  filterString,
  filterSelectedStatuses,
  setFilterString,
  setFilterSelectedStatuses,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ApplicationsHeaderView
        filterString={filterString}
        filterSelectedStatuses={filterSelectedStatuses}
        setFilterString={setFilterString}
        setFilterSelectedStatuses={setFilterSelectedStatuses}
      />

      <Divider />

      <ApplicationsList applications={applications} />
    </div>
  );
};

export default ApplicationsView;
