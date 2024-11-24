import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/auth`, { withCredentials: true });
      return response.data; // API response contains the user and team data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/user/profile`, formData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

// Slice
const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    userData: null, // For user-specific details
    profileData: null, // For profile details like bio and URLs
    teamData: [], // For team-related data
    profileStatus: false,
    location: {
      state: null,
      city: null,
      country: null,
    }, // Structured location data
    checkpointOne: null, // For checkpoint one data
    checkpointTwo: null, // For checkpoint one data
    checkpointThree: null, // For checkpoint one data
    checkpointFour: null, // For checkpoint one data
    checkpointFive: null, // For checkpoint one data
    checkpointsStatus: [], // Status of checkpoints (boolean array)
    loading: false,
    error: null,
    submitStatus: "init",
  },
  reducers: {
    resetSubmitStatus(state) {
      state.submitStatus = "init";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        // Parsing the API response
        const { userData, user, teamData } = action.payload;

        // User-specific data
        state.userData = userData;

        // User profile information
        state.profileData = user.profile || null;

        // Team details
        state.teamData = teamData || [];

        // Other details
        state.profileStatus = user.profileStatus || false;
        // Location details (structured parsing)
        const { state: userState, city, country } = user.location || {};
        state.location = {
          state: userState || null,
          city: city || null,
          country: country || null,
        };
        state.checkpointOne = user.checkpointone || null;
        state.checkpointTwo = user.checkpointtwo || null;
        state.checkpointThree = user.checkpointthree || null;
        state.checkpointFour = user.checkpointfour || null;
        state.checkpointFive = user.checkpointfive || null;

        // Checkpoints status array
        state.checkpointsStatus = user.checkpointsstatus || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitStatus = "pending";
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.submitStatus = "success";
        state.profileStatus = true; // Assume profile status is updated on success
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitStatus = "error";
      });
  },
});

export const { resetSubmitStatus } = ProfileSlice.actions;
export default ProfileSlice.reducer;
