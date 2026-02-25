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
    /**
     * Creates a new user profile in Firestore.
     * @param userId The ID of the user document (from Firebase Auth)
     * @param email The user's email address
     * @param displayName The user's display name (optional)
     * @param photoURL The user's profile photo URL (optional)
     */
    static async createUserProfile(userId: string, email: string, displayName?: string, photoURL?: string): Promise<void> {
        try {
            const userDocRef = doc(firestore, "users", userId);
            const now = new Date();

            const newUser: UserProfile = {
                id: userId,
                email: email,
                user_name: displayName || email.split('@')[0], // Default username from email if not provided
                photo_url: photoURL || "",
                is_active: true,
                created_at: now,
                updated_at: now,
                last_login: now,
                job_title: "Mark User", // Default job title
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            // Using setDoc to create or overwrite. Since it is a new registration, it should be fine.
            const { setDoc } = await import("firebase/firestore");
            await setDoc(userDocRef, newUser);

            console.log(`User profile created for ID: ${userId}`);
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    }
}
