import z from "zod";

export const createImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  post_type: z.string().min(1, "Post type is required"),
  post_tone: z.string().min(1, "Post tone is required"),
  reference_image: z.string().optional(),
  brand_dna: z.object({
    color_palette: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      complementary: z.array(z.string()),
    }),
    typography: z.object({
      body: z.string(),
      heading: z.string(),
    }),
    tone: z.object({
      description: z.string(),
      keywords: z.array(z.string()),
      voice: z.string(),
    }),
  }),
  identity: z.object({
    logo_url: z.url(),
    name: z.string(),
    slug: z.string(),
    site_url: z.url(),
  }),
});

export type CreateImage = z.infer<typeof createImageSchema>;

export const createImageResponseSchema = z.object({
  uuid: z.string(),
  message: z.string(),
});

export type CreateImageResponse = z.infer<typeof createImageResponseSchema>;

export const creationStoreSchema = z.object({
  uuid: z.string(),
  creation_at: z.any().optional(),
  update_at: z.any().optional(),
  identity: z
    .object({
      logo_url: z.string().optional(),
      name: z.string().optional(),
      site_url: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  platforms: z.array(z.string()).optional(),
  post_tone: z.string().optional(),
  post_type: z.string().optional(),
  prompt: z.string().optional(),
  status: z.string(), // Cambiado de enum a string para mayor flexibilidad
  image_url: z.string().optional(),
  img_url: z.string().optional(),
});

export type CreationStore = z.infer<typeof creationStoreSchema>;

export const getCreatedImageSchema = z.object({
  file: z.instanceof(File),
});

export type GetCreatedImage = z.infer<typeof getCreatedImageSchema>;
