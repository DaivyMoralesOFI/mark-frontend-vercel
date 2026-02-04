// ContentFeedbackPage.tsx
//
// This file defines the ContentFeedbackPage component, which serves as the main page for viewing and managing content posts and feedback.
// It integrates with the content post module's hooks, components, and modals, and provides actions for creating posts and interacting with the AI assistant.
// The page handles loading and error states, and displays a grid of posts with options to create new posts or ask for AI feedback.

import { Plus, LayoutGrid, Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Actions } from "@/shared/types/types";
import { useContentFeedback } from "../hooks/useContentFeedback";
import { useModals } from "@/core/hooks/useModals";
import { LoadingState } from "@/shared/components/loading-state/LoadingState";
import { ErrorState } from "@/shared/components/error-state/ErrorState";
import { PostGrid } from "../components/PostGrid";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { VideoPostCarrousel } from "../components/carousels/video-post-carousel";
import { AgendaCalendar } from "../components/AgendaCalendar";
import { useState } from "react";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { Button } from "@/shared/components/ui/button";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const initialDateParam = searchParams.get('date');
  const initialPostId = searchParams.get('postId');

  // Fetch posts, videos, loading, and error states from the custom hook
  const { posts, videos, loading, error } = useContentFeedback();

  console.log(videos.length);

  // Modal states and handlers from the useModals hook
  const {
    showCreatePost,
    openCreatePost,
    closeCreatePost,
  } = useModals();

  const [viewMode, setViewMode] = useState<"list" | "month" | "week">("month");

  // Define header actions for the page (view mode, create post)
  const pageActions: Actions[] = [
    {
      type: "button" as const,
      children: viewMode === "list" ? "Calendar View" : "List View",
      icon: viewMode === "list" ? CalendarIcon : LayoutGrid,
      onClick: () => setViewMode(viewMode === "list" ? "month" : "list"),
      variant: "outline" as const,
    },
    ...(viewMode !== "list" ? [{
      type: "button" as const,
      children: viewMode === "month" ? "Week View" : "Month View",
      icon: Clock,
      onClick: () => setViewMode(viewMode === "month" ? "week" : "month"),
      variant: "outline" as const,
    }] : []),
    ...(viewMode !== "list" ? [{
      type: "custom" as const,
      node: (
        <Button variant="outline" className="text-gray-600 min-w-[140px] justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <InstagramIcon className="w-4 h-4 bg-white rounded-full border border-white" />
            </div>
            Instagram
          </div>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </Button>
      )
    }] : []),
    {
      type: "button" as const,
      children: "Create Post",
      icon: Plus,
      onClick: openCreatePost,
      variant: "default" as const,
    },
  ];

  // Show loading or error state if needed
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      {/* Main layout with page title and actions */}
      <PageOutletLayout pageTitle="Content Feedback" actions={pageActions as any}>
        {viewMode !== "list" ? (
          <div className="col-span-12">
            <AgendaCalendar
              view={viewMode as 'month' | 'week'}
              initialDate={initialDateParam ? new Date(initialDateParam) : undefined}
              initialPostId={initialPostId || undefined}
            />
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
      <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
    </>
  );
}