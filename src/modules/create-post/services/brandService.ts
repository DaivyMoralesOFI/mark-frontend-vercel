import {
  BrandsResponse,
  BrandResponseSchema,
  BrandExtractorResponse,
  BrandExtractorResponseSchema,
  BrandExtractor,
  BrandExtractorSchema,
} from "@/modules/create-post/schemas/BrandSchema";
import { validateSchemaSoft } from "@/core/lib/schemaValidator";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/core/config/firebase-database";
import { API_CLIENT, API_CONFIG } from "@/core/api/apiConfig";
import { isApiError } from "@/core/lib/apiErrorHandler";

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

export const getActiveBrand = async (): Promise<BrandExtractor | null> => {
  try {
    const snapshot = await getDocs(
      query(
        collection(firestore, API_CONFIG.FIREBASE.BRANDS.list),
        where("isActive", "==", true),
        limit(1),
      ),
    );
    if (snapshot.empty) {
      return null;
    }
    const brandData = snapshot.docs[0].data();
    const validationResult = validateSchemaSoft(
      BrandExtractorSchema,
      brandData,
      {
        operation: "getActiveBrand",
        endpoint: API_CONFIG.FIREBASE.BRANDS.list,
      },
    ) as BrandExtractor;
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

export const setNewBrand = async (brand: BrandExtractor) => {
  try {
    const result = await addDoc(
      collection(firestore, API_CONFIG.FIREBASE.BRANDS.setBrand),
      brand,
    );
    const doc_id = result.id;
    await updateDoc(
      doc(firestore, API_CONFIG.FIREBASE.BRANDS.setBrand, doc_id),
      { id: doc_id },
    ).then(() => {
      console.log("Document successfully updated!");
    });
  } catch (error) {
    console.error("❌ Failed to create brand extractor:", {
      operation: "setBrandExtractor",
      brand,
      error: error,
    });
  }
};
