import { useState, useEffect, useRef } from "react";
import { transformGoogleDriveUrl } from "@/core/lib/imageUtils";
import { ArrowUp, Loader, Copy, Check, ChevronDown, Sparkles, CheckCircle2, Circle, LayoutGrid } from "lucide-react";
import { useFlowStore } from "../../store/flowStoreSlice";
import sampleImage from "@/assets/img/sample_mark_respond.png";

const COPY_PREVIEW_LENGTH = 280;

export function CreatedImageCard({
  image,
  creation_uuid,
  isProcessing: firebaseProcessing,
  copy,
  variant = "combined",
  isSelected,
  onSelect,
  onEditSubmit,
  isEditPending,
  prompt: promptProp,
  genType,
  hidePromptBubble,
}: {
  image: File | string;
  creation_uuid?: string; // reserved for future use
  isProcessing?: boolean;
  prompt?: string;
  copy?: string;
  variant?: "image" | "combined";
  isSelected?: boolean;
  genType?: string;
  onSelect?: () => void;
  onEditSubmit?: (prompt: string) => void;
  isEditPending?: boolean;
  hidePromptBubble?: boolean;
}) {
  const { userPrompt, postCopy, focusedCardId, setFocusedCardId } = useFlowStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const componentId = useRef(crypto.randomUUID()).current;
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [copyExpanded, setCopyExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyJustUpdated] = useState(false);
  const [localCopy, setLocalCopy] = useState(copy || postCopy);
  const displayName = "U";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const isLoading = isEditPending || firebaseProcessing;
  const displayCopy = localCopy || postCopy;
  const isCopyLong = displayCopy.length > COPY_PREVIEW_LENGTH;
  const isBlurred = focusedCardId !== null && focusedCardId !== componentId;

  useEffect(() => {
    if (!localCopy && postCopy) setLocalCopy(postCopy);
  }, [postCopy]);

  useEffect(() => {
    if (showEditInput) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showEditInput]);

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
    function handleOpenAll() {
      setShowEditInput(true);
      setFocusedCardId(null); // don't blur siblings — all are open
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("closeOtherImageTools", handleCloseOthers);
    window.addEventListener("openAllEditInputs", handleOpenAll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("closeOtherImageTools", handleCloseOthers);
      window.removeEventListener("openAllEditInputs", handleOpenAll);
    };
  }, [componentId]);

  const handleSubmit = () => {
    if (!editPrompt.trim()) return;
    if (onEditSubmit) {
      onEditSubmit(editPrompt);
      setEditPrompt("");
      setShowEditInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editPrompt.trim()) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setShowEditInput(false);
      setEditPrompt("");
    }
  };

  const handleImageClick = () => {
    const opening = !showEditInput;
    if (opening) {
      window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
      setFocusedCardId(componentId);
      // Auto-select for preview when opening edit tools
      if (onSelect) onSelect();
    } else {
      setFocusedCardId(null);
    }
    setShowEditInput(opening);
  };

  const handleCopyText = async () => {
    if (!displayCopy) return;
    await navigator.clipboard.writeText(displayCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const imageUrl =
    image instanceof File
      ? URL.createObjectURL(image)
      : transformGoogleDriveUrl(image);

  const isVideo = 
    (typeof imageUrl === "string" && (imageUrl.endsWith(".mp4") || imageUrl.endsWith(".webm") || imageUrl.includes("/video/upload/"))) ||
    (variant === "combined" && (image as any).genType === "video");

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center w-full max-w-[520px] transition-all duration-300 ease-out ${
        isBlurred ? "opacity-40 scale-[0.97] saturate-50" : "opacity-100 scale-100 saturate-100"
      }`}
    >
      {/* Top bar — edit input, slides in on image click */}
      <div
        className={`w-full bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-[1.25rem] shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
          showEditInput
            ? "opacity-100 max-h-20 mb-3 pointer-events-auto"
            : "opacity-0 max-h-0 mb-0 pointer-events-none border-transparent"
        }`}
      >
        <div className="isolate flex items-center gap-2 px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes to this content..."
            disabled={isEditPending}
            className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm font-medium disabled:opacity-50 min-w-0 px-2"
          />
          <button
            onClick={handleSubmit}
            disabled={!editPrompt.trim() || isEditPending}
            className={`relative z-10 flex-shrink-0 rounded-full p-2 transition-all flex items-center justify-center ${
              editPrompt.trim() && !isEditPending
                ? "bg-[#D946EF] hover:bg-[#D946EF]/90 text-white"
                : "bg-neutral-200 dark:bg-neutral-700/50 text-neutral-400"
            }`}
          >
            {isEditPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full">
        <div className="w-full rounded-[1.5rem] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/[0.06]">
          {/* Content (Image or Video) */}
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            {isVideo ? (
              <video
                src={imageUrl}
                controls
                className={`w-full h-auto max-h-[480px] object-cover transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
              />
            ) : imageUrl && !imageUrl.includes("undefined") ? (
              <img
                src={imageUrl}
                alt="created image"
                referrerPolicy="no-referrer"
                className={`w-full h-auto max-h-[480px] object-cover transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
                onError={() => console.error("Error loading image:", imageUrl)}
              />
            ) : (
              <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center gap-4">
                {genType === "carousel" ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-[#D946EF]/10 flex items-center justify-center">
                      <LayoutGrid className="w-8 h-8 text-[#D946EF]" />
                    </div>
                    <span className="text-sm font-medium text-neutral-500">Carousel Project</span>
                  </>
                ) : (
                  <img
                    src={sampleImage}
                    alt="placeholder"
                    className="w-full h-full object-cover opacity-20"
                  />
                )}
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
                <Loader className="w-7 h-7 text-white animate-spin mb-2" />
                <span className="text-white text-sm font-medium">Re-imagining...</span>
              </div>
            )}
          </div>

          {/* Select bar — image variant only */}
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

          {/* Copy section — combined variant only */}
          {variant === "combined" && (isLoading || displayCopy) && (
            <div
              className={`overflow-hidden transition-all duration-400 ease-in-out ${copyJustUpdated ? "ring-2 ring-inset ring-[#D946EF]/25" : ""}`}
              style={{
                display: "grid",
                gridTemplateRows: "1fr",
                opacity: 1,
                transition: "grid-template-rows 0.4s ease-in-out, opacity 0.4s ease-in-out",
              }}
            >
              <div className="min-h-0">
                <div className="px-5 pt-4 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md ${isLoading ? "bg-[#D946EF]/10 animate-pulse" : "bg-gradient-to-br from-[#D946EF]/15 to-[#D946EF]/5 dark:from-[#D946EF]/20 dark:to-[#D946EF]/5"}`}>
                        {!isLoading && <Sparkles className="w-3.5 h-3.5 text-[#D946EF]" />}
                      </div>
                      {isLoading ? (
                        <div className="w-28 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                      ) : (
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Generated Copy
                        </span>
                      )}
                    </div>
                    {!isLoading && (
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
                    )}
                  </div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                      <div className="w-5/6 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                      <div className="w-4/6 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                      <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse mt-2" />
                      <div className="w-3/4 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                    </div>
                  ) : (
                    <div className="relative">
                      <style>{`
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
                        {isCopyLong && !copyExpanded
                          ? displayCopy.slice(0, COPY_PREVIEW_LENGTH) + "…"
                          : displayCopy}
                      </p>
                      {isCopyLong && (
                        <button
                          onClick={() => setCopyExpanded(!copyExpanded)}
                          className="flex items-center gap-1 mt-2 text-[12px] font-medium text-[#D946EF] hover:text-[#D946EF]/80 transition-colors"
                        >
                          <span>{copyExpanded ? "Show less" : "Read more"}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${copyExpanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User prompt bubble — hidden for initial generations (bubble shown separately on the left) */}
      {!hidePromptBubble && (promptProp || userPrompt) && (
        <div className="w-full flex items-start gap-2.5 mt-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800">
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative max-w-[85%] bg-white dark:bg-[#1C1C1F] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-lg">
            <div className="absolute -top-[5px] left-3.5 w-2.5 h-2.5 bg-white dark:bg-[#1C1C1F] border-l border-t border-black/[0.06] dark:border-white/[0.06] rotate-45" />
            <p className="text-neutral-700 dark:text-neutral-300 text-[13px] leading-relaxed font-medium line-clamp-3">
              {promptProp || userPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
