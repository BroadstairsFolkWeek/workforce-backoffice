import { Effect } from "effect";
import { Schema as S } from "@effect/schema";

import { apiGetJson } from "./api";
import { GetFormsResponse } from "./interfaces/forms-api";

export const apiGetForms = () =>
  apiGetJson("forms").pipe(Effect.andThen(S.decodeUnknown(GetFormsResponse)));
