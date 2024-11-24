import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/auth`, { withCredentials: true });
      return response.data;
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
    profileData: null,
    userData: null,
    profileStatus: false,
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
        state.userData = action.payload.data.userData;
        state.profileData = action.payload.data.user.profile;
        state.profileStatus = action.payload.data.user.profileStatus;
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
      .addCase(updateUserProfile.fulfilled, (state, action) => {
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
