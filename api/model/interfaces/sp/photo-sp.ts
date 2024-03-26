import { PersistedListItem } from "./sp-items";

interface PhotoListItem {
  PhotoId: string;
}
export type PersistedPhotoListItem = PersistedListItem & PhotoListItem;
