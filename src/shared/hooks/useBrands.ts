// useBrands.ts
//
// This file defines a custom React hook for accessing Brands data from Redux.
// It provides convenient access to the brands list, loading state, and dispatch actions.

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store/rootReducer";
import { AppDispatch } from "@/core/store/store";
import { fetchAllBrands, fetchBrandDna, setSelectedBrandUrl, clearBrands } from "@/core/store/brandSlice";
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
  const { items, brandDna, loading, dnaLoading, error, selectedBrandUrl } = useSelector(
    (state: RootState) => state.brands,
  );

  /**
   * Fetches all brands from the service
   */
  const refreshBrands = () => {
    dispatch(fetchAllBrands());
  };

  /**
   * Sets the active brand by URL
   */
  const selectBrand = (url: string | null) => {
    console.log("useBrands - selectBrand called with url:", url);
    dispatch(setSelectedBrandUrl(url));
  };

  /**
   * Memoized selected brand object (from list)
   */
  const selectedBrand = useMemo(() => {
    if (!items || !selectedBrandUrl) return null;
    return items.find((brand) => brand.url === selectedBrandUrl) || null;
  }, [items, selectedBrandUrl]);

  /**
   * Initial fetch if data is empty
   */
  useEffect(() => {
    if ((!items || items.length === 0) && !loading && !error) {
      dispatch(fetchAllBrands());
    }
  }, [items, loading, error, dispatch]);

  /**
   * Fetch Brand DNA when selectedBrandUrl changes
   */
  useEffect(() => {
    if (selectedBrandUrl && !brandDna && !dnaLoading) {
      // Only fetch if we don't have it (or force refresh logic could be added)
      // Actually, we should probably fetch whenever selection changes to be safe,
      // but brandSlice clears brandDna on selection change, so !brandDna check is valid.
      dispatch(fetchBrandDna(selectedBrandUrl));
    }
  }, [selectedBrandUrl, brandDna, dnaLoading, dispatch]);

  return {
    brands: items,
    brandDna, // Detailed DNA
    loading,
    dnaLoading,
    error,
    selectedBrandUrl,
    selectedBrand, // List item
    refreshBrands,
    selectBrand,
    clear: () => dispatch(clearBrands()),
  };
};
