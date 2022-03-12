import { List, Image, ListItemProps } from "@fluentui/react-northstar";
import { useMemo } from "react";
import { useApplications } from "./contexts/applications-context";

const ApplicationList = () => {
  const { applications } = useApplications();

  const items: ListItemProps[] = useMemo(() => {
    return applications.map((application, index) => {
      return {
        key: index,
        media: (
          <Image
            height="256px"
            width="256px"
            src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg"
            avatar
          />
        ),
        header: application.title,
        headerMedia: "5:22:40 PM",
        content: (
          <div>
            <h1>H1 PLACEHOLDER</h1>
            <p>PARAGRAPH PARAGRAPH</p>
          </div>
        ),
      };
    });
  }, [applications]);

  return <List selectable items={items} />;
};

export default ApplicationList;
