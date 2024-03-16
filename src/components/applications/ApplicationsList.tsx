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
import ApplicationAvailabilityIndicator from "./ApplicationAvailabilityIndicator";
import ProfilePhoto from "./ProfilePhoto";
import { ApplicationData } from "../../interfaces/application-data";
import { isNullOrUndefined } from "util";

type Item = ApplicationData;

type ApplicationsListProps = {
  applications: ApplicationData[];
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

const ApplicationsList: FC<ApplicationsListProps> = ({ applications }) => {
  const classes = useStyles();

  const columns: TableColumnDefinition<Item>[] = useMemo(
    () => [
      createTableColumn<Item>({
        columnId: "photo",
        renderHeaderCell: () => "Photo",
        renderCell: (item) => (
          <div className={classes.photoCell}>
            <div className={classes.img}>
              {item.photoId ? <ProfilePhoto photoId={item.photoId} /> : null}
            </div>
            <div className={classes.availabilityIndicator}>
              <ApplicationAvailabilityIndicator application={item} />
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
            ) : (
              isNullOrUndefined
            )}
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
            <div>
              <Text>{item.telephone}</Text>
            </div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "requestedTeams",
        renderHeaderCell: () => "Requested teams",
        renderCell: (item) => (
          <div>
            <div>
              <Text>{item.teamPreference1}</Text>
            </div>
            <div>
              <Text>{item.teamPreference2}</Text>
            </div>
            <div>
              <Text>{item.teamPreference3}</Text>
            </div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "status",
        renderHeaderCell: () => "Status / Options",
        renderCell: (item) => <Text>{item.status}</Text>,
      }),
    ],
    [classes.availabilityIndicator, classes.img, classes.photoCell]
  );

  return (
    <DataGrid
      className={classes.grid}
      items={applications}
      columns={columns}
      sortable
      getRowId={(item) => item.applicationId}
      focusMode="none"
      selectionMode="single"
      resizableColumns
      columnSizingOptions={{
        photo: { minWidth: 100 },
        name: { minWidth: 200 },
        contact: { minWidth: 300 },
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

export default ApplicationsList;
