import z from "zod";

/**
 * UserProfile Schema
 * Matches the actual structure from Firestore.
 */
export const user_schema = z.object({
    id: z.string(),
    user_name: z.string().optional(),
    job_title: z.string().optional(),
    photo_url: z.string().url("Photo must be a valid URL").or(z.string().length(0)).optional(),
    email: z.string().email("Invalid email address").optional(),
    is_active: z.boolean().optional(),
    timezone: z.string().optional(),
    // Timestamps are generic objects for now to simplify
    created_at: z.any().optional(),
    updated_at: z.any().optional(),
    last_login: z.any().optional(),
});

export type UserProfile = z.infer<typeof user_schema>;
