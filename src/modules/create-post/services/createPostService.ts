// createPostService.ts
//
// This file defines the createPostService object, which provides API methods for post creation, AI suggestions, image generation, and trend retrieval.
// It uses Axios for HTTP requests and is designed to interact with backend endpoints for the post creation workflow.
// All methods return Promises and are intended for use in the Create Post module.

import axios from "axios";
import { CreatePostRequest, ImageGenerationRequest, PostSuggestionRequest, PostSuggestionResponse, TrendItem } from "../types/createPostTypes";

// Base URL for the API endpoints
const API_BASE_URL = 'https://n8n.sofiatechnology.ai/webhook';

// Axios instance configured for the API
const postApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
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
    await postApi.post('/43be9fa5-4ef6-44b2-a856-73907cf112c5', data);
  },

  /**
   * Get AI-generated content suggestions for a post
   * @param {PostSuggestionRequest} data - The request data for suggestions
   * @returns {Promise<PostSuggestionResponse[]>} - Array of suggestion responses
   */
  getSuggestion: async (data: PostSuggestionRequest): Promise<PostSuggestionResponse[]> => {
    const response = await postApi.post('/9c17dcac-abc7-4c5d-a9c2-625390fbb0fa', data);
    return response.data;
  },

  /**
   * Generate an image using AI
   * @param {ImageGenerationRequest} data - The request data for image generation
   * @returns {Promise<Blob>} - The generated image as a Blob
   */
  generateImage: async (data: ImageGenerationRequest): Promise<Blob> => {
    const response = await postApi.post('/0bfe57a1-076f-4a49-80b5-3513c0f53524', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get trending hashtags for Instagram
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getInstagramTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get('/e44dfb4d-a80c-4050-90c0-c90271cbb8cd');
    return response.data;
  },

  /**
   * Get trending hashtags for LinkedIn
   * @returns {Promise<TrendItem[]>} - Array of trending hashtags
   */
  getLinkedInTrends: async (): Promise<TrendItem[]> => {
    const response = await postApi.get('/cf9342f3-c24d-4fd6-a677-53389bd7cc49');
    return response.data;
  },
};