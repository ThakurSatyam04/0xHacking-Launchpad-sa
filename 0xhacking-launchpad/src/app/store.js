import { configureStore } from "@reduxjs/toolkit";
import ProfileReducer from "../features/ProfileSlice";
import countDownSlice from "../features/CheckpointSlice"

export const store = configureStore({
  reducer: {
    profile: ProfileReducer,
    countdown: countDownSlice,
  },
});

export default store;