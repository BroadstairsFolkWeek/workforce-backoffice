import { Checkbox, makeStyles } from "@fluentui/react-components";
import { ApplicationStatus } from "../../interfaces/application-data";
import { useCallback, useMemo } from "react";

export interface SelectApplicationStatusesProps {
  selectedStatuses: Set<ApplicationStatus>;
  setSelectedStatuses: (statuses: Set<ApplicationStatus>) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "8px",
  },
});

export interface ApplicationCheckboxProps {
  status: ApplicationStatus;
  selected: boolean;
  setSelected: (status: ApplicationStatus, selected: boolean) => void;
}

const ApplicationCheckbox: React.FC<ApplicationCheckboxProps> = ({
  status,
  selected,
  setSelected,
}) => {
  return (
    <Checkbox
      label={status}
      checked={selected}
      onChange={(e) => setSelected(status, e.target.checked)}
    />
  );
};

const selectableStatuses: ApplicationStatus[] = [
  "profile-required",
  "info-required",
  "photo-required",
  "documents-required",
  "ready-to-submit",
  "submitted",
  "complete",
];

const SelectApplicationStatuses: React.FC<SelectApplicationStatusesProps> = ({
  selectedStatuses,
  setSelectedStatuses,
}) => {
  const classes = useStyles();

  const addRemoveSelectedStatus = useCallback(
    (status: ApplicationStatus, selected: boolean) => {
      const newSelectedStatuses = new Set(selectedStatuses);
      if (selected) {
        newSelectedStatuses.add(status);
      } else {
        newSelectedStatuses.delete(status);
      }

      setSelectedStatuses(newSelectedStatuses);
    },
    [selectedStatuses, setSelectedStatuses]
  );

  const checkboxElements = useMemo(() => {
    return selectableStatuses.map((selectableStatus) => (
      <ApplicationCheckbox
        key={selectableStatus}
        status={selectableStatus}
        selected={selectedStatuses.has(selectableStatus)}
        setSelected={addRemoveSelectedStatus}
      />
    ));
  }, [selectedStatuses, addRemoveSelectedStatus]);

  return <div className={classes.root}>{checkboxElements}</div>;
};

export default SelectApplicationStatuses;
