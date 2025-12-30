// useBrandDna.ts
//
// This file defines a custom React hook for accessing Brand DNA data from Redux.
// It provides convenient access to the Brand DNA state and dispatch actions.

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/core/store/rootReducer';
import { AppDispatch } from '@/core/store/store';
import { fetchBrandDna, clearBrandDna, setSelectedCompany } from '../store/brandDnaSlice';
import { Company } from '../types/brandDnaTypes';

/**
 * useBrandDna
 *
 * Custom hook that provides access to Brand DNA state and actions.
 * Fetches Brand DNA data when a company is selected.
 *
 * @returns {BrandDnaState & { refetch: (url?: string) => void, clear: () => void, selectCompany: (company: Company) => void }} - Brand DNA state and utility functions
 */
export const useBrandDna = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brandDna = useSelector((state: RootState) => state.brandDna);

  const selectCompany = (company: Company) => {
    dispatch(setSelectedCompany(company));
    dispatch(fetchBrandDna(company.url));
  };

  const refetch = (url?: string) => {
    const urlToUse = url || brandDna.selectedCompany?.url;
    dispatch(fetchBrandDna(urlToUse));
  };

  const clear = () => {
    dispatch(clearBrandDna());
  };

  return {
    ...brandDna,
    refetch,
    clear,
    selectCompany,
  };
};

