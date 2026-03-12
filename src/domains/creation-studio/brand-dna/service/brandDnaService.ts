import { DJANGO_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import {
  BrandDetailApiResponse,
  BrandDnaResponse,
  BrandDNAApiResponse,
  BrandListApiItem,
  CompaniesResponse,
} from "../types/BrandDnaTypes";

const splitCsv = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const mapColorPalette = (dna?: BrandDNAApiResponse | null) => ({
  primary: dna?.primary_color || "",
  secondary: dna?.secondary_color || "",
  accent: dna?.accent_color || "",
  background: "",
  complementary: splitCsv(dna?.complementary_color),
});

const mapTypography = (dna?: BrandDNAApiResponse | null) => ({
  headings: {
    font_family: dna?.font_headings_family || "",
  },
  body: {
    font_family: dna?.font_body_family || "",
  },
});

const mapBrandToneMood = (dna?: BrandDNAApiResponse | null) => ({
  voice: dna?.voice_tone || undefined,
  keywords: splitCsv(dna?.keywords),
  mood_description: dna?.description || undefined,
  brand_tone: dna?.archetype || dna?.voice_tone || undefined,
});

const mapBrandDetailToBrandDna = (
  brand: BrandDetailApiResponse,
): BrandDnaResponse => ({
  uuid: brand.uuid,
  brand_identity: {
    name: brand.name,
    url: brand.page_url || "",
    logo: {
      url: brand.logo_url || "",
    },
  },
  color_palette: mapColorPalette(brand.dna),
  typography: mapTypography(brand.dna),
  brand_tone_mood: mapBrandToneMood(brand.dna),
});

export const brandDnaService = {
  getBrandDna: async (brandUuid: string): Promise<BrandDnaResponse> => {
    const endpoint = `${API_CONFIG.ENDPOINTS.BRANDS.list}${brandUuid}/`;
    const response = await DJANGO_CLIENT.get<BrandDetailApiResponse>(endpoint);

    return mapBrandDetailToBrandDna(response.data);
  },

  getCompanies: async (): Promise<CompaniesResponse> => {
    const response = await DJANGO_CLIENT.get<BrandListApiItem[]>(
      API_CONFIG.ENDPOINTS.BRANDS.list,
    );

    const brands = response.data.map((brand) => ({
      uuid: brand.uuid,
      name: brand.name,
      url: "",
      logo: brand.logo_url || "",
      slug: brand.slug,
      industry: brand.industry,
      dna_uuid: brand.dna_uuid || null,
      created_at: brand.created_at,
    }));

    return {
      total_brands: brands.length,
      brands,
    };
  },
};
