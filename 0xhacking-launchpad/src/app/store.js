import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../features/ProfileSlice";

export const store = configureStore({
  reducer: {
    profile: ProfileReducer,
  },
});

export default store;