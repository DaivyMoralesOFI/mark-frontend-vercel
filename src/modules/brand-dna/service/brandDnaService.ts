// brandDnaService.ts
//
// This file defines the brandDnaService object, which provides API methods for fetching Brand DNA data.
// It uses Axios for HTTP requests and is designed to interact with the backend endpoint for Brand DNA information.

import axios from "axios";
import { BrandDnaResponse, BrandDnaApiResponse, CompaniesResponse, CompaniesApiResponse, ColorAnalysis } from "../types/brandDnaTypes";

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

    // Map color_analysis to color_palette structure
    const mapColorAnalysisToPalette = (colorAnalysis: ColorAnalysis) => {
      return {
        primary: colorAnalysis.Primary?.[0] || '',
        secondary: colorAnalysis.Secondary?.[0] || '',
        accent: colorAnalysis.Primary?.[1] || colorAnalysis.Primary?.[0] || '',
        background: colorAnalysis.Tertiary?.find(c => c.startsWith('#F')) || colorAnalysis.Tertiary?.[0] || '',
        complementary: [
          ...(colorAnalysis.Primary?.slice(1) || []),
          ...(colorAnalysis.Secondary || []),
          ...(colorAnalysis.Tertiary || [])
        ].filter(Boolean),
      };
    };

    // Map brand_tone object to brand_tone_mood structure
    const mapBrandTone = (brandTone: Record<string, string>) => {
      // Extract the first value from the object (the description)
      const toneDescription = Object.values(brandTone)[0] || '';
      
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

