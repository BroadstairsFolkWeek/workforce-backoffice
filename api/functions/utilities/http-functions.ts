import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import { pipe } from "fp-ts/lib/function";
import { HttpRequest } from "@azure/functions";

const MISSING_PARAM_ERROR_TYPE_VAL =
  "missing-param-error-672e1ea8-1e7c-4f71-8f9b-8d290a4288e8";

export interface MissingParamError {
  type: typeof MISSING_PARAM_ERROR_TYPE_VAL;
  paramName: string;
}

export function isMissingParamError(obj: any): obj is MissingParamError {
  return obj?.type === MISSING_PARAM_ERROR_TYPE_VAL;
}

const wrapMissingParamError = (name: string): MissingParamError => ({
  type: MISSING_PARAM_ERROR_TYPE_VAL,
  paramName: name,
});

export const getRequestParam =
  (paramName: string) =>
  (req: HttpRequest): E.Either<MissingParamError, string> => {
    return pipe(
      req.params[paramName],
      E.fromNullable(wrapMissingParamError(paramName))
    );
  };

export const getJsonBody = (req: HttpRequest): T.Task<any> => {
  return T.of(req.json());
};
