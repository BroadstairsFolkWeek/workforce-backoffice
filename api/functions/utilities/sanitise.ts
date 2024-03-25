import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { Errors, Validation } from "io-ts";

type ValidationScope = "input" | "output";

const VALIDATION_ERROR_TYPE_VAL =
  "validation-error-f57d1add-4d30-4baf-801c-a11693e59c44";

type ApiValidationError = {
  type: typeof VALIDATION_ERROR_TYPE_VAL;
  scope: ValidationScope;
  errors: Errors;
};

export type ApiInputValidationError = ApiValidationError & {
  scope: "input";
};

const _wrapErrorWithApiInputValidationError = (
  errors: Errors
): ApiInputValidationError => ({
  type: VALIDATION_ERROR_TYPE_VAL,
  scope: "input",
  errors,
});

export function isApiInputValidationError(
  obj: any
): obj is ApiInputValidationError {
  return obj?.type === VALIDATION_ERROR_TYPE_VAL && obj.scope === "input";
}

export const wrapInputDecoder = <A>(decoderFn: (obj: any) => Validation<A>) =>
  flow(
    decoderFn,
    E.mapLeft((error) => _wrapErrorWithApiInputValidationError(error))
  );
