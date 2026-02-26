// postService.ts
//
// This file defines the PostService class, which provides methods to fetch content posts from the backend or a static file.
// It is used by the Redux slice and hooks to load post data for the content post module.

import axios from "axios";
import { Post, PostsResponse, FirebasePost } from "../types/PostTypes";
import { VideoPostsResponse } from "../schemas/VideoPosts.schemas";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/core/config/firebase-database";

const API_BASE_URL = "https://n8n.sofiatechnology.ai/webhook";
const apliClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class PostService {
  /**
   * Fetches posts from Firestore.
   * @returns {Promise<Post[]>} Array of post objects
   */
  static async getFirebasePosts(): Promise<Post[]> {
    try {
      const postsCollection = collection(firestore, "post");
      const postsSnapshot = await getDocs(postsCollection);

      return postsSnapshot.docs.map(doc => {
        const data = doc.data() as FirebasePost;

        // Convert Firebase Timestamp to Date
        const scheduledDate = data.scheduled_date?.toDate ? data.scheduled_date.toDate() : new Date();

        return {
          id: doc.id,
          title: data.copy ? data.copy.substring(0, 50) + (data.copy.length > 50 ? "..." : "") : "No Title",
          date: scheduledDate,
          time: scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          platforms: data.platforms || [],
          imageUrl: data.media_url || "",
          status: data.status,
          copy: data.copy,
          post_type: data.post_type,
          created_at: data.created_at?.toDate ? data.created_at.toDate() : undefined
        };
      });
    } catch (error) {
      console.error("Error fetching firebase posts:", error);
      throw new Error("Failed to load posts from Firebase");
    }
  }

  /**
   * Fetches posts from the backend or a static JSON file.
   * @deprecated Use getFirebasePosts instead
   */
  static async getPosts(): Promise<any[]> {
    try {
      const response = await axios.get<PostsResponse>("/posts.json");
      return response.data.posts;
    } catch (error) {
      console.log({ error });
      throw new Error("Failed to load posts");
    }
  }

  static async getVideoPost(): Promise<VideoPostsResponse> {
    try {
      const response = await apliClient.get<VideoPostsResponse>("/videos");
      return response.data;
    } catch (error) {
      console.log({ error });
      throw new Error("Failed to load posts");
    }
  }
}