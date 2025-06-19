// postTypes.ts
//
// This file defines TypeScript types and interfaces for the content post module.
// It includes the shape of a Post and the response structure for fetching posts.

/**
 * Post
 * Represents a single content post with author, date, likes, text, link, and feedback.
 */
export interface Post {
    Author: string;   // Name of the post author
    Date: string;     // Date of the post
    likes: number;    // Number of likes
    Text: string;     // Main post content
    Link: string;     // URL to the original post
    Feedback: string; // Feedback or comment on the post
  }
  
/**
 * PostsResponse
 * Response structure for fetching multiple posts.
 */
export interface PostsResponse {
    posts: Post[]; // Array of post objects
  }