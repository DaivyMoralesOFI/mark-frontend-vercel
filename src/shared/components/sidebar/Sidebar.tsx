import {
  Settings,
  TrendingUp,
  Bot,
  Calendar,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  User,
  Monitor,
  Plus,
} from "lucide-react";
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
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import MarkLogo from "/mark-magic-wand.png";
import { useUser } from "@/shared/hooks/useUser";
import { useAuth } from "@/domains/auth/hooks/useAuth";
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
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { user: profileUser, loading: profileLoading } = useUser("KGLTadXoTWGvqb2Tn475");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: firebaseUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const displayName = firebaseUser?.displayName || profileUser?.user_name || "Sienna Hewitt";
  const displayEmail = firebaseUser?.email || profileUser?.email || "sienna@untitledui.com";
  const displayPhoto = firebaseUser?.photoURL || profileUser?.photo_url || "https://i.pravatar.cc/150?img=8";

  const mockOtherUser = {
    user_name: "Lily-Rose Chedjou",
    email: "lilyrose@untitledui.com",
    photo_url: "https://i.pravatar.cc/150?img=5",
  };

  return (
    <SidebarComponent variant="sidebar" collapsible="icon">
      {/* 1. Sidebar Header: User Profile */}
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-transparent hover:border-sidebar-border hover:bg-sidebar-accent transition-all"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={displayPhoto}
                      alt={displayName}
                    />
                    <AvatarFallback className="rounded-lg">
                      {displayName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "OS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {profileLoading && !firebaseUser ? (
                      <>
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                        <div className="mt-1 h-3 w-32 bg-gray-100 animate-pulse rounded" />
                      </>
                    ) : (
                      <>
                        <span className="truncate font-semibold text-foreground">
                          {displayName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground/70">
                          {displayEmail}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground/50 rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-xl p-2 gap-1 border-outline-variant shadow-xs"
                side="right"
                align="start"
                sideOffset={12}
              >
                {/* User Switcher Section */}
                <div className="flex flex-col gap-1 mb-1">
                  {/* Current User (Active) */}
                  <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                    <div className="relative">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={displayPhoto}
                          alt={displayName}
                        />
                        <AvatarFallback className="rounded-lg">
                          {displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-foreground">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {displayEmail}
                      </span>
                    </div>
                    <div className="flex items-center justify-center p-1">
                      <div className="w-4 h-4 rounded-full border-[4px] border-foreground/80"></div>
                    </div>
                  </div>

                  {/* Other User (Inactive) */}
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
                    <div className="relative">
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage
                          src={mockOtherUser.photo_url}
                          alt={mockOtherUser.user_name}
                        />
                        <AvatarFallback className="rounded-lg">L</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-foreground">
                        {mockOtherUser.user_name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {mockOtherUser.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-center p-1">
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/40"></div>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="p-2 cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    My profile @{displayName?.split(" ")[0].toLowerCase() || "user"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
                    Device management
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="p-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <div className="mt-2 pt-2 border-t border-outline-variant flex items-center px-2 pb-1">
                  <img src={MarkLogo} alt="Logo" className="w-10 h-10" />
                  <span className="font-semibold text-sm">Mark</span>
                  <span className="text-muted-foreground text-xs ml-auto">v1.0</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Sidebar Content: Navigation Groups */}
      <SidebarContent className="px-2">
        <SidebarGroup className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group-data-[collapsible=icon]:!p-2 text-foreground"
              >
                <Link to="/app/creation-studio/new/content">
                  <Plus className="w-4 h-4 text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                  <span className="font-medium">Create post</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {navigationGroups.map((group) => (
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
                            className="font-medium text-foreground/80 h-9 data-[active=true]:bg-sidebar-accent/50"
                          >
                            <item.icon className="w-4 h-4 text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                            <span>{item.title}</span>
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
                                  className="text-muted-foreground/80 hover:text-foreground h-8 data-[active=true]:bg-sidebar-accent/50"
                                >
                                  <Link to={subItem.url}>
                                    {subItem.icon && (
                                      <subItem.icon className="w-4 h-4 mr-2" />
                                    )}
                                    <span>{subItem.title}</span>
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
                        className="font-medium text-foreground/80 h-9 data-[active=true]:bg-sidebar-accent/50"
                      >
                        <Link to={item.to}>
                          <item.icon className="w-4 h-4 text-muted-foreground group-data-[active=true]/menu-button:text-foreground" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. Sidebar Footer: Logo & Version */}
      <SidebarFooter className="p-4">
        {isExpanded ? (
          <div className="flex items-center gap-2 px-1">
            <div className="flex aspect-square items-center justify-center size-10">
              <img src="/mark-apple-icon.png" alt="Logo" className="w-full h-full" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-sm">Mark</span>
              <span className="text-muted-foreground text-[10px]">v1.0</span>
            </div>
          </div>
        ) : (
          <div className="flex aspect-square items-center justify-center size-10 mx-auto">
            <img src="/mark-apple-icon.png" alt="Logo" className="w-full h-full" />
          </div>
        )}
      </SidebarFooter>
    </SidebarComponent>
  );
}
