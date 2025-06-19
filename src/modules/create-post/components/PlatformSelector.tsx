// PlatformSelector.tsx
//
// This file defines the PlatformSelector component, which allows users to select one or more target platforms for their post.
// It displays a list of available platforms as selectable buttons, highlights selected platforms, and shows a summary of selected platforms as badges.
// The component is styled with Tailwind CSS and is designed for use in post creation flows.

import { Label } from "recharts"; // NOTE: This import may be incorrect; consider using your UI library's Label if needed.
import { PLATFORMS } from "../types/createPostTypes";
import { Badge } from "@/shared/components/ui/badge";

/**
 * Props for PlatformSelector
 * @property {string[]} selectedPlatforms - Array of selected platform IDs.
 * @property {(platformId: string) => void} onTogglePlatform - Callback to toggle selection of a platform.
 */
interface PlatformSelectorProps {
    selectedPlatforms: string[];
    onTogglePlatform: (platformId: string) => void;
  }
  
/**
 * PlatformSelector
 *
 * Renders a list of available platforms as selectable buttons. Selected platforms are highlighted.
 * Displays a summary of selected platforms as badges below the selector.
 * Used in the CreatePostModal to let users choose where to publish their post.
 */
  export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    selectedPlatforms,
    onTogglePlatform,
  }) => {
    return (
      <div className="space-y-2">
        {/* Label for the selector */}
        <Label>Target Platforms</Label>
        {/* Platform selection buttons */}
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => onTogglePlatform(platform.id)}
              className={`px-3 py-2 rounded-lg border transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                {/* Platform color indicator */}
                <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Badges for selected platforms */}
        {selectedPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 text-white">
            {selectedPlatforms.map((platformId) => {
              const platform = PLATFORMS.find((p) => p.id === platformId);
              return (
                <Badge key={platformId} variant="secondary" className="text-xs">
                  {platform?.name}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  