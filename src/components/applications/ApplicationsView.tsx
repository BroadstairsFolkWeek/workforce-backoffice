import React from "react";

import { ApplicationData } from "../../interfaces/application-data";
import { Divider, makeStyles } from "@fluentui/react-components";
import ApplicationsList from "./ApplicationsList";
import ApplicationsHeaderView from "./ApplicationsHeaderView";

interface ApplicationsViewProps {
  applications: ApplicationData[];
  filterString: string;
  setFilterString: (s: string) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
});

const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  filterString,
  setFilterString,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ApplicationsHeaderView
        filterString={filterString}
        setFilterString={setFilterString}
      />

      <Divider />

      <ApplicationsList applications={applications} />
    </div>
  );
};

export default ApplicationsView;
