import { useState, useEffect, useRef } from "react";
import { transformGoogleDriveUrl } from "@/core/lib/imageUtils";
import { ImageIcon, ArrowUp, Loader, Trash2, Download, Copy, Check, ChevronDown, Sparkles, FileText, CheckCircle2, Circle } from "lucide-react";
import { useEditImage, useRegenerateCopy } from "../../hooks/useCreateImage";
import { useFlowStore } from "../../store/flowStoreSlice";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import {
  InstagramPreview,
  FacebookPreview,
  LinkedInPreview,
  TikTokPreview,
  type Platform,
} from "./PlatformPreviews";

const COPY_PREVIEW_LENGTH = 280;

const platformButtons: { id: Platform; icon: React.FC<{ className?: string }>; label: string }[] = [
  { id: "instagram", icon: InstagramIcon, label: "Instagram" },
  { id: "facebook", icon: FacebookIcon, label: "Facebook" },
  { id: "linkedin", icon: LinkedInIcon, label: "LinkedIn" },
  { id: "tiktok", icon: TikTokIcon, label: "TikTok" },
];

const previewComponents: Record<Platform, React.FC<any>> = {
  instagram: InstagramPreview,
  facebook: FacebookPreview,
  linkedin: LinkedInPreview,
  tiktok: TikTokPreview,
};

