import { PersistedListItem } from "../sp/sp-items";

export interface PersistedGraphListItem<T extends PersistedListItem> {
  id: number;
  Created: string;
  Modified: string;
  fields: T;
}
