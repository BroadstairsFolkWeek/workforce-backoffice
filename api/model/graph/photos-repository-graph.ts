import * as ROA from "fp-ts/lib/ReadonlyArray";
import * as RONEA from "fp-ts/lib/ReadonlyNonEmptyArray";
import * as A from "fp-ts/lib/Array";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import * as E from "fp-ts/lib/Either";
import * as IO from "fp-ts/lib/IO";
import * as TE from "fp-ts/lib/TaskEither";
import { flow, pipe } from "fp-ts/lib/function";

import {
  DriveItem,
  ListItem,
  ThumbnailSet,
} from "@microsoft/microsoft-graph-types";
import {
  getFromGraphRequest,
  getOboGraphClient,
  getOboGraphClientIO,
} from "../../services/graph-client";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  isAcceptedMimeType,
} from "../../interfaces/sp/sp-files";
import { getSiteBaseApiPath, getSiteBaseApiPathTE } from "./site-graph";
import { logWarn } from "../../utilities/logging";
import { PersistedGraphListItem } from "../interfaces/graph/graph-items";
import { PersistedPhotoListItem } from "../interfaces/sp/photo-sp";
import { GraphRequest } from "@microsoft/microsoft-graph-client";
import { ModelPhotoUrlSet } from "../interfaces/photos";

export const getProfilePhotoFileByPhotoId = async (
  photoId: string
): Promise<[string, ArrayBuffer, ACCEPTED_IMAGE_MIME_TYPES] | null> => {
  const siteBaseApiPath = await getSiteBaseApiPath();

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

    const thumbnailsApiPath = `/drives/${driveItem.parentReference.driveId}/items/${driveItem.id}/thumbnails`;
    const thumbnailsResponse = await graphClient.api(thumbnailsApiPath).get();
    const thumbnailSets: ThumbnailSet[] = thumbnailsResponse.value;
    if (thumbnailSets.length > 0) {
      const thumbnailUrl = thumbnailSets[0].medium.url;
      // const downloadUrl: string = driveItem["@microsoft.graph.downloadUrl"];
      const downloadContentResponse = await fetch(thumbnailUrl);
      // const downloadContentResponse = await fetch(downloadUrl);
      const fileContent = await downloadContentResponse.arrayBuffer();
      const mimeType = driveItem.file.mimeType;

      if (isAcceptedMimeType(mimeType)) {
        return [driveItem.name, fileContent, mimeType];
      } else {
        logWarn("Invalid mimetype read for file: " + mimeType);
      }
    }
  }

  return null;
};

const getWorkforcePhotoListItemsApiPathTE = flow(
  getSiteBaseApiPathTE,
  TE.map((siteBaseApiPath) => `${siteBaseApiPath}/lists/Workforce Photos/items`)
);

const applyFilterToGraphRequest =
  (filter: string | undefined) => (graphRequest: GraphRequest) =>
    filter ? graphRequest.filter(filter) : graphRequest;

const getPhotoListItemsByFilter = (
  filter: string
): TE.TaskEither<
  Error,
  Array<PersistedGraphListItem<PersistedPhotoListItem>>
> => {
  return pipe(
    getOboGraphClientIO(),
    TE.fromIO,
    TE.bindTo("graphClient"),
    TE.bind("photosApiPath", () => getWorkforcePhotoListItemsApiPathTE()),
    TE.map(({ graphClient, photosApiPath }) => graphClient.api(photosApiPath)),
    TE.map((baseGraphRequest) =>
      baseGraphRequest.expand(["fields", "driveItem"])
    ),
    TE.map(applyFilterToGraphRequest(filter)),
    TE.chainW(getFromGraphRequest),
    TE.map(
      (response) =>
        response.value as PersistedGraphListItem<PersistedPhotoListItem>[]
    )
  );
};

type PhotoIdentifiersSet = {
  photoId: string;
  driveId: string;
  driveItemId: string;
};

const photoGraphListItemToIdentifierSet = (
  photoGraphListItem: PersistedGraphListItem<PersistedPhotoListItem>
): PhotoIdentifiersSet => ({
  photoId: photoGraphListItem.fields.PhotoId,
  driveId: photoGraphListItem.driveItem.parentReference.driveId,
  driveItemId: photoGraphListItem.driveItem.id,
});

const getPhotoIdentifiersByFilter = (
  filter: string
): TE.TaskEither<Error, Array<PhotoIdentifiersSet>> => {
  return pipe(
    getPhotoListItemsByFilter(filter),
    TE.map(A.map(photoGraphListItemToIdentifierSet))
  );
};

const getDriveIdFromPhotoListItems = (
  items: NEA.NonEmptyArray<PersistedGraphListItem<PersistedPhotoListItem>>
) => NEA.head(items).driveItem.parentReference.driveId;

