import { DJANGO_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import { isApiError } from "@/core/lib/apiErrorHandler";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import {
  CreateImage,
  CreateImageResponse,
  createImageResponseSchema,
  EditCopy,
  EditImage,
  EditImageResponse,
  editImageResponseSchema,
  EditVideoScene,
  GetCreatedImage,
  getCreatedImageSchema,
  RegenerateCopy,
  RegenerateCopyResponse,
  regenerateCopyResponseSchema,
} from "../schemas/CreateImage";

const creationsEndpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creations;

export type CreationListItem = {
  uuid: string;
  title: string;
  post_type: string;
  status: string;
  platforms: string;
  post_tone: string;
  brand_name?: string;
  created_at: string;
  updated_at: string;
};

export const getAllCreations = async (): Promise<CreationListItem[]> => {
  const response = await DJANGO_CLIENT.get<CreationListItem[]>(creationsEndpoint);
  return response.data;
};

/** Builds the type-specific payload for POST /api/creations/{uuid}/generations/ */
function buildGenerationPayload(schema: CreateImage): Record<string, unknown> {
  const platform = schema.platforms[0] ?? "instagram";

  switch (schema.post_type) {
    case "carousel":
      return {
        type: "carousel",
        prompt: schema.prompt,
        platform,
        num_slides: 7,
      };
    case "video":
    case "reel":
      return {
        type: "video",
        prompt: schema.prompt,
        platform,
        video_tone: schema.post_tone,
        num_scenes: 4,
        scene_duration: 6,
      };
    default:
      // post, story, infographic → single image
      return {
        type: "image",
        prompt: schema.prompt,
        platforms: schema.platforms,
        post_tone: schema.post_tone,
      };
  }
}

export const setCreateImage = async (
  imageSchema: CreateImage,
): Promise<CreateImageResponse> => {
  try {
    // Step 1: Create the Creation container
    const creationPayload = {
      brand: imageSchema.brand_uuid ?? "",
      title: imageSchema.prompt,
      post_type: imageSchema.post_type,
      status: "pending",
      platforms: imageSchema.platforms.join(","),
      post_tone: imageSchema.post_tone,
    };

    const creationResponse = await DJANGO_CLIENT.post<{ uuid: string }>(
      creationsEndpoint,
      creationPayload,
    );

    const creationUuid = creationResponse.data.uuid;

    // Step 2: Trigger generation tied to this creation.
    // Video/reel generation can take several minutes on the backend.
    // We fire the request without waiting for it and navigate immediately —
    // the polling loop in useGetCreatedImage will pick up the result.
    const generationsUrl = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creationGenerations(creationUuid);
    const isLongRunning =
      imageSchema.post_type === "video" || imageSchema.post_type === "reel";

    let copy = "";
    if (isLongRunning) {
      // Fire-and-forget: don't block navigation on a potentially multi-minute job
      DJANGO_CLIENT.post(generationsUrl, buildGenerationPayload(imageSchema)).catch(
        () => {
          // Timeout / network error is expected here — the backend job keeps running
        },
      );
    } else {
      const genResponse = await DJANGO_CLIENT.post<Record<string, unknown>>(
        generationsUrl,
        buildGenerationPayload(imageSchema),
      );
      const rawCopy = genResponse.data?.copy;
      if (typeof rawCopy === "string") {
        copy = rawCopy;
      } else if (rawCopy && typeof rawCopy === "object") {
        copy =
          (rawCopy as any).content ||
          (rawCopy as any).text ||
          JSON.stringify(rawCopy);
      }
    }

    return validateSchemaSoft(
      createImageResponseSchema,
      { uuid: creationUuid, copy },
      { operation: "createImage", endpoint: creationsEndpoint },
    ) as CreateImageResponse;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error creating image:", {
        imageSchema,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Failed to create image:", {
      operation: "createImage",
      imageSchema,
      error: errorMessage,
    });

    throw new Error(`Failed to create image: ${errorMessage}`);
  }
};

