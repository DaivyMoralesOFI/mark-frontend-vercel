// brandSlice.ts
//
// This file defines the Redux slice for the Brands module, including state, reducers, and async thunks.
// It manages the state for fetching and storing all available brands from Firestore.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrandResponse } from "../schemas/brand-schema";
import { getAllBrands } from "../services/brand-service";

/**
 * BrandState interface
 * Defines the shape of the brands state in the Redux store.
 */
interface BrandState {
  items: BrandResponse | null;
  loading: boolean;
  error: string | null;
  selectedBrandId: string | null;
}

// Initial state for the brands slice
const initialState: BrandState = {
  items: null,
  loading: false,
  error: null,
  selectedBrandId: null,
};

/**
 * Async thunk to fetch all brands from Firestore.
 * Calls the core brand service to retrieve the data.
 */
export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBrands();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  },
);

/**
 * brandSlice
 *
 * Redux slice for Brands, handling the list of brands and loading states.
 */
const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    /** Sets the currently selected brand ID */
    setSelectedBrandId: (state, action: PayloadAction<string | null>) => {
      state.selectedBrandId = action.payload;
    },
    /** Clears the brands data and resets state */
    clearBrands: (state) => {
      state.items = null;
      state.loading = false;
      state.error = null;
      state.selectedBrandId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        console.log("fetchAllBrands.fulfilled:", action.payload);
        state.loading = false;
        state.items = action.payload;
        state.error = null;

        // Auto-select the first brand if none is selected
        if (
          !state.selectedBrandId &&
          action.payload &&
          action.payload.length > 0
        ) {
          state.selectedBrandId = action.payload[0].uuid;
        }
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        console.error(
          "fetchAllBrands.rejected:",
          action.payload || action.error,
        );
        state.loading = false;
        state.error =
          (action.payload as string) || "An unexpected error occurred";
      });
  },
});

export const { setSelectedBrandId, clearBrands } = brandSlice.actions;

export default brandSlice.reducer;
