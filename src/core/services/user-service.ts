import { firestore } from "../config/firebase-database";
import { user_schema, UserProfile } from "../schemas/user-schema";
import { doc, getDoc } from "firebase/firestore";

/**
 * UserService
 * Provides methods to fetch and manage user data from Firestore.
 */
export class UserService {
    /**
     * Fetches a user profile from Firestore by document ID.
     * @param userId The ID of the user document (or 'profile' if using a specific doc)
     * @returns {Promise<UserProfile | null>} The validated user profile or null if not found
     */
    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const userDocRef = doc(firestore, "users", userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                console.warn(`User document with ID ${userId} not found in Firestore`);
                return null;
            }

            const data = { ...userSnapshot.data(), id: userSnapshot.id };

            const result = user_schema.safeParse(data);

            if (!result.success) {
                console.error("User validation error:", result.error.format());
                throw new Error(
                    `Schema validation failed for user: ${result.error.issues
                        .map((i) => `${i.path.join(".")}: ${i.message}`)
                        .join(", ")}`,
                );
            }

            return result.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }
}
