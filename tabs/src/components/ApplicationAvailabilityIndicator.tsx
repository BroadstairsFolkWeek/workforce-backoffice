import { Flex, FlexItem } from "@fluentui/react-northstar";
import { useMemo } from "react";
import { PersistedApplication } from "../model/interfaces/application";

const BooleanBlockIndicator: React.FC<{ value: boolean; key: string }> = ({
  value,
  key,
}) => {
  return (
    <FlexItem grow>
      <div
        key={key}
        style={{
          backgroundColor: value ? "green" : "red",
          borderWidth: 1,
          borderStyle: "dashed",
        }}
      ></div>
    </FlexItem>
  );
};

const BooleanBlockIndicatorRow: React.FC<{
  values: boolean[];
  keyPrefix: string;
}> = ({ values, keyPrefix }) => {
  const indicators = useMemo(
    () =>
      values.map((value, index) => (
        <BooleanBlockIndicator value={value} key={keyPrefix + index} />
      )),
    [values, keyPrefix]
  );

  return (
    <Flex vAlign="stretch" style={{ height: "100%" }}>
      {indicators}
    </Flex>
  );
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
