import {
  Settings,
  TrendingUp,
  Bot,
  Calendar,
  LayoutDashboard,
  LogOut,
  Plus,
  Sun,
  Moon,
  Monitor,
  Loader2,
  Check,
  Sparkles,
  ChevronsUpDown,
  ChevronRight,
  HelpCircle,
  Building2,
  Palette,
} from "lucide-react";
import { useTheme } from "@/core/context/ThemeProvider";
import { cn } from "@/shared/utils/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/shared/components/ui/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/Collapsible";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/domains/auth/hooks/useAuth";
import { useBrands } from "@/shared/hooks/useBrands";
import { useCreations } from "@/modules/creation-studio/hooks/useCreateImage";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";

/* ─── Flat nav items ───────────────────────────────────────── */
const NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/app/dashboard",
    sub: [
      { title: "Overview",   url: "/app/dashboard" },
      { title: "LinkedIn",   url: "/app/dashboard?platform=linkedin",  icon: LinkedInIcon },
      { title: "Instagram",  url: "/app/dashboard?platform=instagram", icon: InstagramIcon },
      { title: "TikTok",     url: "/app/dashboard?platform=tiktok",    icon: TikTokIcon },
      { title: "Facebook",   url: "/app/dashboard?platform=facebook",  icon: FacebookIcon },
    ],
  },
  { title: "Calendar",       icon: Calendar,   to: "/app/calendar"    },
  { title: "Campaigns",      icon: TrendingUp, to: "/app/campaigns"   },
  { title: "Chat with Mark", icon: Bot,        to: "/app/chat"        },
] as const;

/* ─── Shared item class ────────────────────────────────────── */
const itemCls = (active: boolean) =>
  cn(
    "h-10 rounded-lg transition-colors",
    "hover:bg-neutral-200/60 dark:hover:bg-white/[0.06]",
    active
      ? "bg-neutral-200/80 dark:bg-white/[0.08] text-neutral-900 dark:text-white"
      : "text-neutral-500 dark:text-white/60"
  );

