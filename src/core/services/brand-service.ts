import { firestore } from "../config/firebase-database";
import { brand_response_schema, BrandResponse } from "../schemas/brand-schema";
import { getDocs, query, collection } from "firebase/firestore";

export async function getAllBrands(): Promise<BrandResponse | null> {
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

    const result = brand_response_schema.safeParse(rawData);
    if (!result.success) {
      console.error(
        "❌ [getAllBrands] Validation error details:",
        result.error.format(),
      );
      throw new Error(
        `Schema validation failed for brands: ${result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
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
