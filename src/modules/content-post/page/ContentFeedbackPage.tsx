// ContentFeedbackPage.tsx
//
// This file defines the ContentFeedbackPage component, which serves as the main page for viewing and managing content posts and feedback.
// It integrates with the content post module's hooks, components, and modals, and provides actions for creating posts and interacting with the AI assistant.
// The page handles loading and error states, and displays a grid of posts with options to create new posts or ask for AI feedback.

import { MessageCircle, Plus } from "lucide-react";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { AppHeaderActions } from "@/shared/types/types";
import { useContentFeedback } from "../hooks/useContentFeedback";
import { useModals } from "@/core/hooks/useModals";
import { LoadingState } from "@/shared/components/loading-state/LoadingState";
import { ErrorState } from "@/shared/components/error-state/ErrorState";
import { PostGrid } from "../components/PostGrid";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";

/**
 * ContentFeedbackPage
 *
 * Main page for displaying content posts and feedback.
 * - Shows a grid of posts with feedback and like counts
 * - Provides actions to create a new post or ask the AI assistant (Mark)
 * - Handles loading and error states
 * - Integrates with modals for post creation and AI chat
 */
export default function ContentFeedbackPage() {
  // Fetch posts, loading, and error state from the custom hook
  const { posts, loading, error } = useContentFeedback();
  // Modal state and handlers from the useModals hook
  const {
    showCreatePost,
    showAskMark,
    openCreatePost,
    closeCreatePost,
    openAskMark,
    closeAskMark,
  } = useModals();

  // Define header actions for the page (create post, ask Mark)
  const pageActions: AppHeaderActions[] = [
    {
      label: "Create Post",
      icon: Plus,
      onClick: openCreatePost,
      variant: "default",
    },
    {
      label: "Ask Mark",
      icon: MessageCircle,
      onClick: openAskMark,
      variant: "secondary",
    },
  ];

  // Show loading or error state if needed
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      {/* Main layout with page title and actions */}
      <PageOutletLayout pageTitle="Content Feedback" actions={pageActions}>
        {/* Grid of posts with feedback */}
        <PostGrid posts={posts} />
      </PageOutletLayout>
      {/* Modal for creating a new post */}
      <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
      {/* Modal for interacting with the AI assistant */}
      <AiChatModal isOpen={showAskMark} onClose={closeAskMark} />
    </>
  );
}