import { API_CLIENT, API_CONFIG } from "@/core/api/api-config";
import { validateSchemaSoft } from "@/core/utils/schema-validator";
import {
  CreateImageResponse,
  createImageResponseSchema,
  CreationStore,
  creationStoreSchema,
  GetCreatedImage,
  getCreatedImageSchema,
} from "../schemas/create-image";
import { isApiError } from "@/core/utils/api-error-handler";
import { CreateImage } from "../schemas/create-image";
import {
  createLiveSubscription,
  UnsubscribeFn,
  FirebaseSubscriptionError,
} from "./firebase-services";

export const setCreateImage = async (
  image_schema: CreateImage,
): Promise<CreateImageResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.CREATION_STUDIO.createImage;
    console.log(endpoint);

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
      `creations/${uuid}`,
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
