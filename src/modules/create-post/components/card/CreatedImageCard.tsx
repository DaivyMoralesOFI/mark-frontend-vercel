import { useState, useEffect, useRef } from "react";
import { transformGoogleDriveUrl } from "@/core/lib/imageUtils";
import { Paperclip, ArrowUp, Maximize2, Loader, Trash2, Download } from "lucide-react";
import { useEditImage } from "../../hooks/useCreateImage";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useUser } from "@/shared/hooks/useUser";

export function CreatedImageCard({ image, creation_uuid, parent_uuid, isProcessing: firebaseProcessing, prompt: initialPrompt }: { image: File | string, creation_uuid?: string, parent_uuid?: string, isProcessing?: boolean, prompt?: string }) {
  const [showTools, setShowTools] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(crypto.randomUUID()).current;
  const { mutate: editImage, isPending } = useEditImage();
  const { user: firebaseUser } = useAuth();
  const { user: profileUser } = useUser("KGLTadXoTWGvqb2Tn475");
  const displayName = firebaseUser?.displayName || profileUser?.user_name || "U";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const isLoading = isPending || firebaseProcessing;

  // Close tools when clicking outside the component, and listen to other images opening
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTools(false);
      }
    }

    function handleCloseOthers(event: Event) {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.id !== componentId) {
        setShowTools(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("closeOtherImageTools", handleCloseOthers);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("closeOtherImageTools", handleCloseOthers);
    };
  }, [componentId]);

  const handleEdit = () => {
    console.log("handleEdit called", { editPrompt, creation_uuid, parent_uuid });
    if (!editPrompt.trim() || !creation_uuid || !parent_uuid || !image) {
      console.log("Missing required params to edit:", { editPrompt, creation_uuid, parent_uuid, image });
      return;
    }

    const new_uuid = crypto.randomUUID();
    const finalImageUrl = typeof image === "string" ? image : URL.createObjectURL(image);

    console.log("Calling editImage webhook with:", { new_uuid, parent_uuid, creation_uuid, finalImageUrl, prompt });
    // Call the edit webhook
    editImage({
      uuid: new_uuid,
      parent_uuid: parent_uuid,
      creation_uuid: creation_uuid,
      img_url: finalImageUrl,
      prompt: editPrompt
    }, {
      onSuccess: () => {
        console.log("Image edit webhook returned success");
        setEditPrompt("");
        // Hide tools to indicate the edit process is starting
        setShowTools(false);
      },
      onError: (err: any) => {
        console.error("Failed to edit image:", err);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editPrompt.trim()) {
      e.preventDefault();
      handleEdit();
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
      // fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  const handleDelete = () => {
    // Hide the layout
    setShowTools(false);
    // Dispatch event to parent to remove this node from the canvas
    if (parent_uuid) {
      window.dispatchEvent(
        new CustomEvent("hideNode", {
          detail: { uuid: parent_uuid },
        })
      );
    }
  };

  const imageUrl =
    image instanceof File
      ? URL.createObjectURL(image)
      : transformGoogleDriveUrl(image);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full max-w-[600px]">

      {/* Prompt bubble with user avatar — always visible above the image */}
      {initialPrompt && (
        <div className="w-full flex items-end gap-2 mb-1">
          {/* Avatar — square */}
          <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Bubble */}
          <div className="relative max-w-[80%] bg-white dark:bg-[#1C1C1F] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl rounded-bl-md px-4 py-2.5 shadow-xl backdrop-blur-sm">
            {/* Tail */}
            <div className="absolute -bottom-[6px] left-4 w-3 h-3 bg-white dark:bg-[#1C1C1F] border-r border-b border-black/[0.07] dark:border-white/[0.07] rotate-45" />
            <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed font-medium line-clamp-3">
              {initialPrompt}
            </p>
          </div>
        </div>
      )}
      {/* Top Toolbar — collapses to zero height when hidden, expands with gap when shown */}
      <div
        className={`flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${showTools
          ? "opacity-100 max-h-12 mt-2 pointer-events-auto"
          : "opacity-0 max-h-0 mt-0 pointer-events-none border-transparent"
          }`}
      >
        <button
          className="text-neutral-500 hover:text-blue-500 hover:bg-black/[0.05] dark:hover:bg-white/5 p-2 rounded-lg transition-all"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          className="text-neutral-500 hover:text-red-500 hover:bg-black/[0.05] dark:hover:bg-white/5 p-2 rounded-lg transition-all"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image */}
      <div
        className="relative w-full rounded-[1.5rem] overflow-hidden shadow-2xl bg-neutral-100 dark:bg-[#0F0F0F] border border-black/[0.06] dark:border-white/5 cursor-pointer transition-transform hover:scale-[1.01]"
        onClick={() => {
          if (!showTools) {
            window.dispatchEvent(new CustomEvent("closeOtherImageTools", { detail: { id: componentId } }));
          }
          setShowTools(!showTools);
        }}
      >
        <picture className="block w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt="created image"
            referrerPolicy="no-referrer"
            className={`w-full h-auto max-h-[500px] object-contain transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            onLoad={() => console.log("✅ Imagen cargada")}
            onError={() =>
              console.error("❌ Error cargando imagen:", imageUrl)
            }
          />
        </picture>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Loader className="w-8 h-8 text-white animate-spin mb-2" />
            <span className="text-white text-sm font-medium">Re-imagining...</span>
          </div>
        )}
      </div>

      {/* Bottom Input */}
      <div
        className={`w-full max-w-[500px] bg-white dark:bg-[#18181B] border border-black/[0.06] dark:border-white/5 rounded-full flex items-center px-3 py-2 shadow-xl backdrop-blur-md gap-3 transition-all duration-300 ease-in-out overflow-hidden ${showTools
          ? "opacity-100 max-h-14 mt-2 pointer-events-auto"
          : "opacity-0 max-h-0 mt-0 pointer-events-none border-transparent py-0"
          }`}
      >
        <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1">
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Imagine..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-sm font-medium disabled:opacity-50"
        />
        <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleEdit}
          disabled={!editPrompt.trim() || isLoading || !creation_uuid || !parent_uuid}
          className={`rounded-full p-2 transition-colors flex items-center justify-center ${editPrompt.trim() && !isLoading
            ? "bg-[#D946EF] hover:bg-[#D946EF]/90 text-white"
            : "bg-neutral-200 dark:bg-neutral-700/50 text-neutral-400"
            }`}
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}
