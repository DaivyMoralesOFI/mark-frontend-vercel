// TrendsSection.tsx
//
// This file defines the TrendsSection component, which displays trending hashtags for selected platforms (Instagram or LinkedIn).
// Users can add suggested hashtags to their post by clicking on them. The component handles loading state and empty state.
// It is styled with Tailwind CSS and designed for use in post creation flows.

import { Label } from "@/shared/components/ui/label";

/**
 * Props for TrendsSection
 * @property {string[]} selectedPlatforms - Array of selected platform IDs.
 * @property {string[]} trends - Array of trending hashtags.
 * @property {boolean} loadingTrends - Whether the trends are currently loading.
 * @property {(hashtag: string) => void} onAddHashtag - Callback to add a hashtag to the post.
 */
interface TrendsSectionProps {
  selectedPlatforms: string[];
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
  selectedPlatforms,
  trends,
  loadingTrends,
  onAddHashtag,
}) => {
  // Only show trends if Instagram or LinkedIn is selected
  const shouldShowTrends = selectedPlatforms.includes("instagram") || 
                          selectedPlatforms.includes("linkedin");

  // If neither platform is selected, render nothing
  if (!shouldShowTrends) return null;

  return (
    <div className="space-y-2">
      {/* Section label */}
      <Label className="font-semibold">Trends</Label>
      {loadingTrends ? (
        // Loading state
        <div className="text-xs text-gray-500">Loading hashtags...</div>
      ) : trends.length > 0 ? (
        // Render trending hashtags as clickable buttons
        <div className="flex flex-wrap gap-2">
          {trends.map((hashtag) => (
            <button
              key={hashtag}
              type="button"
              className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-blue-700 text-xs border border-blue-200 transition"
              onClick={() => onAddHashtag(hashtag)}
            >
              {hashtag}
            </button>
          ))}
        </div>
      ) : (
        // Empty state if no trends found
        <div className="text-xs text-gray-500">No hashtags found.</div>
      )}
    </div>
  );
};