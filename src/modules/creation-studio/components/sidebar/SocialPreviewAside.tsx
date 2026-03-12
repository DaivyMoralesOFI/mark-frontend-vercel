import { useState } from "react";
import { useFlowStore } from "@/modules/creation-studio/store/flowStoreSlice";
import { Platform } from "@/modules/creation-studio/components/card/PlatformPreviews";
import {
  InstagramPreview,
  FacebookPreview,
  LinkedInPreview,
  TikTokPreview,
} from "@/modules/creation-studio/components/card/PlatformPreviews";
import { cn } from "@/shared/utils/utils";
import { X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

interface SocialPreviewAsideProps {
  onClose: () => void;
}

export const SocialPreviewAside = ({ onClose }: SocialPreviewAsideProps) => {
  const selectedGeneration = useFlowStore((s) => s.selectedGeneration);
  const postCopy = useFlowStore((s) => s.postCopy);
  const [platform, setPlatform] = useState<Platform>("instagram");

  const platforms: { id: Platform; label: string }[] = [
    { id: "instagram", label: "Instagram" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "facebook", label: "Facebook" },
    { id: "tiktok", label: "TikTok" },
  ];

  if (!selectedGeneration?.img_url) {
    return (
      <div className="w-[340px] h-full border-l border-outline-variant/20 bg-surface flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/60 flex-shrink-0 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-sm">Select an image to see social media previews.</p>
      </div>
    );
  }

  const previewProps = {
    imageUrl: selectedGeneration.img_url,
    copy: postCopy || "No caption provided. Add some copy to see how it looks!",
    displayName: "Your Brand",
    avatarUrl: "https://ui-avatars.com/api/?name=YB&background=random",
  };

  return (
    <div className="w-[340px] h-full border-l border-outline-variant/20 bg-surface flex flex-col overflow-hidden flex-shrink-0">
      <div className="p-4 border-b border-outline-variant/20 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-on-surface">Platform Preview</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-lg gap-1">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={cn(
                "flex-1 py-1.5 text-[11px] font-medium rounded-md transition-all",
                platform === p.id
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-variant/60 hover:text-on-surface hover:bg-surface/50"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest/50 scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {platform === "instagram" && <InstagramPreview {...previewProps} />}
            {platform === "linkedin" && <LinkedInPreview {...previewProps} />}
            {platform === "facebook" && <FacebookPreview {...previewProps} />}
            {platform === "tiktok" && <TikTokPreview {...previewProps} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
