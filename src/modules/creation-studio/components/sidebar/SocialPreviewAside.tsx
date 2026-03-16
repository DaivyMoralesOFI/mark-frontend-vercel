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
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";

interface SocialPreviewAsideProps {
  onClose: () => void;
}

const PLATFORMS: { id: Platform; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "instagram", label: "Instagram", Icon: InstagramIcon },
  { id: "linkedin",  label: "LinkedIn",  Icon: LinkedInIcon  },
  { id: "facebook",  label: "Facebook",  Icon: FacebookIcon  },
  { id: "tiktok",    label: "TikTok",    Icon: TikTokIcon    },
];

export const SocialPreviewAside = ({ onClose }: SocialPreviewAsideProps) => {
  const selectedGeneration = useFlowStore((s) => s.selectedGeneration);
  const postCopy = useFlowStore((s) => s.postCopy);
  const [platform, setPlatform] = useState<Platform>("instagram");

  const previewProps = {
    imageUrl: selectedGeneration?.img_url ?? "",
    copy: postCopy || "No caption yet.",
    displayName: "Your Brand",
    avatarUrl: "https://ui-avatars.com/api/?name=YB&background=random",
  };

  return (
    <div className="w-[320px] h-full bg-neutral-100 dark:bg-[#1a1a1a] border-l border-neutral-200 dark:border-white/[0.06] flex flex-col overflow-hidden flex-shrink-0">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <span className="text-[13px] font-semibold text-neutral-900 dark:text-white/90 tracking-tight">
          Preview
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 dark:text-white/30 hover:text-neutral-700 dark:hover:text-white/70 hover:bg-neutral-200 dark:hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-[15px] h-[15px]" />
        </button>
      </div>

      {/* ── Platform tabs ──────────────────────────── */}
      <div className="px-4 pb-5 shrink-0">
        <div className="flex items-center bg-neutral-200/70 dark:bg-white/[0.05] p-0.5 rounded-xl gap-0.5">
          {PLATFORMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              title={label}
              onClick={() => setPlatform(id)}
              className={cn(
                "flex-1 flex items-center justify-center py-1.5 rounded-[10px] transition-all",
                platform === id
                  ? "bg-white dark:bg-white/[0.10] shadow-sm"
                  : "hover:bg-white/50 dark:hover:bg-white/[0.05]"
              )}
            >
              <Icon className={cn(
                "w-[15px] h-[15px] transition-opacity",
                platform === id ? "opacity-100" : "opacity-30"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Phone mockup ───────────────────────────── */}
      <div className="flex-1 flex justify-center overflow-y-auto scrollbar-none pb-6 px-5">
        <div className="relative w-full select-none">

          {/* Frame: thin border + large radius = minimal phone silhouette */}
          <div className="rounded-[32px] border border-neutral-300 dark:border-white/10 overflow-hidden shadow-sm">

            {/* Notch bar */}
            <div className="flex justify-center items-center h-7 bg-neutral-200/60 dark:bg-white/[0.04]">
              <div className="w-16 h-[5px] rounded-full bg-neutral-300 dark:bg-white/10" />
            </div>

            {/* Scrollable preview content */}
            <div className="overflow-y-auto scrollbar-none" style={{ maxHeight: 520 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="[&>div]:!rounded-none [&>div]:!shadow-none [&>div]:!border-0"
                >
                  {!selectedGeneration?.img_url ? (
                    <div className="flex items-center justify-center py-16 px-4 bg-white dark:bg-black">
                      <p className="text-[12px] text-neutral-400 text-center">
                        Select an image to preview
                      </p>
                    </div>
                  ) : (
                    <>
                      {platform === "instagram" && <InstagramPreview {...previewProps} />}
                      {platform === "linkedin"  && <LinkedInPreview  {...previewProps} />}
                      {platform === "facebook"  && <FacebookPreview  {...previewProps} />}
                      {platform === "tiktok"    && <TikTokPreview    {...previewProps} />}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center items-center h-7 bg-white dark:bg-black">
              <div className="w-20 h-[3px] rounded-full bg-neutral-200 dark:bg-white/10" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
