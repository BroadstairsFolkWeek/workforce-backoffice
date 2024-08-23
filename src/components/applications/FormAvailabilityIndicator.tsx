import {
  makeStyles,
  mergeClasses,
  shorthands,
} from "@fluentui/react-components";
import { useMemo } from "react";
import { Form } from "../../interfaces/form";

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

const FormAvailabilityIndicator: React.FC<{
  form: Form;
}> = ({ form }) => {
  const answers = form.answers as any;
  const values = useMemo(
    () => [
      answers?.day1 ?? false,
      answers?.day2 ?? false,
      answers?.day3 ?? false,
      answers?.day4 ?? false,
      answers?.day5 ?? false,
      answers?.day6 ?? false,
      answers?.day7 ?? false,
      answers?.day8 ?? false,
    ],
    [form]
  );

  return <BooleanBlockIndicatorRow values={values} keyPrefix={form.id} />;
};

export default FormAvailabilityIndicator;
