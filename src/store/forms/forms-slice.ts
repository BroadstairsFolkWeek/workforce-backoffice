import { Effect } from "effect";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import { apiGetForms } from "../../api/forms-api";
import { RootState } from "../store";
import { Form } from "../../interfaces/form";

export type FormsLoadingStatus =
  | "not-authenticated"
  | "loading"
  | "loaded"
  | "error";

interface FormsState {
  forms: readonly Form[];
  formsLoadingStatus: FormsLoadingStatus;
  formsLoadingError?: string;
}

const initialState: FormsState = {
  forms: [],
  formsLoadingStatus: "loaded",
};

interface FetchFormsFullfilledPayload {
  forms: readonly Form[];
  formsLoadingStatus: FormsLoadingStatus;
  formsLoadingError: string;
}

export const fetchForms = createAsyncThunk<FetchFormsFullfilledPayload>(
  "forms/fetchForms",
  async () => {
    const program = apiGetForms()
      .pipe(
        Effect.andThen((formsFetchResult) => ({
          forms: formsFetchResult.data,
          formsLoadingStatus: "loaded" as const,
          formsLoadingError: "",
        }))
      )
      .pipe(
        Effect.catchTags({
          NotAuthenticated: () =>
            Effect.succeed({
              forms: [],
              formsLoadingStatus: "not-authenticated" as const,
              formsLoadingError: "",
            }),
          ParseError: (error) => Effect.die(error),
          RequestError: (error) => Effect.die(error),
          ResponseError: (error) => Effect.die(error),
        })
      );

    return Effect.runPromise(program);
  }
);

export const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForms.pending, (state) => {
      state.formsLoadingStatus = "loading";
    });
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.forms = castDraft(action.payload.forms);
      state.formsLoadingStatus = action.payload.formsLoadingStatus;
      state.formsLoadingError = action.payload.formsLoadingError;
    });
    builder.addCase(fetchForms.rejected, (state, action) => {
      state.formsLoadingStatus = "error";
      state.formsLoadingError = action.error.message ?? "Unknown error";
    });
  },
});

export default formsSlice.reducer;

export const selectFormsLoadingStatus = (state: RootState) =>
  state.forms.formsLoadingStatus;
export const selectForms = (state: RootState) => state.forms.forms;
