// brandSlice.ts
//
// This file defines the Redux slice for the Brands module, including state, reducers, and async thunks.
// It manages the state for fetching and storing all available brands from Firestore.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyBrand, BrandDnaResponse } from "@/domains/creation-studio/brand-dna/types/BrandDnaTypes";
import { brandDnaService } from "@/domains/creation-studio/brand-dna/service/brandDnaService";

/**
 * BrandState interface
 * Defines the shape of the brands state in the Redux store.
 */
interface BrandState {
  items: CompanyBrand[];
  brandDna: BrandDnaResponse | null; // Detailed brand DNA
  loading: boolean;
  dnaLoading: boolean; // Loading state specifically for DNA fetch
  error: string | null;
  selectedBrandId: string | null;
}

// Initial state for the brands slice
const initialState: BrandState = {
  items: [],
  brandDna: null,
  loading: false,
  dnaLoading: false,
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
      const response = await brandDnaService.getCompanies();
      return response.brands;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  },
);

/**
 * Async thunk to fetch Brand DNA details for a specific brand URL.
 */
export const fetchBrandDna = createAsyncThunk(
  "brands/fetchBrandDna",
  async (brandId: string, { rejectWithValue }) => {
    try {
      const response = await brandDnaService.getBrandDna(brandId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Brand DNA");
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
      // Clear DNA when selection changes (optional, but good for UI consistency)
      if (!action.payload) {
        state.brandDna = null;
      }
    },
    /** Clears the brands data and resets state */
    clearBrands: (state) => {
      state.items = [];
      state.brandDna = null;
      state.loading = false;
      state.dnaLoading = false;
      state.error = null;
      state.selectedBrandId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands (List)
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
      })

      // Fetch Brand DNA (Details)
      .addCase(fetchBrandDna.pending, (state) => {
        state.dnaLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandDna.fulfilled, (state, action) => {
        console.log("fetchBrandDna.fulfilled:", action.payload);
        state.dnaLoading = false;
        state.brandDna = action.payload;
        state.error = null;
      })
      .addCase(fetchBrandDna.rejected, (state, action) => {
        console.error(
          "fetchBrandDna.rejected:",
          action.payload || action.error,
        );
        state.dnaLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch Brand DNA";
      });
  },
});

export const { setSelectedBrandId, clearBrands } = brandSlice.actions;

export default brandSlice.reducer;
