// postService.ts
//
// This file defines the PostService class, which provides methods to fetch content posts from the backend or a static file.
// It is used by the Redux slice and hooks to load post data for the content post module.

import axios from "axios";
import { PostsResponse } from "../types/PostTypes";
import { VideoPostsResponse } from "../schemas/VideoPosts.schemas";

const API_BASE_URL = "https://n8n.sofiatechnology.ai/webhook";
const apliClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class PostService {
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
