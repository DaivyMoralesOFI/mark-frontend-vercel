// useBrands.ts
//
// This file defines a custom React hook for accessing Brands data from Redux.
// It provides convenient access to the brands list, loading state, and dispatch actions.

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store/rootReducer";
import { AppDispatch } from "@/core/store/store";
import {
  clearBrands,
  fetchAllBrands,
  fetchBrandDna,
  setSelectedBrandId,
} from "@/core/store/brandSlice";
import { useEffect, useMemo } from "react";

/**
 * useBrands
 *
 * Custom hook that provides access to Brands state and actions.
 * Automatically fetches brands if they are not already loaded.
 *
 * @returns {Object} - Brands state, actions and selected brand data
 */
export const useBrands = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, brandDna, loading, dnaLoading, error, selectedBrandId } = useSelector(
    (state: RootState) => state.brands,
  );

  /**
   * Fetches all brands from the service
   */
  const refreshBrands = () => {
    dispatch(fetchAllBrands());
  };

  /**
   * Sets the active brand by ID
   */
  const selectBrand = (brandId: string | null) => {
    dispatch(setSelectedBrandId(brandId));
  };

  /**
   * Memoized selected brand object (from list)
   */
  const selectedBrand = useMemo(() => {
    if (!items || !selectedBrandId) return null;
    return items.find((brand) => brand.uuid === selectedBrandId) || null;
  }, [items, selectedBrandId]);

  /**
   * Initial fetch if data is empty
   */
  useEffect(() => {
    if ((!items || items.length === 0) && !loading && !error) {
      dispatch(fetchAllBrands());
    }
  }, [items, loading, error, dispatch]);

  /**
   * Fetch Brand DNA when selectedBrandId changes
   */
  useEffect(() => {
    if (selectedBrandId && !brandDna && !dnaLoading) {
      dispatch(fetchBrandDna(selectedBrandId));
    }
  }, [selectedBrandId, brandDna, dnaLoading, dispatch]);

  return {
    brands: items,
    brandDna, // Detailed DNA
    loading,
    dnaLoading,
    error,
    selectedBrandId,
    selectedBrand, // List item
    refreshBrands,
    selectBrand,
    clear: () => dispatch(clearBrands()),
  };
};
