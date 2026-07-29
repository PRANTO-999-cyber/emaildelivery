import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true, // True until initial local token rehydration / session check completes
};

/**
 * Authentication Slice
 * Manages user credentials, token persistence, and authentication status.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Stores the user credentials and JWT token upon successful login or token refresh.
     */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },

    /**
     * Resets authentication state upon user logout or token expiration.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },

    /**
     * Partially updates user profile properties (e.g., avatar, name, preferences).
     */
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    /**
     * Marks initial authentication state rehydration as finished.
     */
    setAuthInitialized: (state) => {
      state.isInitializing = false;
    },
  },
});

// Export synchronous actions
export const { setCredentials, logout, updateUserProfile, setAuthInitialized } =
  authSlice.actions;

// Selectors for easy component subscription
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthInitializing = (state) => state.auth.isInitializing;

// Default export reducer for store integration
export default authSlice.reducer;
