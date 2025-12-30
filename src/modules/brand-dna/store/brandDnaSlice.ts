// brandDnaSlice.ts
//
// This file defines the Redux slice for the Brand DNA module, including state, reducers, and async thunks.
// It manages all state and side effects for fetching and storing Brand DNA data from the backend.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrandDnaState, Company } from "../types/brandDnaTypes";
import { brandDnaService } from "../service/brandDnaService";

// Initial state for the Brand DNA slice
const initialState: BrandDnaState = {
  data: null,
  loading: false,
  error: null,
  selectedCompany: null,
};

/**
 * Async thunk to fetch Brand DNA data from the backend
 * Calls the backend API with optional company URL and returns the Brand DNA response
 */
export const fetchBrandDna = createAsyncThunk(
  'brandDna/fetchBrandDna',
  async (url?: string) => {
    const response = await brandDnaService.getBrandDna(url);
    return response;
  }
);

/**
 * brandDnaSlice
 *
 * Redux slice for Brand DNA, including reducers for state management and extraReducers for async thunks.
 * Handles loading, error states, and storing the fetched Brand DNA data.
 */
const brandDnaSlice = createSlice({
  name: 'brandDna',
  initialState,
  reducers: {
    /** Clear the Brand DNA data */
    clearBrandDna: (state) => {
      state.data = null;
      state.error = null;
      state.selectedCompany = null;
    },
    /** Set the selected company */
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    /** Set an error message */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brand DNA
      .addCase(fetchBrandDna.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandDna.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchBrandDna.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Brand DNA data';
      });
  },
});

export const {
  clearBrandDna,
  setSelectedCompany,
  setError,
} = brandDnaSlice.actions;

export default brandDnaSlice.reducer;

