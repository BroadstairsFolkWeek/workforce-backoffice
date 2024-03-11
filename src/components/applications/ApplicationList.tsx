import {
  DataGrid,
  DataGridBody,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  DataGridRow,
  Spinner,
  TableColumnDefinition,
  Text,
  createTableColumn,
  makeStyles,
} from "@fluentui/react-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PersistedApplication } from "../../model/interfaces/application";
import { PersistedProfile } from "../../model/interfaces/profile";
import ApplicationAvailabilityIndicator from "./ApplicationAvailabilityIndicator";
import ProfilePhoto from "./ProfilePhoto";
import { useApplications } from "./ApplicationsContextProvider";

type Item = {
  application: PersistedApplication;
  profile: PersistedProfile;
};

const useStyles = makeStyles({
  cell: {
    height: "200px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  photoCell: {
    height: "100%",
    width: "100%",
  },
  img: {
    height: "175px",
    width: "100%",
  },
  availabilityIndicator: {
    height: "25px",
  },
});

const ApplicationList = () => {
  const classes = useStyles();
  const {
    loaded: applicationsLoaded,
    applications,
    profiles,
  } = useApplications();

  const [items, setItems] = useState<Item[]>([]);

  const columns: TableColumnDefinition<Item>[] = useMemo(
    () => [
      createTableColumn<Item>({
        columnId: "photo",
        renderHeaderCell: () => "Photo",
        renderCell: (item) => (
          <div className={classes.photoCell}>
            <div className={classes.img}>
              {item.application.photoId ? (
                <ProfilePhoto photoId={item.application.photoId} />
              ) : null}
            </div>
            <div className={classes.availabilityIndicator}>
              <ApplicationAvailabilityIndicator
                application={item.application}
              />
            </div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "name",
        compare: (a, b) => {
          return a.profile.displayName.localeCompare(b.profile.displayName);
        },
        renderHeaderCell: () => "Name / Address",
        renderCell: (item) => (
          <>
            <Text as="strong" weight="semibold">
              {item.profile?.displayName}
            </Text>
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
              <Text>{item.application.telephone}</Text>
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
              <Text>{item.application.teamPreference1}</Text>
            </div>
            <div>
              <Text>{item.application.teamPreference2}</Text>
            </div>
            <div>
              <Text>{item.application.teamPreference3}</Text>
            </div>
          </div>
        ),
      }),

      createTableColumn<Item>({
        columnId: "status",
        renderHeaderCell: () => "Status / Options",
        renderCell: (item) => <Text>{item.application.status}</Text>,
      }),
    ],
    [classes.availabilityIndicator, classes.img, classes.photoCell]
  );

  const getProfile = useCallback(
    (profileId: string) => {
      return profiles.find((profile) => profile.profileId === profileId);
    },
    [profiles]
  );

  useEffect(() => {
    if (applicationsLoaded) {
      const newItems = applications.map((application) => {
        return {
          application,
          profile: getProfile(application.profileId),
        } as Item;
      });
      setItems(newItems);
    }
  }, [applications, applicationsLoaded, getProfile]);

  if (applicationsLoaded) {
    return (
      <DataGrid
        items={items}
        columns={columns}
        sortable
        getRowId={(item) => item.application.applicationId}
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
        <DataGridBody<Item>>
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
  } else {
    return <Spinner />;
  }
};

export default ApplicationList;
