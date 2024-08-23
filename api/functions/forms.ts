import { Effect } from "effect";
import { Schema as S } from "@effect/schema";
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getAllForms } from "../forms/forms";
import { runApiEffect } from "./utilities/api-effect-runner";
import { GetFormsResponse } from "./interfaces/forms";

export const httpGetForms = async function (
  _req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const program = Effect.logTrace("forms: entry")
    .pipe(Effect.andThen(getAllForms))
    .pipe(
      Effect.tap((forms) =>
        Effect.logTrace(`Retrieved ${forms.length} forms`, forms)
      ),
      Effect.andThen((forms) => ({ data: forms })),
      Effect.andThen(S.encode(GetFormsResponse)),
      Effect.andThen((body) => ({ status: 200, jsonBody: body }))
    )
    .pipe(
      Effect.catchTags({
        ParseError: (e) => Effect.succeed({ status: 500 }),
      })
    );

  return runApiEffect(program, context);
};

export default httpGetForms;
