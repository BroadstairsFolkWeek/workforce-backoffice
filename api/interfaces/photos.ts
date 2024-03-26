import * as t from "io-ts";

const Thumbnail = t.partial({
  url: t.string,
});

const ThumbnailSet = t.partial({
  large: Thumbnail,
  medium: Thumbnail,
  small: Thumbnail,
  source: Thumbnail,
});

export const PhotoUrlSet = t.type({
  photoId: t.string,
  downloadUrl: t.string,
  thumbnails: ThumbnailSet,
});

export type PhotoUrlSet = t.TypeOf<typeof PhotoUrlSet>;
