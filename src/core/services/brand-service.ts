import { firestore } from "../config/firebase-database";
import {
  BrandResponseSchema,
  BrandsResponse,
} from "../../modules/creation-studio/schemas/brand-schema";
import { getDocs, query, collection } from "firebase/firestore";

export async function getAllBrands(): Promise<BrandsResponse | null> {
  try {
    console.log("📋 [getAllBrands] Starting brands fetch...");

    const brandsCollection = collection(firestore, "brands");
    const q = query(brandsCollection);

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ [getAllBrands] No brands found in Firestore");
      return null;
    }

    const rawData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uuid: doc.id,
    }));

    const result = BrandResponseSchema.safeParse(rawData);
    if (!result.success) {
      console.error(
        "❌ [getAllBrands] Validation error details:",
        result.error.format(),
      );
      throw new Error(
        `Schema validation failed for brands: ${result.error.issues
          .map((i: any) => `${i.path.join(".")}: ${i.message}`)
          .join(", ")}`,
      );
    }

    return result.data;
  } catch (error: any) {
    console.error("❌ [getAllBrands] Error occurred:", error);
    console.error("❌ [getAllBrands] Error code:", error.code);
    console.error("❌ [getAllBrands] Error message:", error.message);
    console.error("❌ [getAllBrands] Full error:", error);
    throw error;
  }
}
