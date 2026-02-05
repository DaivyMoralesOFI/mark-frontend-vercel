// createPostService.ts
//
// This file defines the createPostService object, which provides API methods for post creation, AI suggestions, image generation, and trend retrieval.
// It uses Axios for HTTP requests and is designed to interact with backend endpoints for the post creation workflow.
// All methods return Promises and are intended for use in the Create Post module.

import axios from "axios";
import {
  CreatePostRequest,
  ImageGenerationRequest,
  PostSuggestionRequest,
  PostSuggestionResponse,
  TrendItem,
} from "../types/createPostTypes";

// Base URL for the API endpoints
const API_BASE_URL = "https://n8n.sofiatechnology.ai/webhook";

// Axios instance configured for the API
const postApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * createPostService
 *
 * Provides methods to interact with the backend for:
 * - Creating or scheduling posts
 * - Getting AI-generated content suggestions
 * - Generating images with AI
 * - Fetching trending hashtags for Instagram and LinkedIn
 */
export const createPostService = {
  /**
   * Create or schedule a post
   * @param {CreatePostRequest} data - The post data to send
   * @returns {Promise<void>}
   */
  createPost: async (data: CreatePostRequest): Promise<void> => {
    await postApi.post("/43be9fa5-4ef6-44b2-a856-73907cf112c5", data);
  },

  /**
   * Get AI-generated content suggestions for a post
   * @param {PostSuggestionRequest} data - The request data for suggestions
   * @returns {Promise<PostSuggestionResponse[]>} - Array of suggestion responses
   */
  getSuggestion: async (
    data: PostSuggestionRequest,
  ): Promise<PostSuggestionResponse[]> => {
    console.log(data);
    const response = await postApi.post(
      "/9c17dcac-abc7-4c5d-a9c2-625390fbb0fa",
      data,
    );
    console.log(response.data);

    return response.data;
  },

  /**
   * Generate an image using AI
   * @param {ImageGenerationRequest} data - The request data for image generation
   * @returns {Promise<Blob>} - The generated image as a Blob
   */
  generateImage: async (data: ImageGenerationRequest): Promise<Blob> => {
    console.log("generating image");
    console.log(data);
    const endpoint = data.use_brand_dna
      ? "/create-image"
      : "/0bfe57a1-076f-4a49-80b5-3513c0f53524";

    if (data.use_brand_dna) {
      // When Brand DNA is enabled, the endpoint returns JSON with a URL
      const response = await postApi.post(endpoint, data, {
        responseType: "json",
      });

      // Extract the URL from the response
      const imageUrl = response.data["url-logo"];
      if (!imageUrl) {
        throw new Error("No image URL found in response");
      }

      // Download the image from the URL and convert it to a Blob
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch image from URL: ${imageResponse.statusText}`,
        );
      }

      const blob = await imageResponse.blob();
      return blob;
    } else {
      // When Brand DNA is disabled, the endpoint returns a blob directly
      const response = await postApi.post(endpoint, data, {
        responseType: "blob",
      });
      return response.data;
    }
  },

  /**
   * Get trending hashtags for Instagram
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getInstagramTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get("/e44dfb4d-a80c-4050-90c0-c90271cbb8cd");
    return response.data;
  },

  /**
   * Get trending hashtags for LinkedIn
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getLinkedInTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get("/cf9342f3-c24d-4fd6-a677-53389bd7cc49");
    return response.data;
  },

  /**
   * Get trending hashtags for TikTok
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getTikTokTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get("/3224401f-49ba-4317-94c2-68594728e451");
    return response.data;
  },
  /**
   * Get trending hashtags for Twitter
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getXTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get("/aa47f758-048d-4414-81d2-46d4e1ff422a");
    return response.data;
  },

  /**
   * Sube una imagen a Cloudinary y retorna la URL pública
   * @param {Blob} file - El archivo de imagen a subir
   * @returns {Promise<string>} - URL pública de la imagen en Cloudinary
   */
  uploadToCloudinary: async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mark_cloudinary");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dz7zt5ump/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    return data.secure_url; // URL pública de la imagen
  },
};
