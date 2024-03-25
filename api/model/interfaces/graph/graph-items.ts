import { PersistedListItem } from "../sp/sp-items";

export interface PersistedGraphListItem<T extends PersistedListItem> {
  id: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  fields: T;
}
