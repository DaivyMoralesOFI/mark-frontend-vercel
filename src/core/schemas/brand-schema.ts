import z from "zod";

export const brand_schema = z.object({
  uuid: z.string().min(1, "Brand ID is required"),
  create_at: z.object({
    seconds: z.number().positive("Creation timestamp seconds must be positive"),
    nanoseconds: z
      .number()
      .nonnegative("Creation timestamp nanoseconds must be non-negative"),
  }),
  update_at: z.object({
    seconds: z.number().positive("Update timestamp seconds must be positive"),
    nanoseconds: z
      .number()
      .nonnegative("Update timestamp nanoseconds must be non-negative"),
  }),
  identity: z.object({
    name: z.string().min(1, "Brand name is required"),
    logo_url: z
      .string()
      .url("Logo must be a valid URL")
      .or(z.string().length(0)),
    url: z.string().url("URL must be a valid URL").or(z.string().length(0)),
    slug: z.string().min(1, "Slug is required"),
  }),
  brand_dna: z.object({
    color_pallete: z.object({
      primary: z.string().min(1, "Primary color is required"),
      secondary: z.string().min(1, "Secondary color is required"),
      accent: z.string().min(1, "Accent color is required"),
      complementary: z.array(
        z.string().min(1, "Complementary color is required"),
      ),
    }),
    typography: z.object({
      headings: z.object({
        font_family: z.string().min(1, "Heading font is required"),
        category: z.string().min(1, "Heading category is required"),
        url_link: z.string(),
      }),
      body: z.object({
        font_family: z.string().min(1, "Body font is required"),
        category: z.string().min(1, "Body category is required"),
        url_link: z.string(),
      }),
    }),
  }),
  brand_tone_mood: z.object({
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string().min(1, "Keyword is required")),
    voice: z.string().min(1, "Voice tone is required"),
  }),
  isActive: z.boolean(),
});

export type Brand = z.infer<typeof brand_schema>;

export const brand_response_schema = z.array(brand_schema);
export type BrandResponse = z.infer<typeof brand_response_schema>;
