import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  checkpointsStatus: [false, false, false, false, false], 
  checkPointsTimes: [], // Store the times for each checkpoint
  // Try to add the time to check if it's working or not
  checkPointsTimes: [
    new Date().getTime() + 1000 , // 10 seconds from now
    new Date().getTime() + 1000 * 5,  // 30 seconds from now
    new Date().getTime() + 1000 * 10,  // 50 seconds from now
    new Date().getTime() + 1000 * 15,  // 70 seconds from now
    new Date().getTime() + 1000 * 20,  // 90 seconds from now
  ], // Store the times for each checkpoint
  duration: null, 
  startTime: null, 
  enabledCheckpoints: 0, 
  blinkingCheckpoint: 0,
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
    const { cp1Time, cp2Time, cp3Time, cp4Time, cp5Time, duration, startTime } = response.data;

    return {
      checkPointsTimes: [cp1Time, cp2Time, cp3Time, cp4Time, cp5Time],
      duration,
      startTime
    };
  }
);

export const countDownSlice = createSlice({
  name: "countdown",
  initialState,
  reducers: {
    // Reducers to update specific parts of the state
    updateCheckpointStatus: (state, action) => {
      const { index, status } = action.payload;
      state.checkpointsStatus[index] = status;
    },
    updateCheckpointTime: (state, action) => {
      const { index, time } = action.payload;
      state.checkPointsTimes[index] = time;
    },
    updateDuration: (state, action) => {
      state.duration = action.payload;
    },
    updateStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEnabledCheckpoints: (state, action) => {
      state.enabledCheckpoints = action.payload;
    },
    setBlinkingCheckpoint: (state, action) => {
      state.blinkingCheckpoint = action.payload;
    },
    resetState: (state) => {
      state.checkpointsStatus = [false, false, false, false, false];
      state.checkPointsTimes = [];
      state.duration = null;
      state.startTime = null;
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
        state.checkpointsStatus = action.payload; // Set the status for each checkpoint
      })
      .addCase(fetchCheckpointStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCheckPointsTime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCheckPointsTime.fulfilled, (state, action) => {
        state.loading = false;
        const { checkPointsTimes, duration, startTime } = action.payload;
        
        // Set the state for the times, duration, and start time
        // state.checkPointsTimes = checkPointsTimes.map((time) => new Date(time).getTime());
        state.duration = duration;
        state.startTime = new Date(startTime).getTime();
      })
      .addCase(fetchCheckPointsTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Reducers
export const {
  updateCheckpointStatus,
  updateCheckpointTime,
  updateDuration,
  updateStartTime,
  setEnabledCheckpoints,
  setBlinkingCheckpoint,
  resetState
} = countDownSlice.actions;

// Selectors
export const selectCheckpointsStatus = (state) => state.countdown.checkpointsStatus;
export const selectCheckPointsTimes = (state) => state.countdown.checkPointsTimes;
export const selectDuration = (state) => state.countdown.duration;
export const selectStartTime = (state) => state.countdown.startTime;
export const selectEnabledCheckpoints = (state) => state.countdown.enabledCheckpoints;
export const selectBlinkingCheckpoint = (state) => state.countdown.blinkingCheckpoint;
export const selectCountDownLoading = (state) => state.countdown.loading;
export const selectCountDownError = (state) => state.countdown.error;

export default countDownSlice.reducer;
