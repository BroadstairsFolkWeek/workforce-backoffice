import { ListItem } from "@microsoft/microsoft-graph-types";
import { logWarn } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  isAcceptedMimeType,
} from "../../interfaces/sp/sp-files";
import { getSiteBaseApiPathForCurrentGroup } from "./site-graph";

export const getProfilePhotoFileByPhotoId = async (
  photoId: string
): Promise<[string, ArrayBuffer, ACCEPTED_IMAGE_MIME_TYPES] | null> => {
  const siteBaseApiPath = await getSiteBaseApiPathForCurrentGroup();

  const photosListApiPath = siteBaseApiPath + "/lists/Workforce Photos";

  const photoListItemApiPath = photosListApiPath + "/items";

  const graphClient = getOboGraphClient();
  const photoItemResponse = await graphClient
    .api(photoListItemApiPath)
    .expand(["fields", "driveItem"])
    .filter(`fields/PhotoId eq '${photoId}'`)
    .get();

  const listItems: ListItem[] = photoItemResponse.value;
  if (listItems.length > 0) {
    const listItem = listItems[0];
    const driveItem = listItem.driveItem;
    const downloadUrl: string = driveItem["@microsoft.graph.downloadUrl"];
    const downloadContentResponse = await fetch(downloadUrl);
    const fileContent = await downloadContentResponse.arrayBuffer();
    const mimeType = driveItem.file.mimeType;

    if (isAcceptedMimeType(mimeType)) {
      return [driveItem.name, fileContent, mimeType];
    } else {
      logWarn("Invalid mimetype read for file: " + mimeType);
    }
  }

  return null;
};
