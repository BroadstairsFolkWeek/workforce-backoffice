import { Checkbox, makeStyles } from "@fluentui/react-components";
import { ApplicationStatus } from "../../interfaces/application-data";
import { useCallback, useMemo } from "react";
import { Form } from "../../interfaces/form";

export interface SelectFormSubmissionStatusesProps {
  selectedStatuses: Set<Form["submissionStatus"]>;
  setSelectedStatuses: (statuses: Set<Form["submissionStatus"]>) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "8px",
  },
});

export interface FormCheckboxProps {
  status: Form["submissionStatus"];
  selected: boolean;
  setSelected: (status: Form["submissionStatus"], selected: boolean) => void;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
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

const selectableStatuses: Form["submissionStatus"][] = [
  "draft",
  "submittable",
  "submitted",
  "accepted",
];

const SelectFormSubmissionStatuses: React.FC<
  SelectFormSubmissionStatusesProps
> = ({ selectedStatuses, setSelectedStatuses }) => {
  const classes = useStyles();

  const addRemoveSelectedStatus = useCallback(
    (status: Form["submissionStatus"], selected: boolean) => {
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
      <FormCheckbox
        key={selectableStatus}
        status={selectableStatus}
        selected={selectedStatuses.has(selectableStatus)}
        setSelected={addRemoveSelectedStatus}
      />
    ));
  }, [selectedStatuses, addRemoveSelectedStatus]);

  return <div className={classes.root}>{checkboxElements}</div>;
};

export default SelectFormSubmissionStatuses;
