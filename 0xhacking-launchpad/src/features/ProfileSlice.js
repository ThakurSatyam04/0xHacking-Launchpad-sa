import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/auth`, {
        withCredentials: true,
      });
      return response.data; // API response contains the user and team data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/user/profile`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Slice
const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    userData: null, // For user-specific details
    profileData: null,
    teamData: [],
    profileStatus: false,
    location: {
      state: null,
      city: null,
      country: null,
    }, 
    checkpointOne: {
      primaryIdea: "",
      role: "",
      domainsWorkingOn: [], 
      technologiesUsed: "",
      file: "",
    },
    checkpointTwo: {
      projectStage: "",
      teamCollaboration: "",
      mentorshipSupport: "",
      timeline: "",
      resources: "",
    },
    checkpointThree: {
      progressUpdate: [],
      technicalChallenges: [],
    },
    checkpointFour: {
      featureCompletion: "", 
      integrationTesting: "", 
      userExperience: "", 
      qualityAssurance: "", 
      presentationPreparation: "", 
      teamReadiness: "",
    },
    checkpointFive: {
      skillsInProject: [],
      otherSkillsInProject: "", 
      skillsToLearn: [], 
      otherSkillsToLearn: "", 
      neededTools: [],
      otherNeededTools: "", 
      challengesFaced: [], 
      otherChallengesFaced: "", 
      additionalHelp: [], 
      otherAdditionalHelp: "", 
      createdAt: null, 
    },    
    checkpointsStatus: [], 
    loading: false,
    error: null,
    submitStatus: "init",
    checkpointsCompleted: 0,
  },
  reducers: {
    resetSubmitStatus(state) {
      state.submitStatus = "init";
      state.error = null;
    },
    setProfileData: (state, action) => {
      state.userProfile = action.payload;
    },
    setFileUploadStatus: (state, action) => {
      state.fileUploadStatus = action.payload;
    },
    setCheckpointsCompleted: (state, action) => {
      state.checkpointsCompleted = action.payload;
    },
    setCheckpointStatus: (state, action) => {
      state.checkpointsStatus[action.payload.index] = action.payload.status;
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
        const { userData, user, teamData } = action.payload;
        state.userData = userData;
        state.profileData = user.profile || null;
        state.teamData = teamData || [];
        state.profileStatus = user.profileStatus || false;
        const { state: userState, city, country } = user.location || {};
        state.location = {
          state: userState || null,
          city: city || null,
          country: country || null,
        };
        // Checkpoint One
        const {
          state: primaryIdea,
          role,
          domainsWorkingOn,
          technologiesUsed,
          file,
        } = user.checkpointone || {};
        state.checkpointOne = {
          primaryIdea: primaryIdea || "",
          role: role || "",
          domainsWorkingOn: domainsWorkingOn || [],
          technologiesUsed: technologiesUsed || "",
          file: file || "",
        };
        const {
          projectStage,
          teamCollaboration,
          mentorshipSupport,
          timeline,
          resources,
        } = user.checkpointtwo || {};
        state.checkpointTwo = {
          projectStage: projectStage || "",
          teamCollaboration: teamCollaboration || "",
          mentorshipSupport: mentorshipSupport || "",
          timeline: timeline || "",
          resources: resources || "",
        };

        const { progressUpdate, technicalChallenges } =
          user.checkpointthree || {};
        state.checkpointThree = {
          progressUpdate: progressUpdate?.map((item) => item.value) || [],
          technicalChallenges:
            technicalChallenges?.map((item) => item.value) || [],
        };
        const {
          featureCompletion,
          integrationTesting,
          userExperience,
          qualityAssurance,
          presentationPreparation,
          teamReadiness,
        } = user.checkpointfour || {};
        
        state.checkpointFour = {
          featureCompletion: featureCompletion || "",
          integrationTesting: integrationTesting || "",
          userExperience: userExperience || "",
          qualityAssurance: qualityAssurance || "",
          presentationPreparation: presentationPreparation || "",
          teamReadiness: teamReadiness || "",
        };
        const {
          skillsInProject,
          otherSkillsInProject,
          skillsToLearn,
          otherSkillsToLearn,
          neededTools,
          otherNeededTools,
          challengesFaced,
          otherChallengesFaced,
          additionalHelp,
          otherAdditionalHelp,
          createdAt,
        } = user.checkpointfive || {};
        
        state.checkpointFive = {
          skillsInProject: skillsInProject || [],
          otherSkillsInProject: otherSkillsInProject || "",
          skillsToLearn: skillsToLearn || [],
          otherSkillsToLearn: otherSkillsToLearn || "",
          neededTools: neededTools || [],
          otherNeededTools: otherNeededTools || "",
          challengesFaced: challengesFaced || [],
          otherChallengesFaced: otherChallengesFaced || "",
          additionalHelp: additionalHelp || [],
          otherAdditionalHelp: otherAdditionalHelp || "",
        };
      
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
export const {
  setProfileData,
  setCheckpointStatus,
  setCheckpointsCompleted,
  setFileUploadStatus,
} = ProfileSlice.actions;
export default ProfileSlice.reducer;