export const setEditImage = async (
  editPayload: EditImage,
): Promise<EditImageResponse> => {
  const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creationGenerations(
    editPayload.creation_uuid,
  );
  try {
    const response = await DJANGO_CLIENT.post(endpoint, {
      parent: editPayload.uuid,
      prompt: editPayload.prompt,
      type: "edit_image",
    });

    return validateSchemaSoft(editImageResponseSchema, response.data, {
      operation: "editImage",
      endpoint,
    }) as EditImageResponse;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error editing image:", {
        editPayload,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Failed to edit image:", {
      operation: "editImage",
      editPayload,
      error: errorMessage,
    });

    throw new Error(`Failed to edit image: ${errorMessage}`);
  }
};

export const getImageCreated = async (
  uuid: string,
): Promise<GetCreatedImage> => {
  const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creationDetail(uuid);

  try {
    const response = await DJANGO_CLIENT.get(endpoint);
    const creation = response.data;

    const allGens: Record<string, unknown>[] = creation.generations ?? [];
    
    // Find the master generation (carousel or first image)
    const carouselGen = allGens.find(g => g.type === "carousel");
    const firstGen = carouselGen || (allGens[0] as Record<string, unknown> | undefined);
    
    // Find associated copy text
    const copyGen = allGens.find(g => g.type === "copy");
    let masterCopy = String(copyGen?.content || copyGen?.copy || firstGen?.copy || creation.copy || "");
    
    // If it's a JSON string (common for carousels), parse the caption
    if (masterCopy.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(masterCopy);
        masterCopy = parsed.caption || parsed.content || parsed.text || masterCopy;
      } catch (e) {
        console.error("Failed to parse masterCopy JSON:", e);
      }
    }

    const isCarousel =
      (firstGen?.type as string) === "carousel" ||
      creation.post_type === "carousel";

    let mapped: GetCreatedImage;

    if (allGens.length === 0) {
      // No generations yet — creation is still pending
      mapped = {
        uuid: creation.uuid,
        creation_uuid: creation.uuid,
        parent_uuid: null,
        type: creation.post_type,
        prompt: creation.title ?? "",
        status: creation.status ?? "pending",
        content: "",
        slices: [],
        created_at: creation.created_at,
      };
    } else if (isCarousel && firstGen) {
      // Carousel: fetch each slide if they are UUIDs, or map existing generations as slices
      const slicesFromAllGens = allGens
        .filter(g => g.uuid !== firstGen.uuid)
        .map(s => ({
          uuid: String(s.uuid ?? ""),
          creation_uuid: creation.uuid,
          parent_uuid: String(s.parent_uuid ?? firstGen.uuid ?? ""),
          type: String(s.type ?? "image"),
          status: String(s.status ?? "done"),
          prompt: String(s.prompt ?? ""),
          content: String(s.content ?? ""),
          created_at: s.created_at as string | undefined,
        }));

      mapped = {
        uuid: String(firstGen.uuid ?? ""),
        creation_uuid: creation.uuid,
        parent_uuid: (firstGen.parent_uuid as string) ?? null,
        type: String(firstGen.type ?? creation.post_type),
        prompt: String(firstGen.prompt ?? creation.title ?? ""),
        status: String(firstGen.status ?? creation.status),
        content: String(firstGen.content ?? ""),
        copy: masterCopy,
        slices: slicesFromAllGens.length > 0 
          ? slicesFromAllGens 
          : ((firstGen.slices as Record<string, unknown>[]) ?? []).map(
              (s) => ({
                uuid: String(s.uuid ?? ""),
                creation_uuid: creation.uuid,
                parent_uuid: String(firstGen.uuid ?? ""),
                type: String(s.type ?? "image"),
                status: String(s.status ?? "done"),
                prompt: String(s.prompt ?? ""),
                content: String(s.content ?? ""),
                created_at: s.created_at as string | undefined,
              }),
            ),
        created_at: firstGen.created_at as string | undefined,
      };

      const hasSlicesInResponse = mapped.slices?.some((s) => !!s.content);
      if (!hasSlicesInResponse) {
        const potentialUuids = (String(firstGen.content ?? ""))
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);

        // Simple regex to check if it looks like a UUID (8-4-4-4-12 hex chars)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const slideUuids = potentialUuids.filter((id) => uuidRegex.test(id));

        if (slideUuids.length > 0 && slideUuids.length === potentialUuids.length) {
          const slideDetails = await Promise.all(
            slideUuids.map(async (slideUuid: string) => {
              try {
                const slideEndpoint =
                  API_CONFIG.ENDPOINTS.CREATION_STUDIO.generationDetail(
                    slideUuid,
                  );
                const slideRes =
                  await DJANGO_CLIENT.get<Record<string, unknown>>(
                    slideEndpoint,
                  );
                return {
                  uuid: slideUuid,
                  creation_uuid: creation.uuid,
                  parent_uuid: String(firstGen.uuid ?? ""),
                  type: String(slideRes.data.type ?? "image"),
                  status: String(slideRes.data.status ?? "done"),
                  prompt: String(
                    slideRes.data.prompt ?? firstGen.prompt ?? "",
                  ),
                  content: String(slideRes.data.content ?? ""),
                  created_at: slideRes.data.created_at as string | undefined,
                };
              } catch {
                return null;
              }
            }),
          );
          mapped = {
            ...mapped,
            slices: slideDetails.filter(Boolean) as typeof mapped.slices,
          };
        }
      }
    } else {
      // Regular image (post, story, infographic, reel, video):
      // Return ALL generations as slices so the tree builder can display
      // the original image and every subsequent edit side by side.
      mapped = {
        uuid: creation.uuid,
        creation_uuid: creation.uuid,
        parent_uuid: null,
        type: creation.post_type,
        prompt: creation.title ?? "",
        status: creation.status ?? (firstGen?.status as string) ?? "done",
        content: String(firstGen?.content ?? ""),
        copy: masterCopy,
        slices: allGens.map((gen) => ({
          uuid: String(gen.uuid ?? ""),
          creation_uuid: creation.uuid,
          parent_uuid: gen.parent_uuid ? String(gen.parent_uuid) : null,
          type: String(gen.type ?? creation.post_type ?? "image"),
          status: String(gen.status ?? "done"),
          prompt: String(gen.prompt ?? creation.title ?? ""),
          content: String(gen.content ?? ""),
          copy: String(gen.copy ?? ""),
          created_at: gen.created_at as string | undefined,
        })),
        created_at: creation.created_at,
      };
    }

    return validateSchemaSoft(getCreatedImageSchema, mapped, {
      operation: "getImageCreated",
      endpoint,
    }) as GetCreatedImage;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error fetching creation:", {
        uuid,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Failed to fetch creation:", {
      operation: "getImageCreated",
      uuid,
      error: errorMessage,
    });

    throw new Error(`Failed to fetch creation ${uuid}: ${errorMessage}`);
  }
};

