// DescriptionInput.tsx
//
// This file defines the DescriptionInput component, which provides a labeled textarea for entering the post description.
// It includes a button to trigger an AI-generated suggestion for the description, displays a loading spinner when generating,
// and shows a character count. The component is styled with Tailwind CSS and is designed for use in post creation flows.

import { Loader } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { MAX_DESCRIPTION_LENGTH } from '../types/createPostTypes';

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
  onSuggestion,
  loadingSuggestion,
  canSuggest,
}) => {
  return (
    <div className="space-y-2">
      {/* Label and AI Suggestion Button */}
      <div className="flex items-center gap-2">
        <Label htmlFor="description">Post Description</Label>
        <div className="relative">
          {/* AI Suggestion Button: triggers onSuggestion, shows spinner if loading */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 p-0"
            aria-label="Suggest description with AI"
            disabled={loadingSuggestion || !canSuggest}
            onClick={onSuggestion}
          >
            {loadingSuggestion ? (
              <Loader className="animate-spin w-4 h-4 text-green-600" />
            ) : (
              <img src="/mark-yellow.svg" alt="Mark icon" className="w-6 h-6" />
            )}
            <span className="sr-only">Suggest description with AI</span>
          </Button>
        </div>
      </div>
      {/* Controlled textarea for post description */}
      <Textarea
        id="description"
        placeholder="Write your post content here..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={4}
        className="resize-none overflow-y-auto w-full"
        style={{
          overflowX: "hidden",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxHeight: "140px",
        }}
      />
      {/* Character count display */}
      <p className="text-xs text-gray-500">
        {description.length}/{MAX_DESCRIPTION_LENGTH} characters
      </p>
    </div>
  );
};
