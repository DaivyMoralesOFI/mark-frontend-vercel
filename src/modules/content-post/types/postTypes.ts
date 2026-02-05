// postTypes.ts
//
// This file defines TypeScript types and interfaces for the content post module.
// It includes the shape of a Post and the response structure for fetching posts.

/**
 * FirebasePost
 * Represents a post as stored in Firebase Firestore.
 */
export interface FirebasePost {
  brand_uuid: string;
  copy: string;
  created_at: any; // Firebase Timestamp
  executed_at: any; // Firebase Timestamp
  media_url: string;
  platforms: string[];
  post_type: string;
  scheduled_date: any; // Firebase Timestamp
  status: string;
  updated_at: any; // Firebase Timestamp
}

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