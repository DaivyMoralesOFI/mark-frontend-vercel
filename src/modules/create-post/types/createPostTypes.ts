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
  id: string; // Unique identifier for the platform
  name: string; // Display name
  logo_outline: string; // Tailwind CSS color class for UI
  logo_fill: string; // Tailwind CSS color class for UI
  color: string; // Tailwind CSS color class for UI
}

/**
 * CreatePostRequest
 * Payload for creating or scheduling a post.
 */
export interface CreatePostRequest {
  description: string;
  hasImage: boolean;
  images?: string[];
  scheduledAt?: string; // ISO string for scheduled date/time (optional)
  use_brand_dna?: boolean; // Optional - applies brand DNA (logo, colors, tone) to the post
  company_url?: string; // Optional - URL of the selected company for brand DNA
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
  trends: string[]; // Suggested hashtags/trends
}

/**
 * ImageGenerationRequest
 * Payload for requesting AI image generation.
 */
export interface ImageGenerationRequest {
  postType: string;
  platforms: string[];
  description: string;
  use_brand_dna?: boolean; // Optional - applies brand DNA (logo, colors, tone) to the image
  company_url?: string; // Optional - URL of the selected company for brand DNA
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
 * Mock: Linked accounts per platform
 */
export interface LinkedAccount {
  id: string;
  username: string;
  displayName: string;
}

export type AccountsByPlatform = {
  [platformId: string]: LinkedAccount[];
};

export type SelectedAccountsByPlatform = {
  [platformId: string]: string[]; // accountIds
};

/**
 * PostFormData
 * Shape of the form data for creating a post.
 */
export interface PostFormData {
  postType: PostType | "";
  selectedPlatforms: string[];
  useBrandDna: boolean;
  description: string;
  hasImage: boolean;
  generatedImage: Blob | null;
  uploadedImages: File[];
  scheduledDate?: Date;
  scheduledTime: string;
  selectedAccountsByPlatform: SelectedAccountsByPlatform;
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

import instagramOutline from "@/assets/logos/instagram-outline.avif";
import instagramFill from "@/assets/logos/instagram-fillment.avif";
import twitterOutline from "@/assets/logos/x-outline.avif";
import twitterFill from "@/assets/logos/x-fillment.avif";
import facebookOutline from "@/assets/logos/facebook-outline.avif";
import facebookFill from "@/assets/logos/facebook-fillment.avif";
import linkedinOutline from "@/assets/logos/linkedin-outline.avif";
import linkedinFill from "@/assets/logos/linkedin-fillment.avif";
import tiktokOutline from "@/assets/logos/tiktok-outline.avif";
import tiktokFill from "@/assets/logos/tiktok-fillment.avif";

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    logo_outline: instagramOutline,
    logo_fill: instagramFill,
    color: "bg-pink-500",
  },
  /*{ 
    id: "twitter",
    name: "Twitter",
    logo_outline: twitterOutline,
    logo_fill: twitterFill,
    color: "bg-blue-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    logo_outline: facebookOutline,
    logo_fill: facebookFill,
    color: "bg-blue-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo_outline: linkedinOutline,
    logo_fill: linkedinFill,
    color: "bg-blue-700",
  },
  {
    id: "tiktok",
    name: "TikTok",
    logo_outline: tiktokOutline,
    logo_fill: tiktokFill,
    color: "bg-black",
  }, */
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
