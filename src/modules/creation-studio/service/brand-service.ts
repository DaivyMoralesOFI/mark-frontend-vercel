import {
  BrandsResponse,
  BrandResponseSchema,
  BrandExtractorResponse,
  BrandExtractorResponseSchema,
} from "@/modules/creation-studio/schemas/brand-schema";
import { validateSchemaSoft } from "@/core/utils/schema-validator";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/core/config/firebase-database";
import { API_CLIENT, API_CONFIG } from "@/core/api/api-config";
import { isApiError } from "@/core/utils/api-error-handler";

export const getAllBrands = async (): Promise<BrandsResponse> => {
  try {
    const snapshot = await getDocs(
      collection(firestore, API_CONFIG.FIREBASE.BRANDS.list),
    );
    if (snapshot.empty) {
      return [];
    }
    const brands = snapshot.docs.map((doc) => doc.data());
    const validationResult = validateSchemaSoft(BrandResponseSchema, brands, {
      operation: "getAllBrands",
      endpoint: API_CONFIG.FIREBASE.BRANDS.list,
    }) as BrandsResponse;
    return validationResult;
  } catch (error) {
    throw error;
  }
};

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
