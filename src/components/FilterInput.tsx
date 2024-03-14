import { Button, Input, Label, makeStyles } from "@fluentui/react-components";

export interface FilterInputProps {
  filterString: string;
  setFilterString: (s: string) => void;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    columnGap: "8px",
  },
  clearButtonHidden: {
    visibility: "hidden",
  },
  clearButtonSvg: {
    width: "20px",
  },
});

const FilterInput: React.FC<FilterInputProps> = ({
  filterString,
  setFilterString,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Label>Filter</Label>
      <Input
        value={filterString}
        onChange={(e) => setFilterString(e.target.value)}
      />

      <Button
        className={filterString.length === 0 ? classes.clearButtonHidden : ""}
        size="small"
        appearance="transparent"
        onClick={() => setFilterString("")}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={classes.clearButtonSvg}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </div>
  );
};

export default FilterInput;
