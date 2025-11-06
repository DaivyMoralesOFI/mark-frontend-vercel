import { useState, useRef } from "react";
import { Video, Upload, ImageIcon, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/Input";
import {
  videoSuggestionService,
  VideoSuggestionRequest,
  GenerateVideoRequest,
} from "./services/videoSuggestionService";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface CreateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VideoModel = "sora-2" | "sora-2-pro";
type VideoDuration = 4 | 8 | 12;
type VideoSize = "1280x720" | "720x1280" | "1024x1792" | "1792x1024";

const ALLOWED_SIZES: VideoSize[] = [
  "1280x720",
  "720x1280",
  "1024x1792",
  "1792x1024",
];

export function CreateVideoModal({ isOpen, onClose }: CreateVideoModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<VideoModel>("sora-2");
  const [duration, setDuration] = useState<VideoDuration>(4);
  const [size, setSize] = useState<VideoSize | "">("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handler for requesting an AI-generated suggestion for the video prompt
   */
  const handleSuggestion = async () => {
    if (!prompt.trim()) return;

    setLoadingSuggestion(true);

    try {
      const requestData: VideoSuggestionRequest = {
        seconds: duration.toString(),
        user_prompt: prompt,
      };

      const suggestion = await videoSuggestionService.getSuggestion(
        requestData
      );

      // Handle the response (supporting both "improved_prompt" and potential typo "improved_promt")
      const improvedPrompt = suggestion.improved_prompt || suggestion.improved_promt;
      
      if (improvedPrompt) {
        setPrompt(improvedPrompt);
        setSizeError(""); // Clear any previous errors
      }
    } catch {
      setSizeError("Failed to get suggestion. Please try again.");
      setTimeout(() => setSizeError(""), 3000);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      setSizeError("Please upload an image file");
      return;
    }

    setImageFile(file);
    setSizeError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const detectedSize = `${width}x${height}` as VideoSize;

        // Check if size is allowed
        if (ALLOWED_SIZES.includes(detectedSize)) {
          setSize(detectedSize);
          setSizeError("");
        } else {
          setSizeError(
            `Image size ${width}x${height} is not supported. Please use one of: ${ALLOWED_SIZES.join(
              ", "
            )}`
          );
          setSize("");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = async () => {
    if (!prompt) {
      setSizeError("Please enter a video prompt");
      return;
    }

    // If image is provided, we need size. Otherwise, use empty string
    let videoSize = size || "";

    if (imageFile && !size) {
      setSizeError("Please upload an image with a supported size");
      return;
    }

    setIsGenerating(true);

    try {
      const requestData: GenerateVideoRequest = {
        imageFile: imageFile || null,
        prompt,
        model,
        size: videoSize,
        seconds: duration,
      };

      await videoSuggestionService.generateVideo(requestData);

      // Show success message
      setShowSuccess(true);
      setSizeError("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        // Reset form
        setImageFile(null);
        setImagePreview("");
        setPrompt("");
        setModel("sora-2");
        setDuration(4);
        setSize("");
        setSizeError("");
        setShowSuccess(false);
        setLoadingSuggestion(false);
        onClose();
      }, 2000);
    } catch {
      setSizeError("Failed to send video generation request. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setImageFile(null);
    setImagePreview("");
    setPrompt("");
    setModel("sora-2");
    setDuration(4);
    setSize("");
    setSizeError("");
    setLoadingSuggestion(false);
    setShowSuccess(false);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setSize("");
    setSizeError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Can generate if there's a prompt, and if there's an image, it must be valid (no sizeError)
  const canGenerate = 
    prompt.trim().length > 0 && 
    !isGenerating && 
    !showSuccess && 
    !(imageFile && sizeError && sizeError !== ""); // Si hay imagen con error de tamaño, no puede generar
  
  const canSuggest = prompt.trim().length > 0 && !loadingSuggestion;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        {/* Success notification */}
        {showSuccess && (
          <div className="mb-4">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md text-center font-medium animate-fade-in">
              Request sent successfully!
            </div>
          </div>
        )}
        
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-primary" />
            <span>Create AI Video</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <Label>Upload Image (Optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <div
                      onClick={handleUploadClick}
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Click to upload image (Optional)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, or WEBP
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported sizes:
                        <br />
                        {ALLOWED_SIZES.join(", ")}
                      </p>
                      <p className="text-xs text-amber-600 mt-2 font-medium">
                        * You can also generate video without an image
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg border border-gray-200 bg-gray-50"
                      />
                      <Button
                        onClick={removeImage}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  {sizeError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{sizeError}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-4">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model *</Label>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value as VideoModel)}
                  >
                    <SelectTrigger id="model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sora-2">
                        <div className="flex items-center space-x-2">
                          <span>Sora 2</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sora-2-pro">
                        <div className="flex items-center space-x-2">
                          <span>Sora 2 Pro</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label>Video Duration *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[4, 8, 12].map((seconds) => (
                      <button
                        key={seconds}
                        onClick={() => setDuration(seconds as VideoDuration)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          duration === seconds
                            ? "border-purple-600 bg-purple-50 text-purple-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-2xl font-bold">{seconds}</p>
                          <p className="text-xs text-gray-600">seconds</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Display */}
                <div className="space-y-2">
                  <Label htmlFor="size">Video Size</Label>
                  <Input
                    id="size"
                    value={size || "Auto-detected from image"}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    Size is automatically detected from your uploaded image
                  </p>
                </div>
              </div>
            </div>
            {/* Image Info */}
            {imageFile && !sizeError && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        Image Loaded
                      </span>
                    </div>
                    <div className="text-xs text-green-700 space-y-1">
                      <p>
                        <strong>File:</strong> {imageFile.name}
                      </p>
                      <p>
                        <strong>Size:</strong>{" "}
                        {(imageFile.size / 1024).toFixed(2)} KB
                      </p>
                      {size && (
                        <p>
                          <strong>Resolution:</strong> {size}
                        </p>
                      )}
                    </div>
                  </div>
                )}

            {/* Prompt Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="prompt">Video Prompt</Label>
                <div className="relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    aria-label="Suggest video prompt with AI"
                    disabled={loadingSuggestion || !canSuggest}
                    onClick={handleSuggestion}
                  >
                    {loadingSuggestion ? (
                      <Loader className="animate-spin w-4 h-4 text-green-600" />
                    ) : (
                      <img
                        src="/mark-yellow.svg"
                        alt="Mark icon"
                        className="w-6 h-6"
                      />
                    )}
                    <span className="sr-only">
                      Suggest video prompt with AI
                    </span>
                  </Button>
                </div>
              </div>
              <Textarea
                id="prompt"
                placeholder="Describe how you want your video to be animated. For example: 'Camera slowly zooms in while the colors shift from warm to cool tones, creating a dreamy atmosphere...'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {prompt.length} characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {canGenerate ? (
                  <span className="text-green-600 font-medium">
                    ✓ Ready to generate
                  </span>
                ) : imageFile && sizeError && sizeError !== "" ? (
                  <span className="text-red-600">Please fix the image error</span>
                ) : !prompt ? (
                  <span>Please enter a prompt to generate video</span>
                ) : (
                  <span>Please complete the form</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateVideo}
                  disabled={!canGenerate || isGenerating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
