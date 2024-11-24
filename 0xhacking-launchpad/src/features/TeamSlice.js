import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch team data
export const fetchTeam = createAsyncThunk("team/fetchTeam", async (teamname, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/get-team/${teamname}`);
    return response.data; // Assuming the API response includes team details
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching team details");
  }
});

const teamSlice = createSlice({
  name: "team",
  initialState: {
    team: null, // Holds the fetched team details
    loading: false,
    error: null,
  },
  reducers: {
    clearTeam: (state) => {
      state.team = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
