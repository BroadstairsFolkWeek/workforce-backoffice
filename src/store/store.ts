import { configureStore } from "@reduxjs/toolkit";
import formsReducer from "./forms/forms-slice";

const store = configureStore({
  reducer: {
    forms: formsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch;
export default store;
