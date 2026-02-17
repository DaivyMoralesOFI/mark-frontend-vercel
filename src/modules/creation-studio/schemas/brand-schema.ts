import { z } from "zod";

// --- Sub-schemas reutilizables ---
const LogoSchema = z.object({
  url: z.url(),
  format: z.string(),
  placement_confidence: z.enum(["high", "medium", "low"]),
  usage_hint: z.string(),
  is_inline_svg: z.boolean(),
  found_in_header: z.boolean(),
  candidates: z.array(z.url()),
});
const BrandIdentitySchema = z.object({
  name: z.string(),
  url: z.url(),
  logo: LogoSchema,
  brand_archetype: z.string(),
  industry: z.string(),
});
const FontSchema = z.object({
  font_family: z.string(),
  classification: z.string(),
  optical_size: z.string(),
  personality_signal: z.string(),
});

const TypographySchema = z.object({
  headings: FontSchema,
  body: FontSchema,
  all_detected: z.array(z.string()),
});
// Helper para roles de color — hex + derived, con contrast_ratio opcional
const ColorRoleSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  derived: z.boolean(),
  contrast_ratio: z.number().optional(),
});
const ColorRolesSchema = z.object({
  primary: ColorRoleSchema,
  on_primary: ColorRoleSchema,
  primary_container: ColorRoleSchema,
  on_primary_container: ColorRoleSchema,
  secondary: ColorRoleSchema,
  on_secondary: ColorRoleSchema,
  secondary_container: ColorRoleSchema,
  on_secondary_container: ColorRoleSchema,
  tertiary: ColorRoleSchema,
  on_tertiary: ColorRoleSchema,
  tertiary_container: ColorRoleSchema,
  on_tertiary_container: ColorRoleSchema,
  surface: ColorRoleSchema,
  on_surface: ColorRoleSchema,
  surface_variant: ColorRoleSchema,
  outline: ColorRoleSchema,
});

const ColorSystemSchema = z.object({
  source_palette: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)),
  source: z.string(),
  total_detected: z.number().int().nonnegative(),
  roles: ColorRolesSchema,
});

const BrandVoiceSchema = z.object({
  meta_description: z.string(),
  headings: z.array(z.string()),
  sample_text: z.string(),
  tone_of_voice: z.array(z.string()),
  communication_style: z.string(),
  target_audience: z.string(),
  brand_archetype: z.string(),
  positioning_statement: z.string(),
});

const SocialPresenceSchema = z.object({
  twitter: z.union([z.url(), z.literal("unknown")]),
  instagram: z.union([z.url(), z.literal("unknown")]),
  youtube: z.union([z.url(), z.literal("unknown")]),
  facebook: z.union([z.url(), z.literal("unknown")]),
});

const MetaSchema = z.object({
  uuid: z.string(),
  scraped_at: z.string(),
  html_bytes: z.number().int().nonnegative(),
  color_source: z.string(),
  logo_tier: z.string(),
  hostname: z.string(),
  pipeline_version: z.string(),
});

// --- Schema raíz ---

const BrandExtractorSchema = z.object({
  brand_identity: BrandIdentitySchema,
  typography: TypographySchema,
  color_system: ColorSystemSchema,
  brand_voice: BrandVoiceSchema,
  social_presence: SocialPresenceSchema,
  _meta: MetaSchema,
});

export const BrandExtractorResponseSchema = z.object({
  output: BrandExtractorSchema,
});

export const BrandResponseSchema = z.array(BrandExtractorSchema);

export type BrandExtractorResponse = z.infer<
  typeof BrandExtractorResponseSchema
>;
export type BrandExtractor = z.infer<typeof BrandExtractorSchema>;
export type ColorSystem = z.infer<typeof ColorSystemSchema>;
export type BrandsResponse = z.infer<typeof BrandResponseSchema>;

export const extractorFormSchema = z.object({
  brandUrl: z
    .string()
    .min(1, "Please enter a URL")
    .transform((val: string) => {
      // Si la URL no comienza con http:// o https://, agregar https://
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .pipe(
      z.string().refine(
        (val: string) => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Please enter a valid URL" },
      ),
    ),
});

export type ExtractorFormData = z.infer<typeof extractorFormSchema>;

export const defaultExtractorForm: ExtractorFormData = {
  brandUrl: "",
};
