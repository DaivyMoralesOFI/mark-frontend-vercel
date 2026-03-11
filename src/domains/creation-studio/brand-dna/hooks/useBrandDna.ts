// useBrandDna.ts
//
// This file defines a custom React hook for accessing Brand DNA data.
// It's a wrapper around useBrands for backward compatibility with the Brand DNA module.

import { useBrands } from "@/shared/hooks/useBrands";
import { CompanyBrand } from "@/domains/creation-studio/brand-dna/types/BrandDnaTypes";

/**
 * useBrandDna
 *
 * Custom hook that provides access to Brand DNA state and actions.
 * Uses the core useBrands hook for brand selection and data.
 */
export const useBrandDna = () => {
  const { brandDna, selectBrand, loading, dnaLoading, brands } = useBrands();

  return {
    // Map brandDna (detailed) to selectedCompany for compatibility
    // If brandDna is null, it's undefined/null
    selectedCompany: brandDna,
    selectCompany: (brand: CompanyBrand) => {
      selectBrand(brand.url);
    },
    data: brandDna,
    loading: loading || dnaLoading,
    brands,
  };
};
