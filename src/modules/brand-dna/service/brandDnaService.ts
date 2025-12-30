// brandDnaService.ts
//
// This file defines the brandDnaService object, which provides API methods for fetching Brand DNA data.
// It uses Axios for HTTP requests and is designed to interact with the backend endpoint for Brand DNA information.

import axios from "axios";
import { BrandDnaResponse, BrandDnaApiResponse, CompaniesResponse, CompaniesApiResponse, ColorAnalysis, ColorObject } from "../types/brandDnaTypes";

// Base URL for the API endpoints
const API_BASE_URL = 'https://n8n.sofiatechnology.ai/webhook';

// Axios instance configured for the API
const brandDnaApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Custom params serializer to prevent encoding of URL parameter
  paramsSerializer: (params) => {
    const parts: string[] = [];
    Object.keys(params).forEach((key) => {
      const value = params[key];
      // For 'url' parameter, append without encoding (backend expects unencoded)
      if (key === 'url' && typeof value === 'string') {
        parts.push(`${key}=${value}`);
      } else {
        parts.push(`${key}=${encodeURIComponent(String(value))}`);
      }
    });
    return parts.join('&');
  },
});

/**
 * brandDnaService
 *
 * Provides methods to interact with the backend for:
 * - Fetching Brand DNA data (brand identity, color palette, typography, brand tone)
 * - Fetching companies list from public JSON file
 */
export const brandDnaService = {
  /**
   * Fetch Brand DNA data from the backend
   * @param {string} url - The company URL to fetch Brand DNA for (optional)
   * @returns {Promise<BrandDnaResponse>} - The complete Brand DNA data (mapped and normalized)
   */
  getBrandDna: async (url?: string): Promise<BrandDnaResponse> => {
    // Use params to pass URL, but paramsSerializer will handle it without encoding
    const config = url ? { params: { url } } : {};
    const response = await brandDnaApi.get<BrandDnaApiResponse>('/dna', config);
    const apiData = response.data.data;

    // Helper function to extract color string from either string or ColorObject
    const extractColor = (item: string | ColorObject): string => {
      if (typeof item === 'string') {
        return item;
      }
      return item?.color || '';
    };

    // Map color_analysis to color_palette structure
    const mapColorAnalysisToPalette = (colorAnalysis: ColorAnalysis) => {
      const primaryColors = colorAnalysis.Primary || [];
      const secondaryColors = colorAnalysis.Secondary || [];
      const tertiaryColors = colorAnalysis.Tertiary || [];

      // Extract color strings from arrays (handles both string[] and ColorObject[])
      const primaryColorStrings = primaryColors.map(extractColor).filter(Boolean);
      const secondaryColorStrings = secondaryColors.map(extractColor).filter(Boolean);
      const tertiaryColorStrings = tertiaryColors.map(extractColor).filter(Boolean);

      return {
        primary: primaryColorStrings[0] || '',
        secondary: secondaryColorStrings[0] || '',
        accent: primaryColorStrings[1] || primaryColorStrings[0] || '',
        background: tertiaryColorStrings.find(c => c.startsWith('#F')) || tertiaryColorStrings[0] || '',
        complementary: [
          ...primaryColorStrings.slice(1),
          ...secondaryColorStrings,
          ...tertiaryColorStrings
        ].filter(Boolean),
      };
    };

    // Map brand_tone (can be string or object) to brand_tone_mood structure
    const mapBrandTone = (brandTone: Record<string, string> | string) => {
      let toneDescription = '';
      
      if (typeof brandTone === 'string') {
        toneDescription = brandTone;
      } else if (typeof brandTone === 'object' && brandTone !== null) {
        // Extract the first value from the object (the description)
        toneDescription = Object.values(brandTone)[0] || '';
      }
      
      return {
        brand_tone: toneDescription,
        mood_description: toneDescription,
      };
    };

    // Build full logo URL if it's a relative path
    const buildLogoUrl = (logoUrl: string, companyUrl: string) => {
      if (!logoUrl) return '';
      // If it's already a full URL, return it
      if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        return logoUrl;
      }
      // If it's a relative path, construct full URL from company URL
      try {
        const companyUrlObj = new URL(companyUrl);
        // If logo starts with /, it's an absolute path on the domain
        if (logoUrl.startsWith('/')) {
          return `${companyUrlObj.origin}${logoUrl}`;
        }
        // Otherwise, it's relative to the company URL
        return new URL(logoUrl, companyUrl).href;
      } catch {
        return logoUrl;
      }
    };

    // Return normalized structure
    return {
      brand_identity: {
        ...apiData.brand_identity,
        logo: {
          url: buildLogoUrl(apiData.brand_identity.logo.url, apiData.brand_identity.url),
        },
      },
      typography: apiData.typography,
      color_palette: mapColorAnalysisToPalette(apiData.color_analysis),
      brand_tone_mood: mapBrandTone(apiData.brand_tone),
    };
  },

  /**
   * Fetch companies list from backend API
   * @returns {Promise<CompaniesResponse>} - The companies data
   */
  getCompanies: async (): Promise<CompaniesResponse> => {
    const response = await brandDnaApi.get<CompaniesApiResponse>('/brands-list');
    // The API returns directly an object with total_brands and brands
    const data = response.data;
    
    // Ensure the response has the expected structure
    if (!data || !data.brands || !Array.isArray(data.brands)) {
      return {
        total_brands: 0,
        brands: [],
      };
    }
    
    // Filter out any invalid brand entries
    const validBrands = data.brands.filter(
      (brand) => brand && typeof brand === 'object' && brand.name && brand.url
    );
    
    return {
      total_brands: validBrands.length,
      brands: validBrands,
    };
  },
};

