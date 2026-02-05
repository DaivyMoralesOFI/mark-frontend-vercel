// useBrands.ts
//
// This file defines a custom React hook for accessing Brands data from Redux.
// It provides convenient access to the brands list, loading state, and dispatch actions.

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store/rootReducer";
import { AppDispatch } from "@/core/store/store";
import {
  fetchAllBrands,
  setSelectedBrandId,
  clearBrands,
} from "../store/brandSlice";
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
  const { items, loading, error, selectedBrandId } = useSelector(
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
  const selectBrand = (id: string | null) => {
    dispatch(setSelectedBrandId(id));
  };

  /**
   * Memoized selected brand object
   */
  const selectedBrand = useMemo(() => {
    if (!items || !selectedBrandId) return null;
    return items.find((brand) => brand.uuid === selectedBrandId) || null;
  }, [items, selectedBrandId]);

  /**
   * Initial fetch if data is empty
   */
  useEffect(() => {
    if (items === null && !loading && !error) {
      dispatch(fetchAllBrands());
    }
  }, [items, loading, error, dispatch]);

  return {
    brands: items,
    loading,
    error,
    selectedBrandId,
    selectedBrand,
    refreshBrands,
    selectBrand,
    clear: () => dispatch(clearBrands()),
  };
};
