import {
  Settings,
  TrendingUp,
  Bot,
  Calendar,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Plus,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useUser } from "@/shared/hooks/useUser";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";

// Navigation Groups
const navigationGroups = [
  {
    label: "Navigation",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        isActive: false,
        to: "/dashboard",
        items: [
          {
            title: "Overview",
            url: "/dashboard",
          },
          {
            title: "LinkedIn",
            url: "/dashboard?platform=linkedin",
            icon: LinkedInIcon,
          },
          {
            title: "Instagram",
            url: "/dashboard?platform=instagram",
            icon: InstagramIcon,
          },
          {
            title: "TikTok",
            url: "/dashboard?platform=tiktok",
            icon: TikTokIcon,
          },
          {
            title: "Facebook",
            url: "/dashboard?platform=facebook",
            icon: FacebookIcon,
          },
        ],
      },
      { title: "Calendar", icon: Calendar, isActive: false, to: "/calendar" },
      { title: "Campaigns", icon: TrendingUp, isActive: false, to: "/campaigns" },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        icon: Settings,
        isActive: false,
        to: "/settings",
      },
      {
        title: "Chat with Mark",
        icon: Bot,
        isActive: false,
        to: "/chat",
      },
    ],
  },
];

export function Sidebar() {
  const { state, setOpen } = useSidebar();
  const isExpanded = state === "expanded";
  const { user: profileUser } = useUser("KGLTadXoTWGvqb2Tn475");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: firebaseUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const displayName = firebaseUser?.displayName || profileUser?.user_name || "Sienna Hewitt";

  const mockBrands = [
    { id: "1", name: "Ofi Services", url: "@ofiservices" },
    { id: "2", name: "EAOS", url: "@eaos" },
    { id: "3", name: "Anthorpic", url: "@anthorpic" },
  ];

  const [activeBrand, setActiveBrand] = useState(mockBrands[0]);

  return (
    <SidebarComponent
      variant="sidebar"
      collapsible="icon"
      className={`bg-transparent dark:bg-white/10 border-outline-variant transition-all ${!isExpanded ? "cursor-pointer" : ""}`}
      onClick={() => {
        if (!isExpanded) {
          setOpen(true);
        }
      }}
    >
      {/* 1. Sidebar Header: Logo */}
      <SidebarHeader className={`transition-all ${isExpanded ? "p-4" : "p-2"}`}>
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <div className="flex aspect-square items-center justify-center size-10">
                <img src="/mark-apple-icon.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-semibold text-sm">Mark</span>
                <span className="text-muted-foreground text-[10px]">v1.0</span>
              </div>
            </div>
            <SidebarTrigger className="text-muted-foreground/50 hover:text-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center relative group/trigger">
            <div className="flex aspect-square items-center justify-center size-10 mx-auto">
              <img src="/mark-apple-icon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/trigger:opacity-100 transition-opacity">
              <SidebarTrigger className="size-12 text-muted-foreground bg-surface border border-outline-variant rounded-full hover:text-foreground shadow-sm" />
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* 2. Sidebar Content: Navigation Groups */}
      <SidebarContent className={`transition-all ${isExpanded ? "px-3" : "px-0"}`}>
        <SidebarGroup className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group-data-[collapsible=icon]:!p-2 text-foreground hover:bg-muted/50 h-9"
              >
                <Link to="/app/creation-studio/new/content">
                  <Plus className="w-[18px] h-[18px] text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                  <span className="font-medium text-[13px]">Create post</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {
          navigationGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="uppercase text-muted-foreground/70 text-[11px] font-medium tracking-wider px-2 mt-2 mb-1">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) =>
                    item.items ? (
                      // Collapsible Item (Dashboard)
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={
                                location.pathname === item.to ||
                                item.items.some(
                                  (sub) => location.pathname === sub.url
                                )
                              }
                              className="font-medium text-muted-foreground/80 hover:text-foreground h-9 hover:bg-muted/50 data-[active=true]:bg-muted/80 data-[active=true]:text-foreground"
                            >
                              <item.icon className="w-[18px] h-[18px] text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                              <span className="text-[13px]">{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground/50" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={
                                      (subItem.url === "/dashboard" &&
                                        location.pathname === "/dashboard" &&
                                        !location.search) ||
                                      (location.pathname + location.search ===
                                        subItem.url)
                                    }
                                    className="font-medium text-muted-foreground/80 hover:text-foreground h-8 hover:bg-muted/50 data-[active=true]:bg-muted/80 data-[active=true]:text-foreground"
                                  >
                                    <Link to={subItem.url}>
                                      {subItem.icon && (
                                        <subItem.icon className="w-[18px] h-[18px] mr-2 text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                                      )}
                                      <span className="text-[13px]">{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      // Standard Item
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.to}
                          tooltip={item.title}
                          className="font-medium text-muted-foreground/80 hover:text-foreground h-9 hover:bg-muted/50 data-[active=true]:bg-muted/80 data-[active=true]:text-foreground"
                        >
                          <Link to={item.to}>
                            <item.icon className="w-[18px] h-[18px] text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                            <span className="text-[13px]">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        }
      </SidebarContent >

      {/* 3. Sidebar Footer: User Profile */}
      <SidebarFooter className={`transition-all ${isExpanded ? "p-4" : "p-1 pb-2 items-center"}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={`hover:bg-neutral-50 dark:hover:bg-white/5 data-[state=open]:bg-neutral-50 dark:data-[state=open]:bg-white/5 transition-all outline-none ${isExpanded ? "border border-neutral-300 dark:border-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[10px] h-auto py-2 px-2.5 dark:bg-transparent" : "justify-center hover:bg-muted/50"}`}
                >
                  <div className="relative">
                    <Avatar className={`${isExpanded ? "h-9 w-9" : "h-8 w-8"} rounded-[8px]`}>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} />
                      <AvatarFallback className="rounded-[8px] font-normal text-foreground border border-outline-variant text-xs">
                        {displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {isExpanded && (
                    <>
                      <div className="grid flex-1 text-left leading-tight ml-2.5">
                        <span className="truncate font-medium text-neutral-900 dark:text-neutral-100 text-[13px]">
                          {displayName}
                        </span>
                        <span className="truncate text-[12px] text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                          {firebaseUser?.email || "hi@ameliedesign.co"}
                        </span>
                      </div>
                      <MoreVertical className="ml-1 size-[18px] text-neutral-400" strokeWidth={2} />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[15.5rem] rounded-[12px] shadow-xs p-1.5 gap-0 border-[1px] border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-800"
                side={isExpanded ? "top" : "right"}
                align="center"
                sideOffset={isExpanded ? 12 : 10}
              >
                {/* User/Brand Switcher Section */}
                <div className="flex flex-col gap-1 mb-1">
                  {mockBrands.map((brand) => (
                    <DropdownMenuItem
                      key={brand.id}
                      onClick={(e) => {
                        e.preventDefault(); // Keep menu open when selecting brand
                        setActiveBrand(brand);
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-[6px] cursor-pointer outline-none transition-colors ${activeBrand.id === brand.id ? "bg-neutral-50 dark:bg-white/5" : "hover:bg-neutral-50 dark:hover:bg-white/5"}`}
                    >

                      <div className="grid flex-1 text-left leading-tight">
                        <span className="truncate font-medium text-neutral-900 dark:text-neutral-100 text-[13px]">
                          {brand.name}
                        </span>
                        <span className="truncate text-neutral-500 dark:text-neutral-400 text-[12px] font-normal">
                          {brand.url}
                        </span>
                      </div>

                      <div className="flex items-center justify-center pl-2">
                        {activeBrand.id === brand.id ? (
                          <div className="w-4 h-4 rounded-full border-[5px] border-neutral-900 dark:border-neutral-100" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-[1.5px] border-neutral-300 dark:border-neutral-600" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-800 my-2 mx-1" />

                {/* Actions Section */}
                <div className="flex flex-col gap-0.5 mt-1 mb-1">
                  <DropdownMenuItem className="gap-2.5 p-2 cursor-pointer rounded-[6px] hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-900 dark:text-neutral-100 outline-none">
                    <span className="font-medium text-[13px]">Account settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="gap-2.5 p-2 cursor-pointer rounded-[6px] hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 outline-none transition-colors">
                    <span className="font-medium text-[13px]">Device management</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex justify-between items-center gap-2.5 p-2 cursor-pointer rounded-[6px] hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 outline-none group transition-colors"
                    onClick={handleLogout}
                  >
                    <span className="font-medium text-[13px]">Sign out</span>
                    <LogOut className="h-[16px] w-[16px] text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" strokeWidth={2} />
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter >
    </SidebarComponent >
  );
}
