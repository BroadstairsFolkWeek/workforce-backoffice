import {
  DataGrid,
  DataGridBody,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  DataGridRow,
  TableColumnDefinition,
  Text,
  createTableColumn,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { FC, useMemo } from "react";
import FormAvailabilityIndicator from "./FormAvailabilityIndicator";
import ProfilePhoto from "./ProfilePhoto";
import { Form } from "../../interfaces/form";

type Item = Form;

type FormsListProps = {
  forms: readonly Form[];
  selectedForm: Form | undefined;
  formSelected: (form: Form) => void;
  clearSelectedForm: () => void;
};

const useStyles = makeStyles({
  grid: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  gridBody: {
    overflowY: "scroll",
    flexGrow: 1,
    flexShrink: 1,
    height: "100px",
  },
  cell: {
    height: "200px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    ...shorthands.padding("4px"),
  },
  photoCell: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "start",
  },
  img: {
    // Set the photo image to a very small height and utilise flexGrow to fill any remaining space in the cell.
    height: "1%",
    flexGrow: 1,
  },
  availabilityIndicator: {
    height: "25px",
  },
});

const FormsList: FC<FormsListProps> = ({
  forms,
  selectedForm,
  formSelected,
  clearSelectedForm,
}) => {
  const classes = useStyles();

  const columns: TableColumnDefinition<Item>[] = useMemo(
    () => [
      createTableColumn<Item>({
        columnId: "photo",
        renderHeaderCell: () => "Photo",
        renderCell: (item) => (
          <div className={classes.photoCell}>
            <div className={classes.img}>
              {item.profile.metadata.photoThumbnailUrl ? (
                <ProfilePhoto form={item} thumbnail={true} />
              ) : null}
            </div>
            <div className={classes.availabilityIndicator}>
              <FormAvailabilityIndicator form={item} />
            </div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "name",
        compare: (a, b) => {
          return (a.profile?.displayName || "").localeCompare(
            b.profile?.displayName || ""
          );
        },
        renderHeaderCell: () => "Name / Display name / Address",
        renderCell: (item) => (
          <>
            <Text as="strong" weight="semibold">
              {item.profile?.givenName} {item.profile?.surname}
            </Text>
            {item.profile?.displayName ? (
              <Text as="i">({item.profile?.displayName})</Text>
            ) : null}
            <Text>{item.profile?.address}</Text>
          </>
        ),
      }),

      createTableColumn<Item>({
        columnId: "contact",
        renderHeaderCell: () => "Contact",
        renderCell: (item) => (
          <div>
            <div>
              <Text>{item.profile?.email}</Text>
            </div>
            <div>{/* <Text>{item.telephone}</Text> */}</div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "requestedTeams",
        renderHeaderCell: () => "Requested teams",
        renderCell: (item) => (
          <div>
            <div>{/* <Text>{item.teamPreference1}</Text> */}</div>
            <div>{/* <Text>{item.teamPreference2}</Text> */}</div>
            <div>{/* <Text>{item.teamPreference3}</Text> */}</div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "status",
        renderHeaderCell: () => "Status / Options",
        renderCell: (item) => <Text>{item.submissionStatus}</Text>,
      }),

      createTableColumn<Item>({
        columnId: "createdDateTime",
        renderHeaderCell: () => "Created",
        renderCell: (item) => (
          <Text>{item.createdDateTimeUtc.toLocaleString()}</Text>
        ),
        compare: (a, b) =>
          a.createdDateTimeUtc.getTime() - b.createdDateTimeUtc.getTime(),
      }),

      createTableColumn<Item>({
        columnId: "modifiedDateTime",
        renderHeaderCell: () => "Modified",
        renderCell: (item) => (
          <Text>{item.modifiedDateTimeUtc.toLocaleString()}</Text>
        ),
        compare: (a, b) =>
          a.modifiedDateTimeUtc.getTime() - b.modifiedDateTimeUtc.getTime(),
      }),
    ],
    [classes.availabilityIndicator, classes.img, classes.photoCell]
  );

  return (
    <DataGrid
      className={classes.grid}
      items={[...forms]}
      columns={columns}
      sortable
      getRowId={(item) => item.id}
      focusMode="none"
      selectionMode="single"
      resizableColumns
      columnSizingOptions={{
        photo: { minWidth: 100 },
        name: { minWidth: 200 },
        contact: { minWidth: 300 },
      }}
      selectedItems={selectedForm ? [selectedForm.id] : []}
      onSelectionChange={(e, data) => {
        if (data.selectedItems.size > 0) {
          formSelected(forms.find((form) => data.selectedItems.has(form.id))!);
        } else {
          clearSelectedForm();
        }
      }}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item> className={classes.gridBody}>
        {({ item, rowId }) => (
          <DataGridRow<Item>
            key={rowId}
            selectionCell={{
              checkboxIndicator: { "aria-label": "Select row" },
            }}
          >
            {({ renderCell }) => (
              <DataGridCell className={classes.cell}>
                {renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};

export default FormsList;
