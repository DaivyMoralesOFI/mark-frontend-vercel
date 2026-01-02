import {z} from "zod"

export const VideoPostSchema = z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    video_url: z.string(),
    thumbnail_url: z.string()
})

export const VideoPostsResponseSchema = z.array(VideoPostSchema)


export type VideoPost = z.infer<typeof VideoPostSchema>;
export type VideoPostsResponse = z.infer<typeof VideoPostsResponseSchema>;