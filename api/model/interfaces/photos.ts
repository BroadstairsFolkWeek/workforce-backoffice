import { String, Record, Static, Optional } from "runtypes";

const ThumbnailRunType = Record({
  url: Optional(String),
});

const ThumbnailSetRunType = Record({
  large: Optional(ThumbnailRunType),
  medium: Optional(ThumbnailRunType),
  small: Optional(ThumbnailRunType),
  source: Optional(ThumbnailRunType),
});

export const ModelPhotoUrlSetRunType = Record({
  photoId: String,
  downloadUrl: String,
  thumbnails: ThumbnailSetRunType,
});

export type ModelPhotoUrlSet = Static<typeof ModelPhotoUrlSetRunType>;
