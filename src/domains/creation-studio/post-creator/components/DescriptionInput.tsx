// DescriptionInput.tsx
//
// This file defines the DescriptionInput component, which provides a labeled textarea for entering the post description.
// It includes a button to trigger an AI-generated suggestion for the description, displays a loading spinner when generating,
// and shows a character count. The component is styled with Tailwind CSS and is designed for use in post creation flows.

import { Loader } from "lucide-react";

import { Textarea } from "@/shared/components/ui/textarea";
import { MAX_DESCRIPTION_LENGTH } from "../types/createPostTypes";
import { Badge } from "@/shared/components/ui/badge";

/**
 * Props for DescriptionInput
 * @property {string} description - The current value of the post description.
 * @property {(description: string) => void} onDescriptionChange - Callback for when the description changes.
 * @property {() => void} onSuggestion - Callback to trigger AI suggestion for the description.
 * @property {boolean} loadingSuggestion - Whether the AI suggestion is currently loading.
 * @property {boolean} canSuggest - Whether the AI suggestion button should be enabled.
 */
interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  onSuggestion: () => void;
  loadingSuggestion: boolean;
  canSuggest: boolean;
}

/**
 * DescriptionInput
 *
 * Renders a labeled textarea for entering a post description, with:
 * - An AI suggestion button (shows a spinner when loading)
 * - Character count display
 * - Controlled input for the description
 *
 * Used in the CreatePostModal to allow users to write or generate post content.
 */
export const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  onDescriptionChange,
  loadingSuggestion,
}) => {
  if (loadingSuggestion) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2 relative">
      {/* Controlled textarea for post description */}
      <Textarea
        id="description"
        placeholder="Write your post content here..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
        className="resize-none overflow-y-auto w-full border-0 focus:ring-0 focus:ring-offset-0 active:outline-none active:border-0 active:ring-0 active:ring-offset-0 focus:outline-none shadow-none min-h-[300px]"
      />
      {/* Character count display */}
      <div className="absolute bottom-2 right-2">
        <Badge variant="outline">
          {description.length}/{MAX_DESCRIPTION_LENGTH} characters
        </Badge>
      </div>
    </div>
  );
};
