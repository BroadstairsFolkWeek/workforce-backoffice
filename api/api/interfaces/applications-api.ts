import { Number, Record, Static } from "runtypes";
import {
  ApplicationChangesRunType,
  ApplicationRunType,
} from "../../model/interfaces/application";

export const SaveApplicationChangesRequestRunType = Record({
  changedVersion: Number,
  changes: ApplicationChangesRunType,
});

export type SaveApplicationChangesRequest = Static<
  typeof SaveApplicationChangesRequestRunType
>;

export const SaveApplicationChangesResponseRunType = Record({
  application: ApplicationRunType,
});

export type SaveApplicationChangesResponse = Static<
  typeof SaveApplicationChangesResponseRunType
>;
