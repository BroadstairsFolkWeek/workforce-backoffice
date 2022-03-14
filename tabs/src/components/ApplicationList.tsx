import {
  BoxProps,
  Loader,
  Table,
  TableCellProps,
  TableRowProps,
  Text,
} from "@fluentui/react-northstar";
import { ReactNode, useMemo } from "react";
import { PersistedApplication } from "../model/interfaces/application";
import ApplicationAvailabilityIndicator from "./ApplicationAvailabilityIndicator";
import { useAppContext } from "./contexts/app-context-provider";
import { useApplications } from "./contexts/applications-context";
import ProfilePhoto from "./ProfilePhoto";

const asTableCellBox = (
  reactNode: ReactNode,
  styles?: BoxProps["styles"]
): BoxProps => {
  return {
    content: reactNode,
    styles: {
      alignSelf: "stretch",
      ...(styles ?? {}),
    },
  };
};

const applicationToTableCells = (
  application: PersistedApplication,
  groupId: string
): TableCellProps[] => {
  return [
    {
      content: application.photoId
        ? asTableCellBox(
            <ProfilePhoto photoId={application.photoId} groupId={groupId} />
          )
        : null,
    },

    {
      content: asTableCellBox(
        <div>
          <div>
            <Text size="medium" weight="semibold">
              {application.title}
            </Text>
          </div>
          <div>
            <Text>{application.address}</Text>
          </div>
        </div>
      ),
    },

    {
      content: asTableCellBox(<div>{application.telephone}</div>),
      styles: {
        alignSelf: "stretch",
      },
    },

    {
      content: asTableCellBox(
        <div>
          {application.teamPreference1 ? (
            <div>{application.teamPreference1}</div>
          ) : null}
          {application.teamPreference2 ? (
            <div>{application.teamPreference2}</div>
          ) : null}
          {application.teamPreference3 ? (
            <div>{application.teamPreference3}</div>
          ) : null}
        </div>
      ),
    },

    {
      content: asTableCellBox(
        <ApplicationAvailabilityIndicator application={application} />,
        { width: "100%", height: "100%" }
      ),
    },

    { content: asTableCellBox(<Text>{application.status}</Text>) },
  ];
};

const ApplicationList = () => {
  const { groupId } = useAppContext();
  const { loaded: applicationsLoaded, applications } = useApplications();

  const header = {
    items: [
      "Photo",
      "Name / Address",
      "Contact",
      "Requested teams",
      "Availability",
      "Status / Options",
    ],
  };

  const tableItems: TableRowProps[] = useMemo(() => {
    return applications.map((application, index) => {
      return {
        items: applicationToTableCells(application, groupId),

        styles: {
          height: "7rem",
        },
      } as TableRowProps;
    });
  }, [applications, groupId]);

  if (applicationsLoaded) {
    return <Table header={header} rows={tableItems} />;
  } else {
    return <Loader />;
  }
};

export default ApplicationList;
