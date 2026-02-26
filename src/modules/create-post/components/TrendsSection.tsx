// TrendsSection.tsx
//
// This file defines the TrendsSection component, which displays trending hashtags for selected platforms (Instagram or LinkedIn).
// Users can add suggested hashtags to their post by clicking on them. The component handles loading state and empty state.
// It is styled with Tailwind CSS and designed for use in post creation flows.

import { Button } from "@/shared/components/ui/Button";
import { Label } from "@/shared/components/ui/Label";

/**
 * Props for TrendsSection
 * @property {string[]} selectedPlatforms - Array of selected platform IDs.
 * @property {string[]} trends - Array of trending hashtags.
 * @property {boolean} loadingTrends - Whether the trends are currently loading.
 * @property {(hashtag: string) => void} onAddHashtag - Callback to add a hashtag to the post.
 */
interface TrendsSectionProps {
  trends: string[];
  loadingTrends: boolean;
  onAddHashtag: (hashtag: string) => void;
}

/**
 * TrendsSection
 *
 * Renders trending hashtags for Instagram or LinkedIn if either is selected.
 * - Shows a loading message while fetching trends.
 * - Displays clickable hashtag buttons when trends are available.
 * - Shows an empty state message if no trends are found.
 *
 * Used in the CreatePostModal to help users add relevant hashtags to their post.
 */
export const TrendsSection: React.FC<TrendsSectionProps> = ({
  trends,
  loadingTrends,
  onAddHashtag,
}) => {
  // Only show trends if there are trends or we are loading them
  const shouldShowTrends = loadingTrends || trends.length > 0;

  // If no trends and not loading, render nothing
  if (!shouldShowTrends) return null;

  return (
    <div className="space-y-2">
      {/* Section label */}
      <Label className="font-semibold text-outline-variant">
        More trends for your post
      </Label>
      {loadingTrends ? (
        // Loading state
        <div className="text-xs text-gray-500">Loading hashtags...</div>
      ) : trends.length > 0 ? (
        // Render trending hashtags as clickable buttons
        <div className="flex flex-wrap gap-2">
          {trends.map((hashtag) => (
            <Button
              key={hashtag}
              type="button"
              variant="secondaryOutline"
              onClick={() => onAddHashtag(hashtag)}
            >
              {hashtag}
            </Button>
          ))}
        </div>
      ) : (
        // Empty state if no trends found
        <div className="text-xs text-gray-500">No hashtags found.</div>
      )}
    </div>
  );
};
