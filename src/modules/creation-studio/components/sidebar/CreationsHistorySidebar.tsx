import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreations } from "@/modules/creation-studio/hooks/useCreateImage";
import { type CreationListItem } from "@/modules/creation-studio/services/createImageService";
import { cn } from "@/shared/utils/utils";
import { Loader2, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function relativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

const STATUS_DOT: Record<string, string> = {
  pending:    "bg-amber-400",
  processing: "bg-blue-400 animate-pulse",
  done:       "bg-emerald-400",
  failed:     "bg-red-400",
};

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
  const dotClass = STATUS_DOT[creation.status] ?? "bg-neutral-500";

  return (
    <button
      title={collapsed ? (creation.title || "Untitled") : undefined}
      onClick={() => navigate(`/app/creation-studio/new/content/${creation.uuid}`)}
      className={cn(
        "group relative w-full flex items-center rounded-lg transition-colors duration-150 outline-none text-left",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
        isActive
          ? "bg-white/[0.06] text-white"
          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-white/60" />
      )}

      {!collapsed && (
        <span className="flex-1 min-w-0">
          <span className={cn(
            "block text-[12px] font-medium truncate leading-snug",
            isActive ? "text-white/85" : "text-white/50 group-hover:text-white/70",
          )}>
            {creation.title || "Untitled"}
          </span>
          <span className="flex items-center gap-1.5 mt-[3px]">
            <span className={cn("inline-block w-[5px] h-[5px] rounded-full shrink-0", dotClass)} />
            <span className="text-[10px] text-white/25 truncate">
              {relativeTime(creation.created_at)}
            </span>
          </span>
        </span>
      )}

      {collapsed && (
        <span className={cn("w-[5px] h-[5px] rounded-full shrink-0", dotClass)} />
      )}
    </button>
  );
}

export function CreationsHistorySidebar() {
  const { uuid: activeUuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { data: creations, isLoading } = useCreations();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full shrink-0 flex flex-col",
        "border-r border-white/[0.04]",
        "bg-[#0c0c0c]/70 backdrop-blur-xl",
        "transition-[width] duration-250 ease-in-out",
        collapsed ? "w-[52px]" : "w-[196px]",
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center pt-3.5 pb-2.5",
        collapsed ? "flex-col gap-2 px-2" : "gap-1.5 px-2.5",
      )}>
        <button
          onClick={() => navigate("/app/creation-studio/new/content")}
          title="New creation"
          className={cn(
            "flex items-center justify-center rounded-md transition-colors duration-150 font-medium shrink-0",
            "text-white/40 hover:text-white/70 hover:bg-white/[0.05]",
            collapsed ? "w-8 h-8" : "flex-1 h-7 gap-1.5 text-[11px]",
          )}
        >
          <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          {!collapsed && <span>New</span>}
        </button>

        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand" : "Collapse"}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-white/20 hover:text-white/50 hover:bg-white/[0.05] transition-colors"
        >
          {collapsed
            ? <PanelLeftOpen className="w-3.5 h-3.5" />
            : <PanelLeftClose className="w-3.5 h-3.5" />
          }
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <p className="px-3 mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/15">
          Recents
        </p>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-4 flex flex-col gap-px scrollbar-none">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-3 h-3 animate-spin text-white/15" />
          </div>
        ) : !creations?.length ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-[11px] text-white/15">
              {collapsed ? "—" : "Nothing yet"}
            </span>
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
    </div>
  );
}
