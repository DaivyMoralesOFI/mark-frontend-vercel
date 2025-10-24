// videoSuggestionService.ts
//
// This file defines the videoSuggestionService object, which provides API methods for video prompt suggestions.
// It uses the same API structure as the post suggestion service but adapted for video prompts.

import axios from "axios";

// Base URL for the API endpoints
const API_BASE_URL = 'https://n8n.sofiatechnology.ai/webhook';

// Axios instance configured for the API
const videoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * VideoSuggestionRequest
 * Payload for requesting an AI-generated video prompt suggestion.
 */
export interface VideoSuggestionRequest {
  prompt: string;
  model: string;
  duration: number;
}

/**
 * VideoSuggestionResponse
 * Response from the AI suggestion endpoint.
 */
export interface VideoSuggestionResponse {
  suggestion: string; // Suggested video prompt
}

/**
 * videoSuggestionService
 *
 * Provides methods to interact with the backend for:
 * - Getting AI-generated video prompt suggestions
 */
export const videoSuggestionService = {
  /**
   * Get AI-generated video prompt suggestions
   * @param {VideoSuggestionRequest} data - The request data for suggestions
   * @returns {Promise<VideoSuggestionResponse[]>} - Array of suggestion responses
   */
  getSuggestion: async (data: VideoSuggestionRequest): Promise<VideoSuggestionResponse[]> => {
    const response = await videoApi.post('/9c17dcac-abc7-4c5d-a9c2-625390fbb0fa', data);
    return response.data;
  },
};
