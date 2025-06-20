// ImageUpload.tsx
//
// This file defines the ImageUpload component, which provides UI for uploading or generating an image for a post.
// Users can upload an image from their device or generate one using AI. The component displays a preview, loading state,
// and allows removing the image. It is styled with Tailwind CSS and designed for use in post creation flows.

import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

/**
 * Props for ImageUpload
 * @property {boolean} hasImage - Whether an image (uploaded or generated) is present.
 * @property {string | null} generatedImage - The URL of the AI-generated image, if any.
 * @property {string | null} uploadedImage - The URL of the user-uploaded image, if any.
 * @property {boolean} loadingImage - Whether an image is currently being generated or uploaded.
 * @property {React.RefObject<HTMLInputElement | null>} fileInputRef - Ref for the hidden file input element.
 * @property {() => void} onImageGeneration - Callback to trigger AI image generation.
 * @property {(file: File) => void} onFileUpload - Callback for when a file is uploaded.
 * @property {() => void} onRemoveImage - Callback to remove the current image.
 * @property {boolean} canGenerateImage - Whether the AI image generation button should be enabled.
 */
interface ImageUploadProps {
  hasImage: boolean;
  generatedImage: string | null;
  uploadedImage: string | null;
  loadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageGeneration: () => void;
  onFileUpload: (file: File) => void;
  onRemoveImage: () => void;
  canGenerateImage: boolean;
}

/**
 * ImageUpload
 *
 * Renders a section for uploading or generating an image for a post, with:
 * - AI image generation button (shows spinner when loading)
 * - Hidden file input for uploading images
 * - Preview of the uploaded or generated image
 * - Remove image button
 * - Drag-and-drop/upload UI when no image is present
 *
 * Used in the CreatePostModal to allow users to add media to their post.
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  hasImage,
  generatedImage,
  uploadedImage,
  loadingImage,
  fileInputRef,
  onImageGeneration,
  onFileUpload,
  onRemoveImage,
  canGenerateImage,
}) => {
  /**
   * Handles file selection from the hidden file input.
   * Calls onFileUpload with the selected file.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  // Progress bar controlled by estimated time
  const [progress, setProgress] = useState(0);
  const ESTIMATED_TIME = 20000; // miliseconds (20 seconds, adjust as needed)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loadingImage) {
      setProgress(0);
      const start = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / ESTIMATED_TIME) * 100, 99);
        setProgress(percent);
      }, 100);
    } else {
      setProgress(0);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadingImage]);

  return (
    <div className="space-y-2">
      {/* Label and AI Image Generation Button */}
      <Label className="flex items-center gap-2">
        Media
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 p-0 ml-2"
          aria-label="Suggest image with AI"
          disabled={loadingImage || !canGenerateImage}
          onClick={onImageGeneration}
        >
          {loadingImage ? (
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-green-400/80 flex items-center justify-center">
                <span className="text-xs text-white font-bold">{Math.round(progress)}%</span>
              </div>
            </div>
          ) : (
            <img src="/mark.svg" alt="Mark icon" className="w-8 h-8" />
          )}
          <span className="sr-only">Suggest image with AI</span>
        </Button>
      </Label>

      {/* Hidden file input for uploading images */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Image preview or drag-and-drop/upload UI */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {loadingImage ? (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-xs bg-gray-100 rounded-full overflow-hidden shadow-inner h-7">
              <div
                className="bg-green-400/60 h-7 rounded-full text-white text-center transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  minWidth: "2rem",
                }}
              >
                {progress > 15 && (
                  <span className="text-xs font-medium">{Math.round(progress)}%</span>
                )}
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium mt-2">Generating image...</p>
          </div>
        ) : hasImage && (generatedImage || uploadedImage) ? (
          <div className="space-y-2">
            {/* Preview of the uploaded or generated image */}
            <img
              src={generatedImage || uploadedImage || undefined}
              alt="Preview"
              className="mx-auto max-h-40 rounded"
              style={{ maxWidth: "100%" }}
            />
            <p className="text-sm text-green-600 font-medium">
              Image {generatedImage ? "generated" : "uploaded"} successfully
            </p>
            {/* Button to remove the current image */}
            <Button variant="outline" size="sm" onClick={onRemoveImage}>
              Remove Image
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Drag-and-drop/upload UI when no image is present */}
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              Drag and drop an image here, or click to browse
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};