/* ══════════════════════════════════════════════════════════════
   Sidebar
═══════════════════════════════════════════════════════════════ */
export function Sidebar() {
  const { state, setOpen } = useSidebar();
  const isExpanded = state === "expanded";
  const { theme, setTheme } = useTheme();
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout } = useAuth();

  const profileUser = null as { user_name?: string; email?: string } | null;
  const displayName = profileUser?.user_name || "Sienna Hewitt";
  const initials    = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const { brands, selectedBrand, selectedBrandId, selectBrand, loading: brandsLoading } = useBrands();
  const { data: creations, isLoading: creationsLoading } = useCreations();
  const recentCreations = creations
    ? [...creations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8)
    : [];

  const themeOptions = [
    { value: "light"  as const, icon: Sun,     label: "Light"  },
    { value: "dark"   as const, icon: Moon,    label: "Dark"   },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <SidebarComponent
      variant="sidebar"
      collapsible="icon"
      className={cn(
        "bg-neutral-100 dark:bg-[#1a1a1a] border-neutral-200 dark:border-white/[0.06] transition-all",
        !isExpanded && "cursor-pointer"
      )}
      onClick={() => { if (!isExpanded) setOpen(true); }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <SidebarHeader className={cn("transition-all", isExpanded ? "px-4 pt-5 pb-3" : "p-2")}>
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold text-neutral-900 dark:text-white tracking-tight leading-none">
              Mark
            </span>
            <SidebarTrigger className="text-neutral-400 dark:text-white/25 hover:text-neutral-600 dark:hover:text-white/60 transition-colors" />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <SidebarTrigger className="size-8 text-neutral-400 dark:text-white/30 hover:text-neutral-700 dark:hover:text-white/70 hover:bg-neutral-200/60 dark:hover:bg-white/[0.06] rounded-lg transition-colors" />
          </div>
        )}
      </SidebarHeader>

      {/* ── Content ──────────────────────────────────────────── */}
      <SidebarContent className="px-2 gap-0">

        {/* New post */}
        <SidebarGroup className="py-1.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="New post"
                className={cn(
                  "h-10 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-white/[0.06] transition-colors",
                  "group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                )}
              >
                <Link to="/app/creation-studio/new/content">
                  <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-neutral-500 dark:text-white/70" strokeWidth={2} />
                  </div>
                  <span className="text-[14px] text-neutral-700 dark:text-white/80 font-normal">New post</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup className="py-1.5">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to ||
                  ("sub" in item && item.sub.some((s) => location.pathname + location.search === s.url));

                if ("sub" in item) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen={false} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                            className={itemCls(isActive)}
                          >
                            <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-neutral-700 dark:text-white/80" : "text-neutral-400 dark:text-white/40")} />
                            <span className="text-[14px] flex-1">{item.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-white/20 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 shrink-0" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l border-neutral-200 dark:border-white/[0.06] ml-3.5">
                            {item.sub.map((sub) => {
                              const subActive =
                                (sub.url === "/app/dashboard" && location.pathname === "/app/dashboard" && !location.search) ||
                                location.pathname + location.search === sub.url;
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={subActive}
                                    className={cn(
                                      "h-8 rounded-lg transition-colors hover:bg-neutral-200/60 dark:hover:bg-white/[0.05]",
                                      subActive ? "text-neutral-900 dark:text-white/90" : "text-neutral-400 dark:text-white/40 hover:text-neutral-600 dark:hover:text-white/70"
                                    )}
                                  >
                                    <Link to={sub.url}>
                                      {"icon" in sub && sub.icon && (
                                        <sub.icon className="w-[15px] h-[15px] mr-1.5 shrink-0" />
                                      )}
                                      <span className="text-[14px]">{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={itemCls(isActive)}
                    >
                      <Link to={item.to}>
                        <item.icon className={cn("w-[18px] h-[18px] shrink-0", isActive ? "text-neutral-700 dark:text-white/80" : "text-neutral-400 dark:text-white/40")} />
                        <span className="text-[14px]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recents — only shown when sidebar is expanded */}
        {isExpanded && <SidebarGroup className="py-3 flex-1">
          <p className="px-3 mb-2 text-[14px] font-normal text-neutral-400 dark:text-white/30 tracking-normal">
            Recents
          </p>
          <SidebarGroupContent>
            <SidebarMenu>
              {creationsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-300 dark:text-white/20" />
                </div>
              ) : recentCreations.length === 0 && isExpanded ? (
                <p className="px-3 text-[14px] text-neutral-400 dark:text-white/20">No creations yet</p>
              ) : (
                recentCreations.map((creation) => {
                  const isActive = location.pathname.includes(creation.uuid);
                  return (
                    <SidebarMenuItem key={creation.uuid}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={creation.title || "Untitled"}
                        className={cn(
                          "h-9 rounded-lg transition-colors",
                          "hover:bg-neutral-200/60 dark:hover:bg-white/[0.04]",
                          "group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                          isActive && "bg-neutral-200/80 dark:bg-white/[0.06]"
                        )}
                      >
                        <Link to={`/app/creation-studio/new/content/${creation.uuid}`}>
                          <span className={cn(
                            "text-[14px] truncate transition-colors",
                            isActive ? "text-neutral-900 dark:text-white/90" : "text-neutral-500 dark:text-white/50 group-hover:text-neutral-700 dark:group-hover:text-white/75"
                          )}>
                            {creation.title || "Untitled"}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
              {isExpanded && (creations?.length ?? 0) > 8 && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-8 rounded-lg hover:bg-white/[0.04]">
                    <Link to="/app/creation-studio/new/content">
                      <span className="text-[14px] text-neutral-400 dark:text-white/25 hover:text-neutral-600 dark:hover:text-white/50 transition-colors">
                        View all {creations!.length} creations
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>}
      </SidebarContent>

      {/* ── Footer ───────────────────────────────────────────── */}
      <SidebarFooter className="p-0 border-t border-neutral-200 dark:border-white/[0.06]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full transition-colors outline-none",
                "hover:bg-neutral-200/60 dark:hover:bg-white/[0.06]",
                isExpanded ? "p-4" : "p-4 justify-center"
              )}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-neutral-600 flex items-center justify-center shrink-0 relative">
                <span className="text-[14px] font-semibold text-white">{initials}</span>
                {!isExpanded && selectedBrand && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-100 dark:border-[#1a1a1a]" />
                )}
              </div>

              {isExpanded && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <span className="block text-[13px] font-medium text-neutral-900 dark:text-white/90 truncate leading-tight">
                      {displayName}
                    </span>
                    <span className="block text-[12px] text-neutral-400 dark:text-white/35 truncate mt-0.5 leading-tight">
                      {selectedBrand?.name ?? "No brand selected"}
                    </span>
                  </div>
                  <div className="shrink-0 w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/10 flex items-center justify-center">
                    <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 dark:text-white/30" />
                  </div>
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[22rem] rounded-[18px] shadow-2xl p-1.5 border border-neutral-200 dark:border-white/[0.08] bg-white dark:bg-[#242424]"
            side={isExpanded ? "top" : "right"}
            align={isExpanded ? "start" : "center"}
            sideOffset={12}
          >
            {/* ── User email ─────────────────────────────────── */}
            <div className="px-3 py-1.5">
              <p className="text-[12px] text-neutral-500 dark:text-white/40 truncate">{displayName}</p>
            </div>

            <div className="h-px bg-neutral-100 dark:bg-white/[0.06] mx-1" />

            {/* ── Main actions ───────────────────────────────── */}
            <div className="flex flex-col gap-0.5 py-1">
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] cursor-pointer outline-none hover:bg-neutral-50 dark:hover:bg-white/[0.05] transition-colors text-neutral-800 dark:text-white/80"
              >
                <Settings className="w-3.5 h-3.5 text-neutral-500 dark:text-white/40 shrink-0" strokeWidth={1.75} />
                <span className="text-[12px]">Account settings</span>
              </DropdownMenuItem>

              {/* Appearance row */}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-[10px]">
                <Palette className="w-3.5 h-3.5 text-neutral-500 dark:text-white/40 shrink-0" strokeWidth={1.75} />
                <span className="text-[12px] text-neutral-800 dark:text-white/80 flex-1">Appearance</span>
                <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-white/[0.06] rounded-md p-0.5">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-all",
                        theme === opt.value
                          ? "bg-white dark:bg-white/[0.12] text-neutral-800 dark:text-white shadow-sm"
                          : "text-neutral-400 dark:text-white/30 hover:text-neutral-600 dark:hover:text-white/60"
                      )}
                    >
                      <opt.icon className="w-2.5 h-2.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] cursor-pointer outline-none hover:bg-neutral-50 dark:hover:bg-white/[0.05] transition-colors text-neutral-800 dark:text-white/80">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500 dark:text-white/40 shrink-0" strokeWidth={1.75} />
                <span className="text-[12px]">Get help</span>
              </DropdownMenuItem>
            </div>

            <div className="h-px bg-neutral-100 dark:bg-white/[0.06] mx-1" />

            {/* ── Workspace / Brand Switcher ─────────────────── */}
            <div className="py-1">
              <div className="flex items-center gap-2.5 px-3 pt-1 pb-1">
                <Building2 className="w-3.5 h-3.5 text-neutral-500 dark:text-white/40 shrink-0" strokeWidth={1.75} />
                <span className="text-[12px] text-neutral-800 dark:text-white/80 flex-1">Workspace</span>
              </div>

              {brandsLoading ? (
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-neutral-400 dark:text-white/30" />
                  <span className="text-[11px] text-neutral-400 dark:text-white/30">Loading...</span>
                </div>
              ) : brands.length === 0 ? (
                <div className="flex flex-col items-center py-2 gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-300 dark:text-white/20" />
                  <span className="text-[11px] text-neutral-400 dark:text-white/30">No brands yet</span>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 px-1.5">
                  {brands.map((brand) => {
                    const isSelected = selectedBrandId === brand.uuid;
                    const brandInitials = brand.name.slice(0, 2).toUpperCase();
                    return (
                      <DropdownMenuItem
                        key={brand.uuid}
                        onClick={(e) => { e.preventDefault(); selectBrand(brand.uuid); }}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1 rounded-[8px] cursor-pointer outline-none transition-all",
                          isSelected
                            ? "bg-neutral-100 dark:bg-white/[0.08]"
                            : "hover:bg-neutral-50 dark:hover:bg-white/[0.05]"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-[5px] flex items-center justify-center shrink-0 text-[9px] font-bold overflow-hidden",
                          isSelected
                            ? "bg-neutral-800 dark:bg-white text-white dark:text-neutral-900"
                            : "bg-neutral-200 dark:bg-white/[0.10] text-neutral-600 dark:text-white/50"
                        )}>
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-contain"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : brandInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "block text-[12px] font-medium truncate leading-tight",
                            isSelected
                              ? "text-neutral-900 dark:text-white/90"
                              : "text-neutral-600 dark:text-white/60"
                          )}>
                            {brand.name}
                          </span>
                          <span className="block text-[9px] text-neutral-400 dark:text-white/30 truncate mt-0.5 leading-tight">
                            {brand.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                          </span>
                        </div>
                        <div className="shrink-0 w-3.5">
                          {isSelected && <Check className="w-3 h-3 text-neutral-500 dark:text-white/50" strokeWidth={2.5} />}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}

              {/* Add new brand */}
              <DropdownMenuItem
                onClick={() => navigate("/app/creation-studio/extractor")}
                className="flex items-center gap-2 px-2.5 py-1.5 mt-0.5 rounded-[10px] cursor-pointer outline-none transition-all hover:bg-neutral-50 dark:hover:bg-white/[0.05] group"
              >
                <div className="w-6 h-6 rounded-[5px] border border-dashed border-neutral-300 dark:border-white/20 flex items-center justify-center shrink-0 group-hover:border-neutral-400 dark:group-hover:border-white/35 transition-colors">
                  <Plus className="w-3 h-3 text-neutral-400 dark:text-white/30 group-hover:text-neutral-600 dark:group-hover:text-white/60 transition-colors" strokeWidth={2} />
                </div>
                <span className="text-[12px] text-neutral-500 dark:text-white/40 group-hover:text-neutral-700 dark:group-hover:text-white/70 transition-colors">
                  Add new brand
                </span>
              </DropdownMenuItem>
            </div>

            <div className="h-px bg-neutral-100 dark:bg-white/[0.06] mx-1" />

            {/* ── Sign out ───────────────────────────────────── */}
            <div className="py-1">
              <DropdownMenuItem
                onClick={() => { logout(); navigate("/auth"); }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] cursor-pointer outline-none hover:bg-neutral-50 dark:hover:bg-white/[0.05] transition-colors text-neutral-800 dark:text-white/80"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-500 dark:text-white/40 shrink-0" strokeWidth={1.75} />
                <span className="text-[12px]">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
