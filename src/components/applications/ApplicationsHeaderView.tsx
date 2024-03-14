import { makeStyles } from "@fluentui/react-components";
import { FC } from "react";
import FilterInput from "../FilterInput";

type ApplicationsHeaderViewProps = {
  filterString: string;
  setFilterString: (s: string) => void;
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },
});

const ApplicationsHeaderView: FC<ApplicationsHeaderViewProps> = ({
  filterString,
  setFilterString,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FilterInput
        filterString={filterString}
        setFilterString={setFilterString}
      />
    </div>
  );
};

export default ApplicationsHeaderView;
