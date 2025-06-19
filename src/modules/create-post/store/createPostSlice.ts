// createPostSlice.ts
//
// This file defines the Redux slice for the post creation workflow, including state, reducers, and async thunks.
// It manages all state and side effects for creating, scheduling, and editing posts, as well as AI suggestions, image generation, and trends.
// The slice is used by the usePost hook and CreatePostModal UI.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreatePostRequest, ImageGenerationRequest, PostState, PostSuggestionRequest, PostType } from "../types/createPostTypes";
import { createPostService } from "../services/createPostService";

// Initial state for the post creation slice
const initialState: PostState = {
    postType: "",
    selectedPlatforms: [],
    description: "",
    hasImage: false,
    generatedImage: null,
    uploadedImage: null,
    scheduledDate: undefined,
    scheduledTime: "",
    loadingSuggestion: false,
    loadingImage: false,
    loadingSubmit: false,
    loadingSchedule: false,
    loadingTrends: false,
    showSuccess: false,
    showScheduleModal: false,
    trends: [],
  };
  
  /**
   * Async thunk to create or schedule a post
   * Calls the backend API to create the post
   */
  export const createPost = createAsyncThunk(
    'post/create',
    async (data: CreatePostRequest) => {
      await createPostService.createPost(data);
    }
  );
  
  /**
   * Async thunk to get AI-generated content suggestions
   * Calls the backend API and returns the first suggestion
   */
  export const getSuggestion = createAsyncThunk(
    'post/getSuggestion',
    async (data: PostSuggestionRequest) => {
      const response = await createPostService.getSuggestion(data);
      return response[0];
    }
  );
  
  /**
   * Async thunk to generate an image using AI
   * Calls the backend API and returns a URL for the generated image
   */
  export const generateImage = createAsyncThunk(
    'post/generateImage',
    async (data: ImageGenerationRequest) => {
      const blob = await createPostService.generateImage(data);
      return URL.createObjectURL(blob);
    }
  );
  
  /**
   * Async thunk to fetch trending hashtags for selected platforms
   * Aggregates and deduplicates hashtags from Instagram and LinkedIn
   */
  export const fetchTrends = createAsyncThunk(
    'post/fetchTrends',
    async (platforms: string[]) => {
      const requests = [];
      let hashtags: string[] = [];
  
      if (platforms.includes("instagram")) {
        requests.push(createPostService.getInstagramTrends());
      }
      if (platforms.includes("linkedin")) {
        requests.push(createPostService.getLinkedInTrends());
      }
  
      if (requests.length === 0) return [];
  
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        hashtags = hashtags.concat(response.map(item => item.Hashtags));
      });
  
      // Remove duplicates
      return Array.from(new Set(hashtags));
    }
  );
  
  /**
   * createPostSlice
   *
   * Redux slice for post creation, including reducers for all post creation state and extraReducers for async thunks.
   * Handles post type, platforms, description, images, scheduling, trends, and loading states.
   */
  const createPostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
      /** Set the post type */
      setPostType: (state, action: PayloadAction<PostType | "">) => {
        state.postType = action.payload;
      },
      /** Toggle a platform in the selected platforms array */
      togglePlatform: (state, action: PayloadAction<string>) => {
        const platformId = action.payload;
        if (state.selectedPlatforms.includes(platformId)) {
          state.selectedPlatforms = state.selectedPlatforms.filter(id => id !== platformId);
        } else {
          state.selectedPlatforms.push(platformId);
        }
      },
      /** Set the post description */
      setDescription: (state, action: PayloadAction<string>) => {
        state.description = action.payload;
      },
      /** Add a hashtag to the description if not already present */
      addHashtagToDescription: (state, action: PayloadAction<string>) => {
        const hashtag = action.payload;
        if (!state.description.includes(hashtag)) {
          state.description = state.description.trim() + (state.description.trim() ? " " : "") + hashtag;
        }
      },
      /** Set whether an image is present */
      setHasImage: (state, action: PayloadAction<boolean>) => {
        state.hasImage = action.payload;
      },
      /** Set the generated image and update image state */
      setGeneratedImage: (state, action: PayloadAction<string | null>) => {
        state.generatedImage = action.payload;
        if (action.payload) {
          state.hasImage = true;
          state.uploadedImage = null;
        }
      },
      /** Set the uploaded image and update image state */
      setUploadedImage: (state, action: PayloadAction<string | null>) => {
        state.uploadedImage = action.payload;
        if (action.payload) {
          state.hasImage = true;
          state.generatedImage = null;
        }
      },
      /** Remove any image from the state */
      removeImage: (state) => {
        state.hasImage = false;
        state.generatedImage = null;
        state.uploadedImage = null;
      },
      /** Set the scheduled date for the post */
      setScheduledDate: (state, action: PayloadAction<Date | undefined>) => {
        state.scheduledDate = action.payload;
      },
      /** Set the scheduled time for the post */
      setScheduledTime: (state, action: PayloadAction<string>) => {
        state.scheduledTime = action.payload;
      },
      /** Show or hide the schedule modal */
      setShowScheduleModal: (state, action: PayloadAction<boolean>) => {
        state.showScheduleModal = action.payload;
      },
      /** Show or hide the success notification */
      setShowSuccess: (state, action: PayloadAction<boolean>) => {
        state.showSuccess = action.payload;
      },
      /** Reset the form to its initial state */
      resetForm: (state) => {
        state.postType = "";
        state.selectedPlatforms = [];
        state.description = "";
        state.hasImage = false;
        state.generatedImage = null;
        state.uploadedImage = null;
        state.scheduledDate = undefined;
        state.scheduledTime = "";
      },
    },
    extraReducers: (builder) => {
      builder
        // Create post
        .addCase(createPost.pending, (state) => {
          state.loadingSubmit = true;
        })
        .addCase(createPost.fulfilled, (state) => {
          state.loadingSubmit = false;
          state.showSuccess = true;
        })
        .addCase(createPost.rejected, (state) => {
          state.loadingSubmit = false;
        })
        // Get suggestion
        .addCase(getSuggestion.pending, (state) => {
          state.loadingSuggestion = true;
        })
        .addCase(getSuggestion.fulfilled, (state, action) => {
          state.loadingSuggestion = false;
          if (action.payload.suggestion) {
            state.description = action.payload.suggestion;
            state.trends = action.payload.trends;
          }
        })
        .addCase(getSuggestion.rejected, (state) => {
          state.loadingSuggestion = false;
        })
        // Generate image
        .addCase(generateImage.pending, (state) => {
          state.loadingImage = true;
        })
        .addCase(generateImage.fulfilled, (state, action) => {
          state.loadingImage = false;
          state.generatedImage = action.payload;
          state.hasImage = true;
          state.uploadedImage = null;
        })
        .addCase(generateImage.rejected, (state) => {
          state.loadingImage = false;
        })
        // Fetch trends
        .addCase(fetchTrends.pending, (state) => {
          state.loadingTrends = true;
        })
        .addCase(fetchTrends.fulfilled, (state, action) => {
          state.loadingTrends = false;
          state.trends = action.payload;
        })
        .addCase(fetchTrends.rejected, (state) => {
          state.loadingTrends = false;
          state.trends = [];
        });
    },
  });
  
  export const {
    setPostType,
    togglePlatform,
    setDescription,
    addHashtagToDescription,
    setHasImage,
    setGeneratedImage,
    setUploadedImage,
    removeImage,
    setScheduledDate,
    setScheduledTime,
    setShowScheduleModal,
    setShowSuccess,
    resetForm,
  } = createPostSlice.actions;
  
  export default createPostSlice.reducer;
  