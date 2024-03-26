import { ListItem } from "@microsoft/microsoft-graph-types";
import { PersistedListItem } from "../sp/sp-items";

export interface PersistedGraphListItem<T extends PersistedListItem>
  extends Omit<ListItem, "fields"> {
  fields: T;
}
