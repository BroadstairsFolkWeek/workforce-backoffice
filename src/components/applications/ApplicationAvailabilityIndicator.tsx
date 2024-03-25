import {
  makeStyles,
  mergeClasses,
  shorthands,
} from "@fluentui/react-components";
import { useMemo } from "react";
import { ApplicationInfo } from "../../interfaces/application-data";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },

  booleanBlockIndicator: {
    flexGrow: 1,
    ...shorthands.borderWidth("1px"),
    ...shorthands.borderStyle("dashed"),
  },

  booleanBlockIndicatorTrue: {
    backgroundColor: "green",
  },

  booleanBlockIndicatorFalse: {
    backgroundColor: "red",
  },
});

const BooleanBlockIndicator: React.FC<{ value: boolean; key: string }> = ({
  value,
}) => {
  const classes = useStyles();
  return (
    <div
      className={mergeClasses(
        classes.booleanBlockIndicator,
        value
          ? classes.booleanBlockIndicatorTrue
          : classes.booleanBlockIndicatorFalse
      )}
      style={{
        backgroundColor: value ? "green" : "red",
        borderWidth: 1,
        borderStyle: "dashed",
      }}
    ></div>
  );
};

const BooleanBlockIndicatorRow: React.FC<{
  values: boolean[];
  keyPrefix: string;
}> = ({ values, keyPrefix }) => {
  const classes = useStyles();

  const indicators = useMemo(
    () =>
      values.map((value, index) => (
        <BooleanBlockIndicator value={value} key={keyPrefix + index} />
      )),
    [values, keyPrefix]
  );

  return <div className={classes.root}>{indicators}</div>;
};

const ApplicationAvailabilityIndicator: React.FC<{
  application: ApplicationInfo;
}> = ({ application }) => {
  const values = useMemo(
    () => [
      application.availableFirstFriday,
      application.availableSaturday,
      application.availableSunday,
      application.availableMonday,
      application.availableTuesday,
      application.availableWednesday,
      application.availableThursday,
      application.availableLastFriday,
    ],
    [application]
  );

  return (
    <BooleanBlockIndicatorRow
      values={values}
      keyPrefix={application.applicationId}
    />
  );
};

export default ApplicationAvailabilityIndicator;
