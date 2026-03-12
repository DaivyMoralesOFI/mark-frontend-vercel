// brandDnaTypes.ts
//
// This file defines TypeScript types for the Brand DNA module, including the complete data structure
// returned from the backend API and the Redux state shape.

/**
 * Brand Identity information
 */
export interface BrandIdentity {
  name: string;
  url: string;
  logo: {
    url: string;
  };
}

/**
 * Color object structure (when API returns objects with color and name)
 */
export interface ColorObject {
  color: string;
  name: string;
}

/**
 * Color Analysis structure from backend
 * Supports both string arrays and object arrays with {color, name}
 */
export interface ColorAnalysis {
  total_detected: number;
  Primary: string[] | ColorObject[];
  Secondary: string[] | ColorObject[];
  Tertiary: string[] | ColorObject[];
}

/**
 * Color Palette structure (mapped from ColorAnalysis)
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  complementary: string[];
}

/**
 * Typography font information
 */
export interface TypographyFont {
  font_family: string;
  category?: string;
  usage_context?: string;
}

/**
 * Typography structure
 */
export interface Typography {
  headings: TypographyFont;
  body: TypographyFont;
}

/**
 * Brand Tone and Mood information
 */
export interface BrandToneMood {
  voice?: string;
  keywords?: string[];
  mood_description?: string;
  brand_tone?: string; // Mapped from backend object
}

/**
 * Raw Brand DNA response from backend (wrapped in data)
 */
export interface BrandDnaApiResponse {
  data: {
    brand_identity: BrandIdentity;
    typography: Typography;
    color_analysis: ColorAnalysis;
    brand_tone: Record<string, string> | string; // Can be an object with company name as key and description as value, or a direct string
  };
}

/**
 * Complete Brand DNA response (mapped and normalized)
 */
export interface BrandDnaResponse {
  uuid?: string;
  brand_identity: BrandIdentity;
  color_palette: ColorPalette;
  typography: Typography;
  brand_tone_mood: BrandToneMood;
}

/**
 * Redux state for Brand DNA module
 */
export interface BrandDnaState {
  data: BrandDnaResponse | null;
  loading: boolean;
  error: string | null;
  selectedCompany: Company | null;
}

/**
 * Company/Brand from the backend API
 */
export interface CompanyBrand {
  uuid: string;
  name: string;
  url: string;
  logo?: string;
  slug?: string;
  industry?: string;
  dna_uuid?: string | null;
  created_at?: string;
}

/**
 * Raw brand list item from the backend API
 */
export interface BrandListApiItem {
  uuid: string;
  name: string;
  slug: string;
  industry: string;
  is_active: boolean;
  dna_uuid?: string | null;
  logo_url?: string;
  created_at?: string;
}

export interface BrandDNAApiResponse {
  uuid: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  complementary_color: string;
  font_body_family: string;
  font_headings_family: string;
  voice_tone: string;
  keywords: string;
  description: string;
  archetype: string;
  target_audience: string;
  created_at?: string;
  updated_at?: string;
}

export interface BrandDetailApiResponse {
  uuid: string;
  name: string;
  slug: string;
  page_url: string;
  logo_url: string;
  is_active: boolean;
  industry: string;
  user_id?: string | null;
  tenant_id?: string | null;
  dna?: BrandDNAApiResponse | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Companies response structure (same as API response)
 */
export interface CompaniesResponse {
  total_brands: number;
  brands: CompanyBrand[];
}

/**
 * Company interface used in components (with id and url)
 */
export interface Company {
  id: string;
  name: string;
  logo: string;
  url: string;
  lastUpdated?: string;
}
