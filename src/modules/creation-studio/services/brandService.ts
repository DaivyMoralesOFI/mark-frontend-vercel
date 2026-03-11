import {
  BrandExtractorResponse,
  BrandExtractorResponseSchema,
} from "@/modules/creation-studio/schemas/BrandSchema";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import { API_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import { isApiError } from "@/core/lib/apiErrorHandler";

export const setBrandExtractor = async (
  target_url: string,
): Promise<BrandExtractorResponse> => {
  try {
    const endpoint = API_CONFIG.ENDPOINTS.BRAND_EXTRACTOR.brandExtractor;
    const response = await API_CLIENT.post(endpoint, { target_url });
    const validationResult = validateSchemaSoft(
      BrandExtractorResponseSchema,
      response.data,
      {
        operation: "setBrandExtractor",
        endpoint: endpoint,
      },
    ) as BrandExtractorResponse;
    return validationResult;
  } catch (error) {
    if (isApiError(error)) {
      console.error("❌ API Error fetching candidate:", {
        target_url,
        type: error.type,
        message: error.userMessage,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw new Error(error.userMessage);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Failed to create brand extractor:", {
      operation: "setBrandExtractor",
      target_url,
      error: errorMessage,
    });

    throw new Error(
      `Failed to create brand extractor ${target_url}: ${errorMessage}`,
    );
  }
};
