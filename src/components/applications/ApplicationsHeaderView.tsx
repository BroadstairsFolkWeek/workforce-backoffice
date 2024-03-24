import { CounterBadge, Divider, makeStyles } from "@fluentui/react-components";
import { FC } from "react";
import FilterInput from "../FilterInput";
import SelectApplicationStatuses from "./SelectApplicationStatuses";
import { ApplicationStatus } from "../../interfaces/application-data";

type ApplicationsHeaderViewProps = {
  filterString: string;
  filterSelectedStatuses: Set<ApplicationStatus>;
  counterValue: number;
  setFilterString: (s: string) => void;
  setFilterSelectedStatuses: (statuses: Set<ApplicationStatus>) => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
  },
  divider: {
    flexGrow: 0,
  },
});

const ApplicationsHeaderView: FC<ApplicationsHeaderViewProps> = ({
  filterString,
  filterSelectedStatuses,
  counterValue,
  setFilterString,
  setFilterSelectedStatuses,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FilterInput
        filterString={filterString}
        setFilterString={setFilterString}
      />
      <CounterBadge count={counterValue} overflowCount={999} />
      <Divider className={classes.divider} vertical />
      <SelectApplicationStatuses
        selectedStatuses={filterSelectedStatuses}
        setSelectedStatuses={setFilterSelectedStatuses}
      />
    </div>
  );
};

export default ApplicationsHeaderView;
