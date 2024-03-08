import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useMemo } from "react";
import { PersistedApplication } from "../../model/interfaces/application";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
  },

  booleanBlockIndicator: {
    flexGrow: 1,
    // borderWidth: 1,
    // borderStyle: "dashed",
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
  key,
}) => {
  const classes = useStyles();
  return (
    <div
      key={key}
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
  application: PersistedApplication;
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
      keyPrefix={"" + application.dbId}
    />
  );
};

export default ApplicationAvailabilityIndicator;
