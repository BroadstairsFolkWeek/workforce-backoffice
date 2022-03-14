import * as path from "path";
import { getAppAsyncContext } from "../../context/app-async-context";
import { Drive, ListItem } from "@microsoft/microsoft-graph-types";
import { logWarn } from "../../utilities/logging";
import { getOboGraphClient } from "../../services/graph-client";
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_MIME_TYPES,
  ACCEPTED_MIME_TYPE_FILE_EXTENSIONS_MAPPING,
  isAcceptedMimeType,
} from "../../interfaces/sp/sp-files";
import { getSiteBaseApiPathForCurrentGroup } from "./site-graph";

export const getFileForUniqueId = async (
  uniqueId: string
): Promise<[string, ArrayBuffer] | null> => {
  const graphClient = getOboGraphClient();

  const appContext = getAppAsyncContext();

  const drivesResponse = await graphClient
    .api(`/groups/${appContext.groupId}/drives`)
    .filter("name eq 'Workforce Photos'")
    .get();

  const drives: Drive[] = drivesResponse.value;
  console.log("Drives: " + JSON.stringify(drives, null, 2));

  const driveIds = drives
    .filter((drive) => drive.name === "Workforce Photos")
    .map((drive) => drive.id);
  if (driveIds.length > 0) {
    const driveId = driveIds[0];

    const childrenResponse = await graphClient
      .api(`/drives/${driveId}/root/children`)
      .get();
    console.log("File children: " + JSON.stringify(childrenResponse, null, 2));

    const contentResponse = await graphClient
      .api(`/drives/${driveId}/items/${uniqueId}/content`)
      .get();
    return ["photoFileName", contentResponse];
  }

  return null;
};

const fileResultToImageResult = (
  filename: string,
  content: ArrayBuffer
):
  | [string, ArrayBuffer, ACCEPTED_IMAGE_EXTENSIONS, ACCEPTED_IMAGE_MIME_TYPES]
  | null => {
  const extensionWithDot = path.extname(filename);
  if (!extensionWithDot) {
    return null;
  }

  const extension = extensionWithDot.substring(1);
  for (const mimeType in ACCEPTED_MIME_TYPE_FILE_EXTENSIONS_MAPPING) {
    if (isAcceptedMimeType(mimeType)) {
      if (ACCEPTED_MIME_TYPE_FILE_EXTENSIONS_MAPPING[mimeType] === extension) {
        return [
          filename,
          content,
          ACCEPTED_MIME_TYPE_FILE_EXTENSIONS_MAPPING[mimeType],
          mimeType,
        ];
      }
    }
  }

  return null;
};

export const getImageFileForUniqueId = async (
  uniqueId: string
): Promise<
  | [string, ArrayBuffer, ACCEPTED_IMAGE_EXTENSIONS, ACCEPTED_IMAGE_MIME_TYPES]
  | null
> => {
  const getFileResult = await getFileForUniqueId(uniqueId);
  if (!getFileResult) {
    return null;
  }

  return fileResultToImageResult(getFileResult[0], getFileResult[1]);
};

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
