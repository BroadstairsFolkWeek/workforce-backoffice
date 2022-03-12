import { Image, Table, TableRowProps } from "@fluentui/react-northstar";
import { useMemo } from "react";
import { useApplications } from "./contexts/applications-context";

const ApplicationList = () => {
  const { applications } = useApplications();

  const header = {
    items: [
      "Photo",
      "Name",
      "Address",
      "Phone",
      "Email",
      "Requested teams",
      "Availability",
      "Options",
    ],
  };

  const tableItems: TableRowProps[] = useMemo(() => {
    return applications.map((application, index) => {
      return {
        items: [
          <Image
            height="256px"
            width="256px"
            src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg"
            avatar
          />,
          application.title,
          application.address,
          { content: application.telephone, truncateContent: true },
          "",
          `${application.teamPreference1 ?? ""} / ${
            application.teamPreference2 ?? ""
          } / ${application.teamPreference3 ?? ""}`,
          "",
          "",
        ],
      };
    });
  }, [applications]);

  return <Table header={header} rows={tableItems} />;
};

export default ApplicationList;
