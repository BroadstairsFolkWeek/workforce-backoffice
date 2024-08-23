import { Effect, Context } from "effect";
import { Form } from "./interfaces/form";

export class FormNotFound {
  readonly _tag = "FormNotFound";
}

export class TemplateNotFound {
  readonly _tag = "TemplateNotFound";
}

export class UnprocessableFormAction {
  readonly _tag = "UnprocessableFormAction";
}

export class FormsRepository extends Context.Tag("FormsRepository")<
  FormsRepository,
  {
    readonly modelGetForms: () => Effect.Effect<readonly Form[]>;
  }
>() {}