export function CreatedImageCard({ image, creation_uuid, parent_uuid, isProcessing: firebaseProcessing, prompt: initialPrompt, copy, variant = "combined", isSelected, onSelect }: { image: File | string, creation_uuid?: string, parent_uuid?: string, isProcessing?: boolean, prompt?: string, copy?: string, variant?: "image" | "combined", isSelected?: boolean, onSelect?: () => void }) {
  const { userPrompt, postCopy, lastCreationPayload, focusedCardId, setFocusedCardId, addCopyVersion } = useFlowStore();
  const { mutate: editImage, isPending: isEditingImage } = useEditImage();
  const { mutate: regenerateCopy, isPending: isRegeneratingCopy } = useRegenerateCopy();
  const containerRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(crypto.randomUUID()).current;
  const [showTools, setShowTools] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [editMode, setEditMode] = useState<"image" | "text" | "all">("image");
  const [copyExpanded, setCopyExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyJustUpdated, setCopyJustUpdated] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const [showCopy, setShowCopy] = useState(true);
  const [localCopy, setLocalCopy] = useState(copy || postCopy);
  const displayName = "U";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const isSubmitting = isEditingImage || isRegeneratingCopy;
  const isLoading = isEditingImage || firebaseProcessing;
  const displayCopy = localCopy || postCopy;
  const isCopyLong = displayCopy.length > COPY_PREVIEW_LENGTH;
  const isBlurred = focusedCardId !== null && focusedCardId !== componentId;

  useEffect(() => {
    if (!localCopy && postCopy) setLocalCopy(postCopy);
  }, [postCopy]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowEditInput(false);
        setFocusedCardId(null);
      }
    }

    function handleCloseOthers(event: Event) {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.id !== componentId) {
        setShowEditInput(false);
        setFocusedCardId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("closeOtherImageTools", handleCloseOthers);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("closeOtherImageTools", handleCloseOthers);
    };
  }, [componentId]);

  const handleSubmit = () => {
    if (!editPrompt.trim() || !creation_uuid) return;

    if ((editMode === "image" || editMode === "all") && parent_uuid && image) {
      const finalImageUrl = typeof image === "string" ? image : URL.createObjectURL(image);
      editImage({
        uuid: crypto.randomUUID(),
        creation_uuid,
        img_url: finalImageUrl,
        prompt: editPrompt,
      }, {
        onSuccess: () => {
          if (editMode === "image") { setEditPrompt(""); setShowEditInput(false); }
        },
        onError: (err: any) => console.error("Failed to edit image:", err),
      });
    }

    if ((editMode === "text" || editMode === "all") && lastCreationPayload) {
      regenerateCopy({
        creation_uuid,
        prompt: userPrompt,
        current_copy: displayCopy,
        copy_feedback: editPrompt,
        platforms: lastCreationPayload.platforms,
        post_type: lastCreationPayload.post_type,
        post_tone: lastCreationPayload.post_tone,
        brand_dna: lastCreationPayload.brand_dna,
        identity: lastCreationPayload.identity,
      }, {
        onSuccess: (response) => {
          setLocalCopy(response.copy);
          addCopyVersion(response.copy);
          setCopyJustUpdated(true);
          setTimeout(() => setCopyJustUpdated(false), 1800);
          if (editMode === "text") { setEditPrompt(""); setShowEditInput(false); }
        },
        onError: (err) => console.error("Failed to regenerate copy:", err),
      });
    }

    if (editMode === "all") {
      setEditPrompt("");
      setShowEditInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editPrompt.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `image-${creation_uuid ?? Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  const handleDelete = () => {
    setShowEditInput(false);
    if (parent_uuid) {
      window.dispatchEvent(
        new CustomEvent("hideNode", { detail: { uuid: parent_uuid } })
      );
    }
  };

  const handleCopyText = async () => {
    if (!displayCopy) return;
    await navigator.clipboard.writeText(displayCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformToggle = (platform: Platform) => {
    setActivePlatform((prev) => (prev === platform ? null : platform));
  };

  const imageUrl =
    image instanceof File
      ? URL.createObjectURL(image)
      : transformGoogleDriveUrl(image);

  const PreviewComponent = activePlatform ? previewComponents[activePlatform] : null;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center w-full max-w-[520px] transition-all duration-300 ease-out ${
        isBlurred ? "opacity-40 scale-[0.97] saturate-50" : "opacity-100 scale-100 saturate-100"
      }`}
    >

      {/* Top bar — edit input for image variant, social toolbar for combined */}
      <div
        className={`w-full bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-[1.25rem] shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${showEditInput
          ? "opacity-100 max-h-20 mb-3 pointer-events-auto"
          : "opacity-0 max-h-0 mb-0 pointer-events-none border-transparent"
        }`}
      >
        {variant === "combined" ? (
          /* Social network + download/delete toolbar */
          <div className="flex items-center gap-1 px-2 py-2">
            <button
              className="text-neutral-500 hover:text-blue-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] p-2 rounded-lg transition-colors"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="text-neutral-500 hover:text-red-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] p-2 rounded-lg transition-colors"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-black/[0.08] dark:bg-white/[0.08] mx-1 flex-shrink-0" />
            {platformButtons.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handlePlatformToggle(id)}
                className={`p-2 rounded-lg transition-colors ${
                  activePlatform === id
                    ? "bg-[#D946EF]/10 text-[#D946EF]"
                    : "text-neutral-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.06]"
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        ) : (
          /* Edit input for image variant */
          <div className="isolate flex items-center gap-2 px-2 py-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image change..."
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm font-medium disabled:opacity-50 min-w-0 px-2"
            />
            <button
              onClick={handleSubmit}
              disabled={!editPrompt.trim() || isSubmitting}
              className={`relative z-10 flex-shrink-0 rounded-full p-2 transition-all flex items-center justify-center ${
                editPrompt.trim() && !isSubmitting
                  ? "bg-[#D946EF] hover:bg-[#D946EF]/90 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700/50 text-neutral-400"
              }`}
            >
              {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" strokeWidth={3} />}
            </button>
          </div>
        )}
      </div>

      {/* Card — either platform preview or default view */}
      <div
        className="relative w-full"
        onMouseEnter={() => setShowTools(true)}
        onMouseLeave={() => setShowTools(false)}
      >
        {/* Vertical toolbar — shown on hover, image variant only */}
        {variant !== "combined" && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-0.5 p-1 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] rounded-xl shadow-lg transition-all duration-200 ${
              showTools ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none -translate-x-2"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-neutral-500 hover:text-blue-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] p-2 rounded-lg transition-all"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              className="text-neutral-500 hover:text-red-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] p-2 rounded-lg transition-all"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {PreviewComponent ? (
          <div
            className="w-full cursor-pointer"
            onClick={() => {
              const opening = !showEditInput;
              if (opening) {
                window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
                setFocusedCardId(componentId);
              } else {
                setFocusedCardId(null);
              }
              setShowEditInput(opening);
            }}
          >
            <PreviewComponent
              imageUrl={imageUrl}
              copy={copy}
              displayName={displayName}
              avatarUrl={avatarUrl}
            />
          </div>
        ) : (
          <div className="w-full rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.06]">
          {/* Image */}
          <div
            className="relative cursor-pointer"
            onClick={() => {
              const opening = !showEditInput;
              if (opening) {
                window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
                setFocusedCardId(componentId);
              } else {
                setFocusedCardId(null);
              }
              setShowEditInput(opening);
            }}
          >
            <img
              src={imageUrl}
              alt="created image"
              referrerPolicy="no-referrer"
              className={`w-full h-auto max-h-[480px] object-cover transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
              onError={() => console.error("Error loading image:", imageUrl)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
                <Loader className="w-7 h-7 text-white animate-spin mb-2" />
                <span className="text-white text-sm font-medium">Re-imagining...</span>
              </div>
            )}
          </div>

          {/* Select bar — image-only, shown on click */}
          {variant === "image" && onSelect && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showEditInput ? "max-h-14 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-black/[0.04] dark:border-white/[0.04]">
                <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Use in final preview</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                    isSelected
                      ? "bg-[#D946EF]/10 text-[#D946EF]"
                      : "text-neutral-400 hover:text-[#D946EF] hover:bg-[#D946EF]/[0.06]"
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>{isSelected ? "Selected" : "Select"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Copy section — animated slide */}
          {variant === "combined" && displayCopy && (
            <div
              className={`overflow-hidden transition-all duration-400 ease-in-out ${copyJustUpdated ? "ring-2 ring-inset ring-[#D946EF]/25" : ""}`}
              style={{
                display: "grid",
                gridTemplateRows: showCopy ? "1fr" : "0fr",
                opacity: showCopy ? 1 : 0,
                transition: "grid-template-rows 0.4s ease-in-out, opacity 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
              }}
            >
              <div className="min-h-0">
                <div className="px-5 pt-4 pb-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-[#D946EF]/15 to-[#D946EF]/5 dark:from-[#D946EF]/20 dark:to-[#D946EF]/5 transition-all duration-300 ${copyJustUpdated ? "scale-110 from-[#D946EF]/30 to-[#D946EF]/10" : ""}`}>
                        <Sparkles className={`w-3.5 h-3.5 text-[#D946EF] transition-all duration-300 ${copyJustUpdated ? "animate-spin" : ""}`} style={copyJustUpdated ? { animationDuration: "1s", animationIterationCount: 1 } : {}} />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        Generated Copy
                      </span>
                      {copyJustUpdated && (
                        <span
                          className="text-[10px] font-semibold text-[#D946EF] bg-[#D946EF]/10 px-1.5 py-0.5 rounded-full"
                          style={{ animation: "fadeInScale 0.3s ease-out" }}
                        >
                          Updated
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Text */}
                  <div className="relative">
                    <style>{`
                      @keyframes fadeInScale {
                        from { opacity: 0; transform: scale(0.8); }
                        to   { opacity: 1; transform: scale(1); }
                      }
                      @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(6px); }
                        to   { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>
                    <p
                      key={displayCopy}
                      className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-[1.7] whitespace-pre-line"
                      style={{ animation: "fadeInUp 0.4s ease-out" }}
                    >
                      {displayCopy}
                    </p>
                  </div>

                  {/* Expand toggle */}
                  {isCopyLong && variant !== "combined" && (
                    <button
                      onClick={() => setCopyExpanded(!copyExpanded)}
                      className="flex items-center gap-1 mt-2 text-[12px] font-medium text-[#D946EF] hover:text-[#D946EF]/80 transition-colors"
                    >
                      <span>{copyExpanded ? 'Show less' : 'Read more'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${copyExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
        )}
      </div>

      {/* User prompt bubble */}
      {variant === "combined" && userPrompt && (
        <div className="w-full flex items-start gap-2.5 mt-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-[85%] bg-white dark:bg-[#1C1C1F] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-lg">
            <div className="absolute -top-[5px] left-3.5 w-2.5 h-2.5 bg-white dark:bg-[#1C1C1F] border-l border-t border-black/[0.06] dark:border-white/[0.06] rotate-45" />
            <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-relaxed font-medium line-clamp-3">
              {userPrompt}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
