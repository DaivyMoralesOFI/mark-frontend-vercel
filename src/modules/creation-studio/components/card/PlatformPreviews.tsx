import { Heart, MessageCircle, Send, Bookmark, Share2, ThumbsUp, Repeat2, MoreHorizontal, Music2 } from "lucide-react";

export type Platform = "instagram" | "facebook" | "linkedin" | "tiktok";

interface PlatformPreviewProps {
  imageUrl: string;
  copy?: string;
  displayName: string;
  avatarUrl: string;
}

const COPY_LIMIT = 120;

export function InstagramPreview({ imageUrl, copy, displayName, avatarUrl }: PlatformPreviewProps) {
  const handle = displayName.toLowerCase().replace(/\s/g, "");
  return (
    <div className="w-full bg-white dark:bg-black rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-black dark:text-white truncate">{handle}</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-black dark:text-white" />
      </div>
      {/* Image */}
      <div className="w-full aspect-square bg-neutral-100 dark:bg-neutral-900">
        <img src={imageUrl} alt="post" className="w-full h-full object-cover" />
      </div>
      {/* Actions */}
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
            <MessageCircle className="w-6 h-6 text-black dark:text-white -scale-x-100" strokeWidth={1.5} />
            <Send className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
          </div>
          <Bookmark className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
        </div>
        <p className="text-[13px] font-semibold text-black dark:text-white mt-2">1,234 likes</p>
        {copy && (
          <p className="text-[13px] text-black dark:text-white mt-1 leading-[1.4]">
            <span className="font-semibold">{handle} </span>
            {copy.length > COPY_LIMIT ? `${copy.slice(0, COPY_LIMIT)}...` : copy}
          </p>
        )}
        <p className="text-[11px] text-neutral-400 mt-1.5 uppercase tracking-wide">2 hours ago</p>
      </div>
    </div>
  );
}

export function FacebookPreview({ imageUrl, copy, displayName, avatarUrl }: PlatformPreviewProps) {
  return (
    <div className="w-full bg-white dark:bg-[#242526] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#050505] dark:text-[#E4E6EB]">{displayName}</p>
          <p className="text-[12px] text-[#65676B] dark:text-[#B0B3B8]">2h · 🌎</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-[#65676B]" />
      </div>
      {/* Copy */}
      {copy && (
        <p className="px-3 pb-2 text-[14px] text-[#050505] dark:text-[#E4E6EB] leading-[1.4]">
          {copy.length > COPY_LIMIT * 1.5 ? `${copy.slice(0, Math.round(COPY_LIMIT * 1.5))}... See more` : copy}
        </p>
      )}
      {/* Image */}
      <div className="w-full aspect-[1.2/1] bg-neutral-100 dark:bg-neutral-800">
        <img src={imageUrl} alt="post" className="w-full h-full object-cover" />
      </div>
      {/* Reactions bar */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-0.5">
            <span className="text-[14px]">👍</span>
            <span className="text-[14px]">❤️</span>
          </div>
          <span className="text-[13px] text-[#65676B] dark:text-[#B0B3B8] ml-1">248</span>
        </div>
        <span className="text-[13px] text-[#65676B] dark:text-[#B0B3B8]">32 comments · 12 shares</span>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around px-2 py-1">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Share2, label: "Share" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-1.5 px-4 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Icon className="w-[18px] h-[18px] text-[#65676B] dark:text-[#B0B3B8]" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-[#65676B] dark:text-[#B0B3B8]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function LinkedInPreview({ imageUrl, copy, displayName, avatarUrl }: PlatformPreviewProps) {
  return (
    <div className="w-full bg-white dark:bg-[#1B1F23] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#000000E6] dark:text-[#FFFFFFE6]">{displayName}</p>
          <p className="text-[12px] text-[#00000099] dark:text-[#FFFFFF99] truncate">Marketing Manager · 2nd</p>
          <p className="text-[12px] text-[#00000099] dark:text-[#FFFFFF99]">2h · 🌐</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-[#00000099] dark:text-[#FFFFFF99]" />
      </div>
      {/* Copy */}
      {copy && (
        <p className="px-4 pb-2 text-[14px] text-[#000000E6] dark:text-[#FFFFFFE6] leading-[1.5]">
          {copy.length > COPY_LIMIT * 2 ? `${copy.slice(0, COPY_LIMIT * 2)}...see more` : copy}
        </p>
      )}
      {/* Image */}
      <div className="w-full aspect-[1.2/1] bg-neutral-100 dark:bg-neutral-800">
        <img src={imageUrl} alt="post" className="w-full h-full object-cover" />
      </div>
      {/* Reactions */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-0.5">
            <span className="text-[14px]">👍</span>
            <span className="text-[14px]">💡</span>
            <span className="text-[14px]">❤️</span>
          </div>
          <span className="text-[12px] text-[#00000099] dark:text-[#FFFFFF99] ml-1">1,482</span>
        </div>
        <span className="text-[12px] text-[#00000099] dark:text-[#FFFFFF99]">87 comments · 24 reposts</span>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-around px-2 py-1">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="flex items-center gap-1.5 px-3 py-2.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Icon className="w-4 h-4 text-[#00000099] dark:text-[#FFFFFF99]" strokeWidth={1.5} />
            <span className="text-[12px] font-medium text-[#00000099] dark:text-[#FFFFFF99]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TikTokPreview({ imageUrl, copy, displayName }: PlatformPreviewProps) {
  return (
    <div className="w-full bg-black rounded-2xl overflow-hidden border border-neutral-800 relative aspect-[9/16] max-h-[520px] shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Full background image */}
      <img src={imageUrl} alt="post" className="absolute inset-0 w-full h-full object-cover" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
        {[
          { icon: Heart, label: "45.2K" },
          { icon: MessageCircle, label: "1,204" },
          { icon: Bookmark, label: "8,431" },
          { icon: Share2, label: "2,109" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
            <span className="text-[11px] text-white font-medium">{label}</span>
          </div>
        ))}
      </div>
      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-14 p-3">
        <p className="text-white font-bold text-[15px]">@{displayName.toLowerCase().replace(/\s/g, "")}</p>
        {copy && (
          <p className="text-white text-[13px] mt-1 leading-[1.3] line-clamp-2">{copy}</p>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <Music2 className="w-3.5 h-3.5 text-white" />
          <p className="text-white text-[12px]">Original Sound - {displayName}</p>
        </div>
      </div>
    </div>
  );
}
