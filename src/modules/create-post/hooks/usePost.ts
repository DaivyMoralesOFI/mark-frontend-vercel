// usePost.ts
//
// This file defines the usePost custom React hook, which manages all state and actions for the post creation flow.
// It integrates with Redux for state management, handles side effects (such as fetching trends and showing success notifications),
// and provides handlers for all user interactions in the CreatePostModal and related components.
// The hook exposes state, actions, setters, and validators for use in the UI.

import { RootState } from "@/core/store/rootReducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/core/store/store";
import { CreatePostRequest, PostType } from "../types/createPostTypes";
import {
  addHashtagToDescription,
  createPost,
  fetchTrends,
  getSuggestion,
  setDescription,
  setPostType,
  setShowScheduleModal,
  setShowSuccess,
  togglePlatform,
  toggleUseBrandDna,
  setScheduledDate,
  setScheduledTime,
  resetForm,
  setSelectedAccountForPlatform,
} from "../store/createPostSlice";
import { createPostService } from "../services/createPostService";

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
export const usePost = (selectedCompanyUrl?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const postState = useSelector((state: RootState) => state.createPost);
  // Ref for the file input element (used for image upload)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado local para imágenes subidas y generadas
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [generatedImage, setGeneratedImage] = useState<Blob | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  // Fetch trends whenever there is at least one selected account for any platform
  useEffect(() => {
    const platformsWithAccounts = Object.entries(
      postState.selectedAccountsByPlatform,
    )
      .filter(([_, accounts]) => accounts.length > 0)
      .map(([platformId]) => platformId);

    // Si no hay ninguna plataforma seleccionada, limpia los trends
    if (
      postState.selectedPlatforms.length === 0 ||
      platformsWithAccounts.length === 0
    ) {
      dispatch({ type: "post/setTrends", payload: [] });
    } else {
      dispatch(fetchTrends(platformsWithAccounts));
    }
  }, [
    postState.selectedAccountsByPlatform,
    postState.selectedPlatforms,
    dispatch,
  ]);

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
  const handlePostTypeChange = (type: PostType) => {
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
   * Handler for toggling the Brand DNA flag
   */
  const handleToggleUseBrandDna = () => {
    dispatch(toggleUseBrandDna());
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
    console.log("generating suggestion");
    console.log(postState);

    if (!postState.postType || postState.selectedPlatforms.length === 0) return;

    dispatch(
      getSuggestion({
        postType: postState.postType,
        platforms: postState.selectedPlatforms,
        description: postState.description,
      }),
    );
  };

  /**
   * Handler for requesting AI image generation
   */
  const handleImageGeneration = async () => {
    console.log("generating image");
    console.log(postState);
    if (
      !postState.postType ||
      postState.selectedPlatforms.length === 0 ||
      !postState.description.trim()
    )
      return;

    setLoadingImage(true);
    try {
      const blob = await createPostService.generateImage({
        postType: postState.postType,
        platforms: postState.selectedPlatforms,
        description: postState.description,
        use_brand_dna: true,
        company_url: selectedCompanyUrl,
      });
      setGeneratedImage(blob);
    } catch (error) {
      console.error("Error generating image:", error);
      // Optionally, you could show an error notification to the user here
      setGeneratedImage(null);
    } finally {
      setLoadingImage(false);
    }
  };

  /**
   * Handler for uploading image files (multiple)
   * @param {FileList} files - The uploaded files
   */
  const handleFileUpload = (files: FileList) => {
    setUploadedImages((prev) => [...prev, ...Array.from(files)]);
  };

  /**
   * Handler for removing the current image
   * Also resets the file input value
   */
  const handleRemoveImage = () => {
    setGeneratedImage(null);
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Handler for removing a specific uploaded image
   */
  const handleRemoveUploadedImage = (file: File) => {
    setUploadedImages((prev) => prev.filter((f) => f !== file));
  };

  /**
   * Handler for submitting the post (immediate publish)
   */
  const handleSubmit = async () => {
    let imageUrls: string[] = [];
    if (uploadedImages.length > 0) {
      imageUrls = await Promise.all(
        uploadedImages.map((file) =>
          createPostService.uploadToCloudinary(file),
        ),
      );
    }
    let generatedImageUrl: string | null = null;
    if (generatedImage) {
      generatedImageUrl =
        await createPostService.uploadToCloudinary(generatedImage);
    }
    const images: string[] = [
      ...(generatedImageUrl ? [generatedImageUrl] : []),
      ...imageUrls,
    ];
    const payload: CreatePostRequest = {
      description: postState.description,
      hasImage: images.length > 0,
      images,
      use_brand_dna: postState.useBrandDna,
      company_url: selectedCompanyUrl,
    };
    await dispatch(createPost(payload));
    dispatch(resetForm());
    setGeneratedImage(null);
    setUploadedImages([]);
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

    let imageUrls: string[] = [];
    if (uploadedImages.length > 0) {
      imageUrls = await Promise.all(
        uploadedImages.map((file) =>
          createPostService.uploadToCloudinary(file),
        ),
      );
    }
    let generatedImageUrl: string | null = null;
    if (generatedImage) {
      generatedImageUrl =
        await createPostService.uploadToCloudinary(generatedImage);
    }
    const images: string[] = [
      ...(generatedImageUrl ? [generatedImageUrl] : []),
      ...imageUrls,
    ];
    const payload: CreatePostRequest = {
      description: postState.description,
      hasImage: images.length > 0,
      images,
      scheduledAt: scheduledAt.toISOString(),
      use_brand_dna: postState.useBrandDna,
      company_url: selectedCompanyUrl,
    };
    await dispatch(createPost(payload));
    dispatch(resetForm());
    setGeneratedImage(null);
    setUploadedImages([]);
  };

  /**
   * Validates if the form is ready for submission
   * @returns {boolean}
   */
  const isFormValid = () => {
    return (
      postState.postType &&
      postState.selectedPlatforms.length > 0 &&
      postState.description.trim()
    );
  };

  /**
   * Validates if the schedule fields are valid
   * @returns {boolean}
   */
  const isScheduleValid = () => {
    return isFormValid() && postState.scheduledDate && postState.scheduledTime;
  };

  /**
   * Handler para seleccionar una cuenta vinculada para una plataforma
   */
  const handleSelectAccountForPlatform = (
    platformId: string,
    accountId: string,
  ) => {
    dispatch(setSelectedAccountForPlatform({ platformId, accountId }));
    // No need to fetch trends here, useEffect will handle it
  };

  return {
    // State (spread from Redux slice)
    ...postState,
    fileInputRef,
    uploadedImages,
    generatedImage,
    loadingImage,

    // Actions
    handlePostTypeChange,
    handlePlatformToggle,
    handleToggleUseBrandDna,
    handleDescriptionChange,
    handleAddHashtag,
    handleSuggestion,
    handleImageGeneration,
    handleFileUpload,
    handleRemoveImage,
    handleRemoveUploadedImage,
    handleSubmit,
    handleSchedule,
    handleSelectAccountForPlatform,

    // Setters
    setScheduledDate: (date: Date | undefined) =>
      dispatch(setScheduledDate(date)),
    setScheduledTime: (time: string) => dispatch(setScheduledTime(time)),
    setShowScheduleModal: (show: boolean) =>
      dispatch(setShowScheduleModal(show)),

    // Validators
    isFormValid,
    isScheduleValid,
  };
};
