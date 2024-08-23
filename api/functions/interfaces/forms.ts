import { Schema as S } from "@effect/schema";
import { Form } from "../../model/interfaces/form";

export const ApiForm = Form;
export interface ApiForm extends S.Schema.Type<typeof ApiForm> {}

export const GetFormsResponse = S.Struct({
  data: S.Array(ApiForm),
});

export interface GetFormsResponse
  extends S.Schema.Type<typeof GetFormsResponse> {}
