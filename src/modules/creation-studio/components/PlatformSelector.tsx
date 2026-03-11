// PlatformSelector.tsx
//
// This file defines the PlatformSelector component, which allows users to select one or more target platforms for their post.
// It displays a list of available platforms as selectable buttons and toggles their selection state in Redux.
// The component is styled with Tailwind CSS and uses the global Redux state for platform selection.

import React from "react";
import { Button } from "@/shared/components/ui/Button";
import { PLATFORMS } from "../types/CreatePostTypes";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { togglePlatform } from "../store/createPostSlice";

/**
 * PlatformSelectorProps - No props needed as it uses global Redux state.
 */
interface PlatformSelectorProps {}

export const PlatformSelector: React.FC<PlatformSelectorProps> = () => {
  const dispatch = useAppDispatch();
  const { selectedPlatforms } = useAppSelector((state) => state.createPost);

  const handleToggle = (platformId: string) => {
    dispatch(togglePlatform(platformId));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.id);
        return (
          <div key={platform.id} className="relative">
            <Button
              variant="ghost"
              onClick={() => handleToggle(platform.id)}
              className="p-1 rounded-lg border-0 transition-all flex items-center space-x-2"
            >
              {isSelected ? (
                <picture className="w-8 h-8 block relative p-0 m-0">
                  <source src={platform.logo_fill} type="image/svg+xml" />
                  <img
                    src={platform.logo_fill}
                    alt={platform.name}
                    className="aspect-square object-contain"
                  />
                </picture>
              ) : (
                <picture className="w-8 h-8 block relative p-0 m-0">
                  <source src={platform.logo_outline} type="image/svg+xml" />
                  <img
                    src={platform.logo_outline}
                    alt={platform.name}
                    className="aspect-square object-contain border-2 border-transparent grayscale opacity-40 hover:opacity-100 transition-opacity"
                  />
                </picture>
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
