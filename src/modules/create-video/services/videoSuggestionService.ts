// videoSuggestionService.ts
//
// This file defines the videoSuggestionService object, which provides API methods for video prompt suggestions.
// It uses the same API structure as the post suggestion service but adapted for video prompts.

import axios from "axios";

/**
 * VideoSuggestionRequest
 * Payload for requesting an AI-generated video prompt suggestion.
 */
export interface VideoSuggestionRequest {
  seconds: string;
  user_prompt: string;
}

/**
 * VideoSuggestionResponse
 * Response from the AI suggestion endpoint.
 */
export interface VideoSuggestionResponse {
  improved_prompt?: string; // Improved video prompt from AI
  improved_promt?: string; // Support for potential typo in API response
}

/**
 * GenerateVideoRequest
 * Payload for generating a video.
 */
export interface GenerateVideoRequest {
  imageFile?: File | null;
  prompt: string;
  model: string;
  size: string;
  seconds: number;
}

/**
 * videoSuggestionService
 *
 * Provides methods to interact with the backend for:
 * - Getting AI-generated video prompt suggestions
 * - Generating videos from prompts and images
 */
export const videoSuggestionService = {
  /**
   * Get AI-generated video prompt suggestions
   * @param {VideoSuggestionRequest} data - The request data for suggestions
   * @returns {Promise<VideoSuggestionResponse>} - Suggestion response from AI
   */
  getSuggestion: async (data: VideoSuggestionRequest): Promise<VideoSuggestionResponse> => {
    const formData = new FormData();
    formData.append('seconds', data.seconds);
    formData.append('user_prompt', data.user_prompt);

    const response = await axios.post(
      'https://n8n.sofiatechnology.ai/webhook/bce175f3-c495-4dab-a562-13d91cf0815a',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  /**
   * Generate a video from a prompt and optional image
   * @param {GenerateVideoRequest} data - The request data for video generation
   * @returns {Promise<void>} - Sends the request to the webhook
   */
  generateVideo: async (data: GenerateVideoRequest): Promise<void> => {
    const formData = new FormData();

    // Add image file or empty string
    if (data.imageFile) {
      formData.append('input_reference', data.imageFile);
    } else {
      // Send empty string when no image is provided
      formData.append('input_reference', '');
    }

    // Add required fields
    formData.append('prompt', data.prompt);
    formData.append('model', data.model);
    formData.append('size', data.size); // Can be empty string if no image
    formData.append('seconds', data.seconds.toString());

    // Send POST request with FormData
    await axios.post(
      'https://n8n.sofiatechnology.ai/webhook/d192fb97-c470-4a7a-a75b-6e1601b269d4',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
