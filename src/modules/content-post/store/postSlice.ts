// postSlice.ts
//
// This file defines the Redux slice for managing content posts, including state, reducers, and async thunks.
// It handles loading, error, and post data for the content post module.

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../types/postTypes";
import { PostService } from "../services/postService";

/**
 * PostState
 * Redux state shape for the content post slice.
 */
interface PostState {
    posts: Post[];         // Array of post objects
    loading: boolean;      // Loading state for fetching posts
    error: string | null;  // Error message if fetching fails
  }
  
// Initial state for the content post slice
const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
};

/**
 * Async thunk to fetch posts from the backend or static file.
 * Handles errors and returns post data or error message.
 */
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      return await PostService.getPosts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

/**
 * postSlice
 *
 * Redux slice for content posts, including reducers for error handling and extraReducers for async thunks.
 * Handles loading, error, and post data state.
 */
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    /**
     * Clears the error state.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPosts async thunk
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer;
  