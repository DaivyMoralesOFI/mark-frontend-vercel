// createPostTypes.ts
//
// This file defines TypeScript types, interfaces, and constants for the post creation module.
// It includes types for platforms, post requests, AI suggestions, image generation, trends, and the Redux state shape.
// These types are used throughout the Create Post feature for type safety and clarity.

/**
 * Platform
 * Represents a social media platform option for posting.
 */
export interface Platform {
    id: string;      // Unique identifier for the platform
    name: string;    // Display name
    color: string;   // Tailwind CSS color class for UI
  }
  
/**
 * CreatePostRequest
 * Payload for creating or scheduling a post.
 */
  export interface CreatePostRequest {
    description: string;
    hasImage: boolean;
    scheduledAt?: string; // ISO string for scheduled date/time (optional)
  }
  
/**
 * PostSuggestionRequest
 * Payload for requesting an AI-generated post suggestion.
 */
  export interface PostSuggestionRequest {
    postType: string;
    platforms: string[];
    description: string;
  }
  
/**
 * PostSuggestionResponse
 * Response from the AI suggestion endpoint.
 */
  export interface PostSuggestionResponse {
    suggestion: string; // Suggested post content
    trends: string[];   // Suggested hashtags/trends
  }
  
/**
 * ImageGenerationRequest
 * Payload for requesting AI image generation.
 */
  export interface ImageGenerationRequest {
    postType: string;
    platforms: string[];
    description: string;
  }
  
/**
 * TrendItem
 * Represents a trending hashtag item from the backend.
 */
  export interface TrendItem {
    Hashtags: string;
  }
  
/**
 * PostType
 * Union type for allowed post types.
 */
  export type PostType = 
    | "promotional" 
    | "educational" 
    | "entertainment" 
    | "announcement" 
    | "user-generated";
  
/**
 * PostFormData
 * Shape of the form data for creating a post.
 */
  export interface PostFormData {
    postType: PostType | "";
    selectedPlatforms: string[];
    description: string;
    hasImage: boolean;
    generatedImage: string | null;
    uploadedImage: string | null;
    scheduledDate?: Date;
    scheduledTime: string;
  }
  
/**
 * PostState
 * Redux state shape for the post creation slice.
 * Extends PostFormData with additional UI and loading state.
 */
  export interface PostState extends PostFormData {
    loadingSuggestion: boolean;
    loadingImage: boolean;
    loadingSubmit: boolean;
    loadingSchedule: boolean;
    loadingTrends: boolean;
    showSuccess: boolean;
    showScheduleModal: boolean;
    trends: string[];
  }
  
/**
 * PLATFORMS
 * List of supported social media platforms for posting.
 */
  export const PLATFORMS: Platform[] = [
    { id: "instagram", name: "Instagram", color: "bg-pink-500" },
    { id: "twitter", name: "Twitter", color: "bg-blue-500" },
    { id: "facebook", name: "Facebook", color: "bg-blue-600" },
    { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
    { id: "tiktok", name: "TikTok", color: "bg-black" },
  ];
  
/**
 * POST_TYPES
 * List of available post types for the user to select.
 */
  export const POST_TYPES = [
    { value: "promotional", label: "Promotional" },
    { value: "educational", label: "Educational" },
    { value: "entertainment", label: "Entertainment" },
    { value: "announcement", label: "Announcement" },
    { value: "user-generated", label: "User Generated Content" },
  ];
  
/**
 * MAX_DESCRIPTION_LENGTH
 * Maximum allowed length for the post description.
 */
  export const MAX_DESCRIPTION_LENGTH = 1000;