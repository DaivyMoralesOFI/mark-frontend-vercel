import {
  AllBrands,
  AllBrandsResponse,
} from "@/modules/creation-studio/schemas/brand-schema";
import { validateSchemaSoft } from "@/core/utils/schema-validator";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/core/config/firebase-database";
import { API_CONFIG } from "@/core/api/api-config";

export const getAllBrands = async (): Promise<AllBrandsResponse> => {
  try {
    const snapshot = await getDocs(
      collection(firestore, API_CONFIG.FIREBASE.BRANDS.list),
    );
    if (snapshot.empty) {
      return [];
    }
    const brands = snapshot.docs.map((doc) => doc.data());
    const validationResult = validateSchemaSoft(AllBrands, brands, {
      operation: "getAllBrands",
      endpoint: API_CONFIG.FIREBASE.BRANDS.list,
    }) as AllBrandsResponse;
    return validationResult;
  } catch (error) {
    throw error;
  }
};
