import { API_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import {
  CreateImageResponse,
  createImageResponseSchema,
  CreationStore,
  creationStoreSchema,
  GetCreatedImage,
  getCreatedImageSchema,
} from "../schemas/CreateImage";
import { isApiError } from "@/core/lib/apiErrorHandler";
import { CreateImage, EditImage } from "../schemas/CreateImage";
import {
  createLiveSubscription,
  UnsubscribeFn,
  FirebaseSubscriptionError,
} from "./firebaseServices";

export const setCreateImage = async (
  image_schema: CreateImage,
): Promise<CreateImageResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.createImage;
    const response = await API_CLIENT.post(endpoint, image_schema);
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
  edit_param: EditImage,
): Promise<CreateImageResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.editImage;
    const response = await API_CLIENT.post(endpoint, edit_param);
    const validationResult = validateSchemaSoft(
      createImageResponseSchema,
      response.data,
      {
        operation: "editImage",
        endpoint: endpoint,
      },
    ) as CreateImageResponse;
    return validationResult;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error editing image:", {
        edit_param,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

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

export function getCreationsStatusWithRetry(
  uuid: string,
  callback: (
    data: CreationStore[] | null,
    error?: FirebaseSubscriptionError,
  ) => void,
  maxRetries = 5,
  initialDelay = 1000,
): UnsubscribeFn {
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let currentUnsubscribe: UnsubscribeFn | null = null;

  const attemptSubscription = () => {
    console.log(
      `🔄 Subscribing to creation (attempt ${retryCount + 1}/${maxRetries + 1}): ${uuid}`,
    );

    currentUnsubscribe = createLiveSubscription(
      `creations/${uuid}/generations`,
      creationStoreSchema,
      [],
      (data, error) => {
        // Retry if document not found and retries available
        if (error?.type === "NOT_FOUND" && retryCount < maxRetries) {
          retryCount++;
          const delay = initialDelay * Math.pow(2, retryCount - 1);
          console.log(`⏳ Document not found, retrying in ${delay}ms...`);

          retryTimeout = setTimeout(() => {
            if (currentUnsubscribe) currentUnsubscribe();
            attemptSubscription();
          }, delay);
        } else {
          // Success or final failure
          callback(data, error);
        }
      },
    );
  };

  attemptSubscription();

  // Cleanup function
  return () => {
    if (retryTimeout) clearTimeout(retryTimeout);
    if (currentUnsubscribe) currentUnsubscribe();
  };
}

export function getCreationsStatus(
  uuid: string,
  callback: (
    data: CreationStore[] | null,
    error?: FirebaseSubscriptionError,
  ) => void,
): UnsubscribeFn {
  console.log("Subscribing to creation document:", uuid);

  // Use retry version instead of direct subscription
  return getCreationsStatusWithRetry(uuid, callback);
}
