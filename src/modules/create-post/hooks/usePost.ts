// usePost.ts
//
// This file defines the usePost custom React hook, which manages all state and actions for the post creation flow.
// It integrates with Redux for state management, handles side effects (such as fetching trends and showing success notifications),
// and provides handlers for all user interactions in the CreatePostModal and related components.
// The hook exposes state, actions, setters, and validators for use in the UI.

import { RootState } from "@/core/store/rootReducer";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/core/store/store";
import { CreatePostRequest, PostType } from "../types/createPostTypes";
import { addHashtagToDescription, createPost, fetchTrends, generateImage, getSuggestion, removeImage, setDescription, setPostType, setShowScheduleModal, setShowSuccess, setUploadedImage, togglePlatform, setScheduledDate, setScheduledTime, resetForm } from "../store/createPostSlice";

/**
 * usePost
 *
 * Custom hook that manages all state and actions for creating a post.
 * Integrates with Redux for state management and provides handlers for:
 * - Post type selection
 * - Platform selection
 * - Description input and hashtag addition
 * - AI suggestion and image generation
 * - Image upload and removal
 * - Post submission and scheduling
 * - Form and schedule validation
 *
 * Also handles side effects such as fetching trends when platforms change and showing success notifications.
 * Returns all state, actions, setters, and validators needed for the post creation UI.
 */
export const usePost = () => {
    const dispatch = useDispatch<AppDispatch>();
    const postState = useSelector((state: RootState) => state.createPost);
    // Ref for the file input element (used for image upload)
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    // Fetch trends whenever the selected platforms change
    useEffect(() => {
      if (postState.selectedPlatforms.length > 0) {
        dispatch(fetchTrends(postState.selectedPlatforms));
      }
    }, [postState.selectedPlatforms, dispatch]);
  
    // Handle hiding the success notification after a timeout
    useEffect(() => {
      if (postState.showSuccess) {
        const timer = setTimeout(() => {
          dispatch(setShowSuccess(false));
          dispatch(setShowScheduleModal(false));
        }, 2500);
        return () => clearTimeout(timer);
      }
    }, [postState.showSuccess, dispatch]);
  
    /**
     * Handler for changing the post type
     * @param {PostType | ""} type - The new post type
     */
    const handlePostTypeChange = (type: PostType | "") => {
      dispatch(setPostType(type));
    };
  
    /**
     * Handler for toggling a platform selection
     * @param {string} platformId - The platform ID to toggle
     */
    const handlePlatformToggle = (platformId: string) => {
      dispatch(togglePlatform(platformId));
    };
  
    /**
     * Handler for changing the post description
     * @param {string} description - The new description
     */
    const handleDescriptionChange = (description: string) => {
      dispatch(setDescription(description));
    };
  
    /**
     * Handler for adding a hashtag to the description
     * @param {string} hashtag - The hashtag to add
     */
    const handleAddHashtag = (hashtag: string) => {
      dispatch(addHashtagToDescription(hashtag));
    };
  
    /**
     * Handler for requesting an AI-generated suggestion for the description
     */
    const handleSuggestion = async () => {
      if (!postState.postType || postState.selectedPlatforms.length === 0) return;
      
      dispatch(getSuggestion({
        postType: postState.postType,
        platforms: postState.selectedPlatforms,
        description: postState.description,
      }));
    };
  
    /**
     * Handler for requesting AI image generation
     */
    const handleImageGeneration = async () => {
      if (!postState.postType || 
          postState.selectedPlatforms.length === 0 || 
          !postState.description.trim()) return;
      
      dispatch(generateImage({
        postType: postState.postType,
        platforms: postState.selectedPlatforms,
        description: postState.description,
      }));
    };
  
    /**
     * Handler for uploading an image file
     * @param {File} file - The uploaded file
     */
    const handleFileUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setUploadedImage(e.target?.result as string));
      };
      reader.readAsDataURL(file);
    };
  
    /**
     * Handler for removing the current image
     * Also resets the file input value
     */
    const handleRemoveImage = () => {
      dispatch(removeImage());
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  
    /**
     * Handler for submitting the post (immediate publish)
     */
    const handleSubmit = async () => {
      const payload: CreatePostRequest = {
        description: postState.description,
        hasImage: !!(postState.generatedImage || postState.uploadedImage),
      };
  
      await dispatch(createPost(payload));
      dispatch(resetForm());
    };
  
    /**
     * Handler for scheduling the post for a future date/time
     */
    const handleSchedule = async () => {
      if (!postState.scheduledDate || !postState.scheduledTime) return;
  
      const [hours, minutes] = postState.scheduledTime.split(":").map(Number);
      const scheduledAt = new Date(postState.scheduledDate);
      scheduledAt.setHours(hours);
      scheduledAt.setMinutes(minutes);
      scheduledAt.setSeconds(0);
      scheduledAt.setMilliseconds(0);
  
      const payload: CreatePostRequest = {
        description: postState.description,
        hasImage: !!(postState.generatedImage || postState.uploadedImage),
        scheduledAt: scheduledAt.toISOString(),
      };
  
      await dispatch(createPost(payload));
      dispatch(resetForm());
    };
  
    /**
     * Validates if the form is ready for submission
     * @returns {boolean}
     */
    const isFormValid = () => {
      return postState.postType && 
             postState.selectedPlatforms.length > 0 && 
             postState.description.trim();
    };
  
    /**
     * Validates if the schedule fields are valid
     * @returns {boolean}
     */
    const isScheduleValid = () => {
      return isFormValid() && postState.scheduledDate && postState.scheduledTime;
    };
  
    return {
      // State (spread from Redux slice)
      ...postState,
      fileInputRef,
      
      // Actions
      handlePostTypeChange,
      handlePlatformToggle,
      handleDescriptionChange,
      handleAddHashtag,
      handleSuggestion,
      handleImageGeneration,
      handleFileUpload,
      handleRemoveImage,
      handleSubmit,
      handleSchedule,
      
      // Setters
      setScheduledDate: (date: Date | undefined) => dispatch(setScheduledDate(date)),
      setScheduledTime: (time: string) => dispatch(setScheduledTime(time)),
      setShowScheduleModal: (show: boolean) => dispatch(setShowScheduleModal(show)),
      
      // Validators
      isFormValid,
      isScheduleValid,
    };
  };
  