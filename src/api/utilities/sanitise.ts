import * as E from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { Errors, Validation } from "io-ts";

const VALIDATION_ERROR_TYPE_VAL =
  "validation-error-f57d1add-4d30-4baf-801c-a11693e59c44";

export type ApiValidationError = {
  type: typeof VALIDATION_ERROR_TYPE_VAL;
  errors: Errors;
};

const _wrapErrorWithApiValidationError = (
  errors: Errors
): ApiValidationError => ({
  type: VALIDATION_ERROR_TYPE_VAL,
  errors,
});

export function isApiValidationError(obj: any): obj is ApiValidationError {
  return obj?.type === VALIDATION_ERROR_TYPE_VAL && obj.scope === "input";
}

export const wrapInputDecoder = <A>(decoderFn: (obj: any) => Validation<A>) =>
  flow(
    decoderFn,
    E.mapLeft((error) => _wrapErrorWithApiValidationError(error))
  );
