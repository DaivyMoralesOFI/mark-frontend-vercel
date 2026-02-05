// useBrandDna.ts
//
// This file defines a custom React hook for accessing Brand DNA data.
// It's a wrapper around useBrands for backward compatibility with the Brand DNA module.

import { useBrands } from "@/core/hooks/useBrands";
import { Brand } from "@/core/schemas/brand-schema";

/**
 * useBrandDna
 *
 * Custom hook that provides access to Brand DNA state and actions.
 * Uses the core useBrands hook for brand selection and data.
 */
export const useBrandDna = () => {
  const { selectedBrand, selectBrand, loading, brands } = useBrands();

  return {
    selectedCompany: selectedBrand,
    selectCompany: (brand: Brand) => {
      selectBrand(brand.uuid);
    },
    data: selectedBrand,
    loading,
    brands,
  };
};
