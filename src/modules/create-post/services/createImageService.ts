import { DJANGO_CLIENT, API_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import {
  CreateImage,
  CreateImageResponse,
  createImageResponseSchema,
  EditImage,
  EditImageResponse,
  editImageResponseSchema,
  GetCreatedImage,
  getCreatedImageSchema,
} from "../schemas/CreateImage";
import { isApiError } from "@/core/lib/apiErrorHandler";

export const setCreateImage = async (
  image_schema: CreateImage,
): Promise<CreateImageResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.createImage;
    const response = await DJANGO_CLIENT.post(endpoint, image_schema);
    const validationResult = validateSchemaSoft(
      createImageResponseSchema,
      response.data,
      {
        operation: "createImage",
        endpoint: endpoint,
      },
    ) as CreateImageResponse;
    return validationResult;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error fetching candidate:", {
        image_schema,
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
      image_schema,
      error: errorMessage,
    });

    throw new Error(`Failed to create image ${image_schema}: ${errorMessage}`);
  }
};

export const setEditImage = async (
  editPayload: EditImage,
): Promise<EditImageResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.editImage;
    const response = await DJANGO_CLIENT.post(endpoint, editPayload);
    const validationResult = validateSchemaSoft(
      editImageResponseSchema,
      response.data,
      {
        operation: "editImage",
        endpoint: endpoint,
      },
    ) as EditImageResponse;
    return validationResult;
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
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.getImageCreated;
    console.log(`Fetching image for workflow: ${uuid} at ${endpoint}`);

    const response = await API_CLIENT.get(endpoint, {
      params: { uuid },
    });
    const validationResult = validateSchemaSoft(
      getCreatedImageSchema,
      response.data,
      {
        operation: "getImageCreated",
        endpoint: endpoint,
      },
    ) as GetCreatedImage;
    return validationResult;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error fetching candidate:", {
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
      operation: "getImageCreated",
      error: errorMessage,
    });

    throw new Error(`Failed to create image: ${errorMessage}`);
  }
};

export const setRegenerateCopy = async (
  params: RegenerateCopy,
): Promise<RegenerateCopyResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.regenerateCopy;
    const response = await DJANGO_CLIENT.post(endpoint, params);
    const validationResult = validateSchemaSoft(
      regenerateCopyResponseSchema,
      response.data,
      {
        operation: "regenerateCopy",
        endpoint: endpoint,
      },
    ) as RegenerateCopyResponse;
    return validationResult;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error regenerating copy:", {
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    throw new Error(`Failed to regenerate copy: ${errorMessage}`);
  }
};
