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
 * @property {Blob | null} generatedImage - La imagen generada por IA (Blob), si existe.
 * @property {File[]} uploadedImages - Los archivos de imagen subidos por el usuario.
 * @property {boolean} loadingImage - Whether an image is currently being generated or uploaded.
 * @property {React.RefObject<HTMLInputElement | null>} fileInputRef - Ref for the hidden file input element.
 * @property {() => void} onImageGeneration - Callback to trigger AI image generation.
 * @property {(files: FileList) => void} onFileUpload - Callback for when files are uploaded.
 * @property {() => void} onRemoveImage - Callback to remove the current image.
 * @property {(file: File) => void} onRemoveUploadedImage - Callback to remove a specific uploaded image.
 * @property {boolean} canGenerateImage - Whether the AI image generation button should be enabled.
 */
interface ImageUploadProps {
  hasImage: boolean;
  generatedImage: Blob | null;
  uploadedImages: File[];
  loadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageGeneration: () => void;
  onFileUpload: (files: FileList) => void;
  onRemoveImage: () => void;
  onRemoveUploadedImage: (file: File) => void;
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
  generatedImage,
  uploadedImages,
  loadingImage,
  fileInputRef,
  onImageGeneration,
  onFileUpload,
  onRemoveImage,
  onRemoveUploadedImage,
  canGenerateImage,
}) => {
  /**
   * Handles file selection from the hidden file input.
   * Calls onFileUpload with the selected files.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  // Progress bar controlled by estimated time
  const [progress, setProgress] = useState(0);
  const ESTIMATED_TIME = 40000; // miliseconds (40 seconds, adjust as needed)

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
      <div className="flex items-center gap-2">
        <Label className="flex items-center gap-2">Media</Label>
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
            // Progress bar
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-green-400 flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          ) : (
            <img src="/mark-yellow.svg" alt="Mark icon" className="w-6 h-6" />
          )}
          <span className="sr-only">Suggest image with AI</span>
        </Button>
      </div>

      {/* Hidden file input for uploading images */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Gallery and upload area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-purple-400 transition-colors">
        {/* Gallery */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Generated image by AI */}
          {generatedImage && (
            <div className="relative group">
              <img
                src={URL.createObjectURL(generatedImage)}
                alt="Generated"
                className="w-28 h-28 object-cover rounded-lg border-2 border-purple-400 shadow-md"
              />
              <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">
                AI
              </span>
              <button
                className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 rounded-full w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={onRemoveImage}
                title="Remove"
              >
                &#10005;
              </button>
            </div>
          )}
          {/* Uploaded images */}
          {uploadedImages.map((file) => {
            const objectUrl = URL.createObjectURL(file);
            return (
              <div
                key={file.name + file.size + file.lastModified}
                className="relative group"
              >
                <img
                  src={objectUrl}
                  alt="Uploaded"
                  className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow"
                />
                <button
                  className="absolute top-1 right-1 bg-red-100 hover:bg-red-500 hover:text-white text-gray-700 rounded-full w-6 h-6 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() => onRemoveUploadedImage(file)}
                  title="Remove"
                >
                  &#10005;
                </button>
              </div>
            );
          })}
        </div>
        {/* Upload area */}
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-14 h-14 text-purple-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop images here or click to upload
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload images
          </Button>
        </div>
      </div>
    </div>
  );
};
