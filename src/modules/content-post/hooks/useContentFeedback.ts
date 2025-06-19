// useContentFeedback.ts
//
// This file defines the useContentFeedback custom React hook, which manages fetching and error handling for content posts.
// It integrates with Redux for state management and provides state and actions for use in content feedback UIs.

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, clearError } from '../store/postSlice';
import { AppDispatch } from '@/core/store/store';
import { RootState } from '@/core/store/rootReducer';

/**
 * useContentFeedback
 *
 * Custom hook that manages fetching posts and error handling for content feedback.
 * Integrates with Redux for state management and provides:
 * - posts: Array of post objects
 * - loading: Loading state for fetching posts
 * - error: Error state for fetching posts
 * - clearError: Function to clear the error state
 *
 * Used in content post modules to provide post data and error handling to components.
 */
export const useContentFeedback = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Select posts, loading, and error state from Redux
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /**
   * Clears the error state in Redux
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    posts,
    loading,
    error,
    clearError: handleClearError,
  };
};
