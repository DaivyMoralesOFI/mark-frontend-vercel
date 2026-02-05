import { useState, useEffect } from "react";
import { UserProfile } from "../schemas/user-schema";
import { UserService } from "../services/user-service";

/**
 * useUser
 * Custom hook that provides access to the user profile data from Firestore.
 * 
 * @param userId Optional user ID to fetch. Defaults to 'profile' or an authenticated user ID.
 * @returns {Object} - User data, loading state, and error
 */
export const useUser = (userId: string = "profile") => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await UserService.getUserProfile(userId);
                if (isMounted) {
                    setUser(userData);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to fetch user");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return {
        user,
        loading,
        error,
        refreshUser: async () => {
            setLoading(true);
            try {
                const userData = await UserService.getUserProfile(userId);
                setUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        }
    };
};
