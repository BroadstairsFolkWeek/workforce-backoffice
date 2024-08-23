import { Effect } from "effect";
import { FormsRepository } from "../model/forms-repository";

export const getAllForms = () =>
  FormsRepository.pipe(
    Effect.andThen((formsRepo) => formsRepo.modelGetForms())
  );
