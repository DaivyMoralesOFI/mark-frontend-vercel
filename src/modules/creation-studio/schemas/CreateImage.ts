import z from "zod";

export const brandDnaSchema = z.object({
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
});

export const identitySchema = z.object({
  logo_url: z.string(),
  name: z.string(),
  slug: z.string(),
  site_url: z.string(),
});

export const createImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  post_type: z.string().min(1, "Post type is required"),
  post_tone: z.string().min(1, "Post tone is required"),
  brand_uuid: z.string().optional(),
  brand_dna: brandDnaSchema,
  identity: identitySchema,
});

export type CreateImage = z.infer<typeof createImageSchema>;

export const createImageResponseSchema = z.object({
  uuid: z.string(),
  copy: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
});

export type CreateImageResponse = z.infer<typeof createImageResponseSchema>;

// Edit image schemas — matches POST /edit-image
export const editImageSchema = z.object({
  uuid: z.string(),
  parent_uuid: z.string().optional(),
  creation_uuid: z.string(),
  img_url: z.string(),
  prompt: z.string().min(1, "Edit prompt is required"),
});

export type EditImage = z.infer<typeof editImageSchema>;

const editGenerationSchema = z.object({
  uuid: z.string(),
  creation_uuid: z.string().optional(),
  parent_uuid: z.string().nullable().optional(),
  type: z.string().optional(),
  status: z.string(),
  prompt: z.string().optional(),
  content: z.string().optional(),
  created_at: z.string().optional(),
});

export const editImageResponseSchema = z.object({
  generation: editGenerationSchema,
});

export type EditImageResponse = z.infer<typeof editImageResponseSchema>;


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

// Schema for generation documents in subcollection: creations/{uuid}/generations/{gen_uuid}
export const generationStoreSchema = z.object({
  uuid: z.string().nullable().optional(),
  img_url: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  creation_uuid: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
  create_at: z.any().optional(),
  parent_uuid: z.string().nullable().optional(),
  copy: z.string().nullable().optional(),
  gen_type: z.string().nullable().optional(),
});

export type GenerationStore = z.infer<typeof generationStoreSchema>;

export const editVideoSceneSchema = z.object({
  creation_uuid: z.string(),
  parent: z.string(),
  prompt: z.string().min(1),
  scene_duration: z.number().default(6),
});

export type EditVideoScene = z.infer<typeof editVideoSceneSchema>;

export const editCopySchema = z.object({
  creation_uuid: z.string(),
  parent: z.string(),
  current_copy: z.string().optional(),
  copy_feedback: z.string().optional(),
});

export type EditCopy = z.infer<typeof editCopySchema>;

const generationSliceSchema = z.object({
  uuid: z.string(),
  creation_uuid: z.string().optional(),
  parent_uuid: z.string().nullable().optional(),
  type: z.string(),
  status: z.string(),
  prompt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  copy: z.string().optional().default(""),
  created_at: z.string().optional(),
});

export const getCreatedImageSchema = z.object({
  uuid: z.string(),
  creation_uuid: z.string().optional(),
  parent_uuid: z.string().nullable().optional(),
  type: z.string(),
  prompt: z.string().optional().default(""),
  status: z.string(),
  content: z.string().optional().default(""),
  slices: z.array(generationSliceSchema).optional().default([]),
  created_at: z.string().optional(),
});

export type GetCreatedImage = z.infer<typeof getCreatedImageSchema>;

export const regenerateCopySchema = z.object({
  creation_uuid: z.string(),
  prompt: z.string(),
  current_copy: z.string(),
  copy_feedback: z.string(),
  platforms: z.array(z.string()),
  post_type: z.string(),
  post_tone: z.string(),
  brand_dna: brandDnaSchema,
  identity: identitySchema,
});

export type RegenerateCopy = z.infer<typeof regenerateCopySchema>;

export const regenerateCopyResponseSchema = z.object({
  uuid: z.string(),
  copy: z.string(),
});

export type RegenerateCopyResponse = z.infer<typeof regenerateCopyResponseSchema>;
