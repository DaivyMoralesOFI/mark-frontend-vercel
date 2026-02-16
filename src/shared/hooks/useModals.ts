// useModals.ts
//
// This file provides a custom React hook for managing the visibility state of modal dialogs in the application.
// It exposes functions to open and close specific modals, such as the Create Post and Ask Mark modals.

import { useState } from 'react';

/**
 * useModals
 *
 * Custom React hook to manage the open/close state of application modals.
 * Provides state and handlers for Create Post and Ask Mark modals.
 *
 * @returns {object} Modal state and handler functions
 */
export const useModals = () => {
  // State for Create Post modal visibility
  const [showCreatePost, setShowCreatePost] = useState(false);
  // State for Ask Mark modal visibility
  const [showAskMark, setShowAskMark] = useState(false);

  // Handlers to open/close each modal
  const openCreatePost = () => setShowCreatePost(true);
  const closeCreatePost = () => setShowCreatePost(false);
  
  const openAskMark = () => setShowAskMark(true);
  const closeAskMark = () => setShowAskMark(false);

  return {
    showCreatePost,
    showAskMark,
    openCreatePost,
    closeCreatePost,
    openAskMark,
    closeAskMark,
  };
};
