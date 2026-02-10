// useCompanies.ts
//
// This file defines a custom React hook for fetching and accessing companies data from the public JSON file.
// It provides convenient access to companies state and handles loading/error states.

import { useState, useEffect } from 'react';
import { brandDnaService } from '../service/brandDnaService';
import { Company, CompanyBrand } from '../types/brandDnaTypes';
import { buildLogoUrl } from '../utils/companyUtils';

/**
 * useCompanies
 *
 * Custom hook that fetches companies data from the public JSON file.
 * Transforms the data to match the Company interface expected by components.
 *
 * @returns {Object} - Companies state and loading/error information
 */
export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await brandDnaService.getCompanies();
        
        // Validate response structure
        if (!response || !response.brands || !Array.isArray(response.brands)) {
          throw new Error('Invalid response structure from API');
        }
        
        // Transform CompanyBrand[] to Company[] by adding id and building full logo URLs
        const transformedCompanies: Company[] = response.brands.map((brand: CompanyBrand, index: number) => {
          // Ensure all values are strings
          const logoUrl = brand.logo && typeof brand.logo === 'string' 
            ? buildLogoUrl(brand.logo, brand.url || '') 
            : '';
          
          return {
            id: String(index + 1),
            name: brand.name && typeof brand.name === 'string' ? brand.name : '',
            logo: logoUrl,
            url: brand.url && typeof brand.url === 'string' ? brand.url : '',
          };
        });
        
        setCompanies(transformedCompanies);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : typeof err === 'string' 
            ? err 
            : 'Failed to fetch companies';
        setError(errorMessage);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
  };
};

