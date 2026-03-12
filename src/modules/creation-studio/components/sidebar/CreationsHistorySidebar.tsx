import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreations } from "@/modules/creation-studio/hooks/useCreateImage";
import { type CreationListItem } from "@/modules/creation-studio/services/createImageService";
import { cn } from "@/shared/utils/utils";
import {
  Loader2,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLOR: Record<string, string> = {
  pending:    "#fbbf24",
  processing: "#60a5fa",
  done:       "#34d399",
  failed:     "#f87171",
};

function relativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

// ─── Single item ──────────────────────────────────────────────────────────────
function CreationItem({
  creation,
  isActive,
  collapsed,
}: {
  creation: CreationListItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const navigate = useNavigate();
  const statusColor = STATUS_COLOR[creation.status] ?? "#94a3b8";
  const isProcessing = creation.status === "processing";

  return (
    <button
      title={collapsed ? (creation.title || "Untitled") : undefined}
      onClick={() =>
        navigate(`/app/creation-studio/new/content/${creation.uuid}`)
      }
      className={cn(
        "relative w-full flex items-center rounded-xl transition-all duration-200 outline-none",
        collapsed ? "justify-center p-2" : "gap-2.5 px-3 py-2",
        isActive
          ? "bg-white/[0.07] dark:bg-white/[0.06]"
          : "hover:bg-white/[0.04] dark:hover:bg-white/[0.04]",
      )}
    >
      {/* Active accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-violet-400" />
      )}

      {/* Status micro-dot */}
      <span
        className={cn(
          "shrink-0 w-[6px] h-[6px] rounded-full",
          isProcessing && "animate-pulse",
        )}
        style={{ backgroundColor: statusColor }}
      />

      {/* Text */}
      {!collapsed && (
        <span className="flex-1 min-w-0 text-left">
          <span
            className={cn(
              "block text-[12.5px] font-medium truncate leading-snug",
              isActive
                ? "text-white/90 dark:text-white/90"
                : "text-white/50 dark:text-white/50",
            )}
          >
            {creation.title || "Untitled"}
          </span>
          <span className="block text-[10.5px] text-white/25 mt-[1px] truncate">
            {relativeTime(creation.created_at)}
          </span>
        </span>
      )}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function CreationsHistorySidebar() {
  const { uuid: activeUuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { data: creations, isLoading } = useCreations();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full shrink-0 flex flex-col",
        "border-r border-white/[0.05]",
        "bg-[#0d0d0d]/75 dark:bg-[#0a0a0a]/85 backdrop-blur-2xl",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[60px]" : "w-[200px]",
      )}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-2 pt-4 pb-3 px-2.5",
          collapsed && "flex-col",
        )}
      >
        {/* New creation button */}
        <button
          onClick={() => navigate("/app/creation-studio/new/content")}
          title="New creation"
          className={cn(
            "flex items-center justify-center rounded-xl transition-all duration-200 font-medium shrink-0",
            "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10",
            "border border-violet-400/20 text-violet-300",
            "hover:from-violet-500/30 hover:to-fuchsia-500/20 hover:border-violet-400/35 hover:text-violet-200",
            collapsed ? "w-9 h-9" : "flex-1 h-8 gap-1.5 text-[11.5px]",
          )}
        >
          <Plus
            className={cn("shrink-0", collapsed ? "w-4 h-4" : "w-3.5 h-3.5")}
            strokeWidth={2.5}
          />
          {!collapsed && <span>New</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-2.5 h-px bg-white/[0.05] mb-2" />

      {/* Section label */}
      {!collapsed && (
        <p className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/20">
          Recents
        </p>
      )}

      {/* ── List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-4 flex flex-col gap-px scrollbar-none">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white/20" />
          </div>
        ) : !creations?.length ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-3 text-center">
            <Sparkles className="w-4 h-4 text-white/15" strokeWidth={1.5} />
            {!collapsed && (
              <p className="text-[11px] text-white/25 leading-snug">
                No creations yet
              </p>
            )}
          </div>
        ) : (
          creations.map((creation) => (
            <CreationItem
              key={creation.uuid}
              creation={creation}
              isActive={creation.uuid === activeUuid}
              collapsed={collapsed}
            />
          ))
        )}
      </div>

      {/* ── Bottom glow accent ─────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-violet-500/[0.04] to-transparent" />
    </div>
  );
}