const determineFilterDriveItemIds =
  (listItemFilter: string | undefined) =>
  (listItems: PersistedGraphListItem<PersistedPhotoListItem>[]) => {
    if (!listItemFilter) {
      // If no filter was used to look up list items, do not use a filter when querying drive items.
      return undefined;
    }

    return listItems.map((li) => li.driveItem.id);
  };

const driveItemToUrlSet =
  (photoIdentifierSets: NEA.NonEmptyArray<PhotoIdentifiersSet>) =>
  (driveItem: DriveItem): E.Either<Error, ModelPhotoUrlSet> => {
    const photoIdentifiersSet = photoIdentifierSets.find(
      (photoIdentifierSet) => photoIdentifierSet.driveItemId === driveItem.id
    );
    if (!photoIdentifiersSet) {
      return E.left(new Error("Photo identifier set not found for drive item"));
    }

    return E.right({
      photoId: photoIdentifiersSet.photoId,
      downloadUrl: (driveItem as any)["@microsoft.graph.downloadUrl"],
      thumbnails: driveItem.thumbnails[0],
    });
  };

const driveItemsToUrlSets =
  (photoIdentifierSets: NEA.NonEmptyArray<PhotoIdentifiersSet>) =>
  (driveItems: DriveItem[]): E.Either<Error, readonly ModelPhotoUrlSet[]> => {
    return pipe(
      driveItems,
      A.map(driveItemToUrlSet(photoIdentifierSets)),
      E.sequenceArray
    );
  };

const getPhotoDriveItemUrlsByIdentifierSetBatch = (
  photoIdentifierSets: NEA.NonEmptyArray<PhotoIdentifiersSet>
) => {
  return pipe(
    getOboGraphClientIO(),
    IO.map((gc) => gc.api(`/drives/${photoIdentifierSets[0].driveId}/items`)),
    IO.map((baseGraphRequest) => baseGraphRequest.expand("thumbnails")),
    IO.map((baseGraphRequest) =>
      photoIdentifierSets.length > 0
        ? baseGraphRequest.filter(
            `id in (${photoIdentifierSets
              .map((identifierSet) => `'${identifierSet.driveItemId}'`)
              .join(",")})`
          )
        : baseGraphRequest
    ),
    TE.fromIO,
    TE.chainW(getFromGraphRequest),
    TE.map((response) => response.value as DriveItem[]),
    TE.chainEitherK(driveItemsToUrlSets(photoIdentifierSets))
  );
};

const getPhotoDriveItemUrlsByIdentifierSets = (
  photoIdentifierSets: NEA.NonEmptyArray<PhotoIdentifiersSet>
): TE.TaskEither<Error, readonly ModelPhotoUrlSet[]> => {
  return pipe(
    photoIdentifierSets,
    A.chunksOf(10),
    A.map(getPhotoDriveItemUrlsByIdentifierSetBatch),
    TE.sequenceArray,
    TE.map(ROA.flatten)
  );
};

const getPhotoDriveItemUrlsByListItemsFilter = (
  listItemsFilter: string | undefined
): TE.TaskEither<Error, readonly ModelPhotoUrlSet[]> => {
  return pipe(
    getPhotoIdentifiersByFilter(listItemsFilter),
    TE.chainOptionKW(() => "no-list-items-found" as const)(NEA.fromArray),
    TE.chainW(getPhotoDriveItemUrlsByIdentifierSets),
    TE.orElse((reason) =>
      reason === "no-list-items-found"
        ? TE.right([] as ModelPhotoUrlSet[])
        : TE.left(reason)
    )
  );
};

export const getPhotoUrls = () =>
  getPhotoDriveItemUrlsByListItemsFilter(undefined);

export const getPhotoUrlsByPhotoId = (photoId: string) =>
  pipe(
    getPhotoDriveItemUrlsByListItemsFilter(`fields/PhotoId eq '${photoId}'`),
    TE.chainOptionKW(() => "photo-not-found" as const)(RONEA.fromReadonlyArray)
  );

const getPhotoUrlsByPhotoIdBatch = (photoIds: string[]) =>
  pipe(
    photoIds.map((photoId) => `fields/PhotoId eq '${photoId}'`).join(" or "),
    getPhotoDriveItemUrlsByListItemsFilter
  );

export const photoIdFromEncodedPhotoId = (encodedPhotoId: string) => {
  const splitIds = encodedPhotoId.split(":");
  if (splitIds.length > 1) {
    return splitIds[1];
  } else {
    return splitIds[0];
  }
};

export const getPhotoUrlsByCombinedPhotoIds = (
  combinedPhotoIds: string[]
): TE.TaskEither<Error, readonly ModelPhotoUrlSet[]> =>
  pipe(
    combinedPhotoIds,
    A.map(photoIdFromEncodedPhotoId),
    A.chunksOf(10),
    A.map(getPhotoUrlsByPhotoIdBatch),
    TE.sequenceArray,
    TE.map(ROA.flatten)
  );
