// ContentFeedbackPage.tsx
//
// This file defines the ContentFeedbackPage component, which serves as the main page for viewing and managing content posts and feedback.
// It integrates with the content post module's hooks, components, and modals, and provides actions for creating posts and interacting with the AI assistant.
// The page handles loading and error states, and displays a grid of posts with options to create new posts or ask for AI feedback.

import { MessageCircle, Plus, LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Actions } from "@/shared/types/types";
import { useContentFeedback } from "../hooks/useContentFeedback";
import { useModals } from "@/core/hooks/useModals";
import { LoadingState } from "@/shared/components/loading-state/LoadingState";
import { ErrorState } from "@/shared/components/error-state/ErrorState";
import { PostGrid } from "../components/PostGrid";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";
import { VideoPostCarrousel } from "../components/carousels/video-post-carousel";
import { AgendaCalendar } from "../components/AgendaCalendar";
import { useState } from "react";

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
  // Fetch posts, videos, loading, and error states from the custom hook
  const { posts, videos, loading, error } = useContentFeedback();

  console.log(videos.length);

  // Modal states and handlers from the useModals hook
  const {
    showCreatePost,
    showAskMark,
    openCreatePost,
    closeCreatePost,
    openAskMark,
    closeAskMark,
  } = useModals();

  const [viewMode, setViewMode] = useState<"list" | "month">("month");

  // Define header actions for the page (view mode, create post, ask Mark)
  const pageActions: Actions[] = [
    {
      type: "button",
      children: "View Mode",
      icon: viewMode === "list" ? LayoutGrid : CalendarIcon,
      onClick: () => setViewMode(viewMode === "list" ? "month" : "list"),
      variant: "outline",
    },
    {
      type: "button",
      children: "Create Post",
      icon: Plus,
      onClick: openCreatePost,
      variant: "default",
    },
    {
      type: "button",
      children: "Ask Mark",
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
      <PageOutletLayout pageTitle="Content Feedback" actions={pageActions as any}>
        {viewMode === "month" ? (
          <div className="col-span-12">
            <AgendaCalendar />
          </div>
        ) : (
          <>
            <div className="col-span-12 flex flex-col gap-4">
              {/* Grid of posts with feedback */}
              <PostGrid posts={posts} />
              {videos && <VideoPostCarrousel videos={videos} />}
            </div>
          </>
        )}
      </PageOutletLayout>
      {/* Modal for creating a new post */}
      <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
      {/* Modal for interacting with the AI assistant */}
      <AiChatModal isOpen={showAskMark} onClose={closeAskMark} />
    </>
  );
}