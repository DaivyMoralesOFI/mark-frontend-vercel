import { firestore } from "../config/firebase-database";
import { brand_response_schema, BrandResponse } from "../schemas/brand-schema";
import { getDocs, query, collection } from "firebase/firestore";

export async function getAllBrands(): Promise<BrandResponse | null> {
  const snapshot = await getDocs(query(collection(firestore, "brands")));
  console.log(snapshot.size);

  if (snapshot.empty) {
    console.log(`No brands found`);
    return null;
  }

  console.log("First doc data:", snapshot.docs[0].data());
  console.log("First doc ID:", snapshot.docs[0].id);

  const result = brand_response_schema.safeParse(
    snapshot.docs.map((doc) => ({ ...doc.data(), uuid: doc.id })),
  );
  if (!result.success) {
    console.error("Validation error details:", result.error.format());
    throw new Error(
      `Schema validation failed for brands: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`,
    );
  }

  return result.data;
}
