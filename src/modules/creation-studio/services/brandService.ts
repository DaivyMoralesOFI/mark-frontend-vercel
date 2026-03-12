import { API_CONFIG, DJANGO_CLIENT } from "@/core/api/apiConfig";
import { isApiError } from "@/core/lib/apiErrorHandler";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import {
  BrandExtractor,
  BrandExtractorResponse,
  BrandExtractorResponseSchema,
  BrandResponseSchema,
  BrandsResponse,
} from "@/modules/creation-studio/schemas/BrandSchema";

type ExtractBrandDnaPayload = {
  brand_name?: string;
  industry?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  complementary_color?: string;
  font_body_family?: string;
  font_headings_family?: string;
  voice_tone?: string;
  archetype?: string;
  target_audience?: string;
  keywords?: string;
  description?: string;
};

type ExtractBrandResponse = {
  status: string;
  brand_id: string;
  db_saved: boolean;
  brand_dna: ExtractBrandDnaPayload;
};


type BrandListItem = {
  uuid: string;
  name: string;
  slug: string;
  industry: string;
  is_active: boolean;
  dna_uuid: string | null;
  logo_url: string;
  created_at: string;
};

type BrandListResponse = Array<BrandListItem>;

const DEFAULT_COLORS = {
  primary: "#111111",
  secondary: "#4B5563",
  tertiary: "#9CA3AF",
  complementary: "#F3F4F6",
  light: "#FFFFFF",
  dark: "#111111",
};

const normalizeHex = (value: string | undefined, fallback: string) => {
  const normalized = (value || "").trim();
  return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized : fallback;
};

const splitCsv = (value: string | undefined) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildBrandExtractor = ({
  uuid,
  brandInput,
  brandName,
  industry,
  logoUrl,
  dna,
}: {
  uuid: string;
  brandInput: string;
  brandName: string;
  industry: string;
  logoUrl: string;
  dna: ExtractBrandDnaPayload;
}): BrandExtractor => {
  const primary = normalizeHex(dna.primary_color, DEFAULT_COLORS.primary);
  const secondary = normalizeHex(dna.secondary_color, DEFAULT_COLORS.secondary);
  const tertiary = normalizeHex(dna.accent_color, DEFAULT_COLORS.tertiary);
  const complementary = normalizeHex(
    dna.complementary_color,
    DEFAULT_COLORS.complementary,
  );
  const keywords = splitCsv(dna.keywords);
  const hostname = (() => {
    try {
      return new URL(brandInput).hostname;
    } catch {
      return "unknown";
    }
  })();

  return {
    brand_identity: {
      name: brandName,
      url: brandInput,
      logo: {
        url: logoUrl,
        format: logoUrl.split(".").pop() || "unknown",
        placement_confidence: logoUrl ? "medium" : "low",
        usage_hint: "Use as the primary brand mark when available.",
        is_inline_svg: logoUrl.endsWith(".svg"),
        found_in_header: false,
        candidates: logoUrl ? [logoUrl] : [],
      },
      brand_archetype: dna.archetype || "",
      industry,
    },
    typography: {
      headings: {
        font_family: dna.font_headings_family || "",
        classification: "",
        optical_size: "",
        personality_signal: "",
      },
      body: {
        font_family: dna.font_body_family || "",
        classification: "",
        optical_size: "",
        personality_signal: "",
      },
      all_detected: [dna.font_headings_family, dna.font_body_family].filter(
        Boolean,
      ) as string[],
    },
    color_system: {
      source_palette: [primary, secondary, tertiary, complementary],
      source: "mark-backend",
      total_detected: [primary, secondary, tertiary, complementary].length,
      roles: {
        primary: { hex: primary, derived: false },
        on_primary: { hex: DEFAULT_COLORS.light, derived: true },
        primary_container: { hex: secondary, derived: true },
        on_primary_container: { hex: DEFAULT_COLORS.dark, derived: true },
        secondary: { hex: secondary, derived: false },
        on_secondary: { hex: DEFAULT_COLORS.light, derived: true },
        secondary_container: { hex: complementary, derived: true },
        on_secondary_container: { hex: DEFAULT_COLORS.dark, derived: true },
        tertiary: { hex: tertiary, derived: false },
        on_tertiary: { hex: DEFAULT_COLORS.light, derived: true },
        tertiary_container: { hex: complementary, derived: true },
        on_tertiary_container: { hex: DEFAULT_COLORS.dark, derived: true },
        surface: { hex: DEFAULT_COLORS.light, derived: true },
        on_surface: { hex: DEFAULT_COLORS.dark, derived: true },
        surface_variant: { hex: complementary, derived: true },
        outline: { hex: secondary, derived: true },
      },
    },
    brand_voice: {
      meta_description: dna.description || "",
      headings: brandName ? [brandName] : [],
      sample_text: dna.description || "",
      tone_of_voice: keywords,
      communication_style: dna.voice_tone || "",
      target_audience: dna.target_audience || "",
      brand_archetype: dna.archetype || "",
      positioning_statement: dna.description || "",
    },
    social_presence: {
      twitter: "unknown",
      instagram: "unknown",
      youtube: "unknown",
      facebook: "unknown",
    },
    _meta: {
      uuid,
      scraped_at: new Date().toISOString(),
      html_bytes: 0,
      color_source: "mark-backend",
      logo_tier: logoUrl ? "known" : "unknown",
      hostname,
      pipeline_version: "mark-backend-extract",
    },
  };
};

export const setBrandExtractor = async (
  targetUrl: string,
): Promise<BrandExtractorResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.BRAND_EXTRACTOR.brandExtractor;
    const response = await DJANGO_CLIENT.post<ExtractBrandResponse>(endpoint, {
      brand_input: targetUrl,
    });

    const transformed = {
      output: buildBrandExtractor({
        uuid: response.data.brand_id,
        brandInput: targetUrl,
        brandName: response.data.brand_dna.brand_name || targetUrl,
        industry: response.data.brand_dna.industry || "",
        logoUrl: "",
        dna: response.data.brand_dna,
      }),
    };

    return validateSchemaSoft(BrandExtractorResponseSchema, transformed, {
      operation: "setBrandExtractor",
      endpoint,
    }) as BrandExtractorResponse;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error extracting brand:", {
        targetUrl,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    throw new Error(
      `Failed to create brand extractor ${targetUrl}: ${errorMessage}`,
    );
  }
};

export const getAllBrands = async (): Promise<BrandsResponse> => {
  const listResponse = await DJANGO_CLIENT.get<BrandListResponse>(
    API_CONFIG.ENDPOINTS.BRANDS.list,
  );

  const brands = listResponse.data.map((item) =>
    buildBrandExtractor({
      uuid: item.uuid,
      brandInput: item.slug ? `https://${item.slug}.com` : "",
      brandName: item.name,
      industry: item.industry || "",
      logoUrl: item.logo_url || "",
      dna: {},
    }),
  );

  return validateSchemaSoft(BrandResponseSchema, brands, {
    operation: "getAllBrands",
    endpoint: API_CONFIG.ENDPOINTS.BRANDS.list,
  }) as BrandsResponse;
};

export const setNewBrand = async (brand: BrandExtractor) => brand;
