import { CounterBadge, Divider, makeStyles } from "@fluentui/react-components";
import { FC } from "react";
import FilterInput from "../FilterInput";
import SelectFormSubmissionStatuses from "./SelectFormSubmissionStatuses";
import { Form } from "../../interfaces/form";

type FormsHeaderViewProps = {
  filterString: string;
  filterSelectedStatuses: Set<Form["submissionStatus"]>;
  counterValue: number;
  setFilterString: (s: string) => void;
  setFilterSelectedStatuses: (statuses: Set<Form["submissionStatus"]>) => void;
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

const FormsHeaderView: FC<FormsHeaderViewProps> = ({
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
      <SelectFormSubmissionStatuses
        selectedStatuses={filterSelectedStatuses}
        setSelectedStatuses={setFilterSelectedStatuses}
      />
    </div>
  );
};

export default FormsHeaderView;
