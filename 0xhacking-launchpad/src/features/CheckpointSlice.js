import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  checkpointsStatus: [false, false, false, false, false], // Track the status of each checkpoint
  checkPointsTimes: [
    new Date().getTime() + 1000,  // 10 seconds from now
    new Date().getTime() + 1000 * 10,  // 30 seconds from now
    new Date().getTime() + 1000 * 20,  // 50 seconds from now
    new Date().getTime() + 1000 * 30,  // 70 seconds from now
    new Date().getTime() + 1000 * 40,  // 90 seconds from now
  ], // Store the times for each checkpoint
  enabledCheckpoints: 0, // Track the number of enabled checkpoints
  blinkingCheckpoint: 0, // Track the checkpoint that needs to blink
  loading: false,
  error: null,
};

// Thunks for async actions
export const fetchCheckpointStatus = createAsyncThunk(
  "countdown/fetchCheckpointStatus",
  async () => {
    const response = await axios.get("/api/user/auth", { withCredentials: true });
    return response.data.user.checkpointsstatus;
  }
);

export const fetchCheckPointsTime = createAsyncThunk(
  "countdown/fetchCheckPointsTime",
  async () => {
    const response = await axios.get("/api/user/start-time");
    return [
      response.data.cp1Time,
      response.data.cp2Time,
      response.data.cp3Time,
      response.data.cp4Time,
      response.data.cp5Time,
    ];
  }
);

export const countDownSlice = createSlice({
  name: "countdown",
  initialState,
  reducers: {
    setEnabledCheckpoints: (state, action) => {
      state.enabledCheckpoints = action.payload;
    },
    setBlinkingCheckpoint: (state, action) => {
      state.blinkingCheckpoint = action.payload;
    },
    resetState: (state) => {
      state.checkpointsStatus = [false, false, false, false, false];
      state.checkPointsTimes = [];
      state.enabledCheckpoints = 0;
      state.blinkingCheckpoint = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckpointStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCheckpointStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.checkpointsStatus = action.payload;
      })
      .addCase(fetchCheckpointStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    //   .addCase(fetchCheckPointsTime.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(fetchCheckPointsTime.fulfilled, (state, action) => {
    //     state.loading = false;
    //     // Filter out null times and set the state for times
    //     const validTimes = action.payload
    //       .map((time) => (time ? new Date(time).getTime() : null))
    //       .filter((time) => time !== null);
    //     state.checkPointsTimes = validTimes;
    //   })
    //   .addCase(fetchCheckPointsTime.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
  },
});

// Reducers
export const { setEnabledCheckpoints, setBlinkingCheckpoint, resetState } = countDownSlice.actions;

// Selectors
export const selectCheckpointsStatus = (state) => state.countdown.checkpointsStatus;
export const selectCheckPointsTimes = (state) => state.countdown.checkPointsTimes;
export const selectEnabledCheckpoints = (state) => state.countdown.enabledCheckpoints;
export const selectBlinkingCheckpoint = (state) => state.countdown.blinkingCheckpoint;
export const selectCountDownLoading = (state) => state.countdown.loading;
export const selectCountDownError = (state) => state.countdown.error;

export default countDownSlice.reducer;
