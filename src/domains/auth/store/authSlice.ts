// authSlice.ts
//
// This file defines the Redux slice for managing authentication state, user data, and async actions for the auth module.
// It handles login, registration, token management, loading and error states, and user session logic.

import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { authService, AuthResponse, User, LoginCredentials, RegisterData } from '../services/authService';
import { ApiError, NetworkError } from '@/core/api/apiErrors';
import { RootState } from '@/core/store/store';

/**
 * AuthState
 * Redux state shape for the authentication slice.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, unknown>;
  } | null;
}

// Initial state for the authentication slice
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null
};

// Helper to handle API and network errors
const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details
    };
  } else if (error instanceof NetworkError) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message
    };
  } else {
    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error 
        ? error.message 
        : 'An unknown error occurred. Please try again.'
    };
  }
};

// Helper to parse field-specific validation errors
const parseValidationErrors = (error: ApiError) => {
  if (error.code === 'VALIDATION_ERROR' && error.details) {
    const fieldErrors = error.details as Record<string, string[]>;
    const firstField = Object.keys(fieldErrors)[0];
    if (firstField && fieldErrors[firstField] && fieldErrors[firstField].length > 0) {
      return {
        code: error.code,
        message: fieldErrors[firstField][0],
        field: firstField,
        details: error.details
      };
    }
  }
  return {
    code: error.code,
    message: error.message,
    details: error.details
  };
};

/**
 * Async thunk for logging in a user.
 * Handles API errors and stores tokens in localStorage.
 */
export const loginUser = createAsyncThunk<
  AuthResponse, 
  LoginCredentials,
  { rejectValue: ReturnType<typeof handleApiError> }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Store tokens in localStorage
      localStorage.setItem('token', response.tokens.token);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      return response;
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VALIDATION_ERROR') {
        return rejectWithValue(parseValidationErrors(error));
      }
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Async thunk for registering a new user.
 * Handles API errors and stores tokens in localStorage.
 */
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: ReturnType<typeof handleApiError> }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      // Store tokens in localStorage
      localStorage.setItem('token', response.tokens.token);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      return response;
    } catch (error) {
      if (error instanceof ApiError && error.code === 'VALIDATION_ERROR') {
        return rejectWithValue(parseValidationErrors(error));
      }
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * authSlice
 *
 * Redux slice for authentication, including reducers for logout and error handling, and extraReducers for async thunks.
 * Handles user session, loading, error, and token management.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logs out the user and clears tokens from state and localStorage.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    /**
     * Clears the error state.
     */
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Handle fulfilled login and registration
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.token;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.tokens.token;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
      });

    // Handle loading state for pending actions
    builder.addMatcher(
      isAnyOf(
        loginUser.pending,
        registerUser.pending
      ),
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    
    // Handle errors for rejected actions
    builder.addMatcher(
      isAnyOf(
        loginUser.rejected,
        registerUser.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthState['error'];
      }
    );
  },
});

// Export synchronous actions
export const { logout, clearError } = authSlice.actions;

// Selectors for authentication state
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthToken = (state: RootState) => state.auth.token;

// Export the reducer
export default authSlice.reducer;