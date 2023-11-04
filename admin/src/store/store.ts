import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