export const setEditVideoScene = async (
  params: EditVideoScene,
): Promise<{ generation: { uuid: string; type: string; status: string } }> => {
  const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creationGenerations(params.creation_uuid);
  try {
    const response = await DJANGO_CLIENT.post(endpoint, {
      parent: params.parent,
      type: "edit_video_scene",
      prompt: params.prompt,
      scene_duration: params.scene_duration ?? 6,
    });
    return response.data;
  } catch (error) {
    if (isApiError(error)) throw new Error(error.userMessage);
    throw new Error(error instanceof Error ? error.message : "Failed to edit video scene");
  }
};

export const setEditCopy = async (
  params: EditCopy,
): Promise<{ generation: { uuid: string; type: string; content: string; status: string } }> => {
  const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.creationGenerations(params.creation_uuid);
  try {
    const response = await DJANGO_CLIENT.post(endpoint, {
      parent: params.parent,
      type: "edit_copy",
      current_copy: params.current_copy,
      copy_feedback: params.copy_feedback,
    });
    return response.data;
  } catch (error) {
    if (isApiError(error)) throw new Error(error.userMessage);
    throw new Error(error instanceof Error ? error.message : "Failed to edit copy");
  }
};

export const setRegenerateCopy = async (
  params: RegenerateCopy,
): Promise<RegenerateCopyResponse> => {
  try {
    const response = await DJANGO_CLIENT.post(generationEndpoint, {
      type: "edit_copy",
      ...params,
    });

    return validateSchemaSoft(regenerateCopyResponseSchema, response.data, {
      operation: "regenerateCopy",
      endpoint: generationEndpoint,
    }) as RegenerateCopyResponse;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error regenerating copy:", {
        params,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    throw new Error(`Failed to regenerate copy: ${errorMessage}`);
  }
};
