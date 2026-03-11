// postTypes.ts
//
// This file defines TypeScript types and interfaces for the content post module.
// It includes the shape of a Post and the response structure for fetching posts.

/**
 * Post
 * Represents a single content post for the UI.
 */
export interface Post {
  id: string;
  title: string;
  date: Date;
  time: string;
  platforms: string[];
  imageUrl: string;
  status: string;
  copy: string;
  post_type?: string;
  created_at?: Date;
}

/**
 * PostsResponse
 * Response structure for fetching multiple posts.
 */
export interface PostsResponse {
  posts: Post[]; // Array of post objects
}