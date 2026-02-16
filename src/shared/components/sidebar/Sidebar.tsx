import {
  Settings,
  TrendingUp,
  Bot,
  Dna,
  User,
  CirclePlus,
  Calendar,
  LayoutDashboard,
  ChevronRight,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { CreatePostModal } from "@/domains/creation-studio/post-creator/components/CreatePostModal";
import MarkLogo from "@/assets/logos/mark-colored.svg";
import { cn } from "@/shared/utils/utils";
import { useUser } from "@/shared/hooks/useUser";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";

// Navigation items for the main sidebar menu
const navigationItems = [
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
  { title: "Brand DNA", icon: Dna, isActive: false, to: "/brand-dna" },
  { title: "Style Profile", icon: User, isActive: false, to: "/style-profile" },
];

/**
 * Sidebar
 *
 * Renders the main navigation sidebar for the application, including:
 * - Navigation links (Dashboard, Analytics, Content, Campaigns, Brand DNA, Style Profile)
 * - AI Assistant section (Chat with Mark)
 * - Settings and user/company profile card
 * - Responsive and styled for a modern UI
 */
export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useSidebar();
  const isExpanded = state === "expanded";
  const { user, loading } = useUser("KGLTadXoTWGvqb2Tn475"); // Using the ID from the screenshot
  const location = useLocation();

  return (
    <SidebarComponent variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to={"/"}>
                <div
                  className={cn(
                    "flex aspect-square items-center justify-center transition-all duration-300",
                    isExpanded ? "size-10" : "size-8",
                  )}
                >
                  <picture className="site-front-logo">
                    <source src={MarkLogo} />
                    <img
                      src={MarkLogo}
                      alt="Site front logo"
                      className="w-full h-full"
                    />
                  </picture>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-2xl text-secondary">
                    MARK
                  </span>
                  <span className="truncate">Marketing Agent</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation group */}
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 my-auto">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="cursor-pointer text-on-secondary bg-secondary min-w-8 duration-300 ease-linear font-medium hover:bg-on-secondary hover:text-secondary hover:border-secondary border"
                  onClick={() => setIsModalOpen(true)}
                >
                  <CirclePlus />
                  <span>Create post</span>
                </SidebarMenuButton>
                <CreatePostModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      {item.items ? (
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={location.pathname === item.to}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={location.pathname === item.to}
                          tooltip={item.title}
                        >
                          <Link to={item.to}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </CollapsibleTrigger>
                    {item.items && (
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
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Assistant group */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Assistant</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/chat">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>Chat with Mark</span>
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Settings button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User/company profile card */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.photo_url || "https://i.pravatar.cc/150?img=8"}
                  alt={user?.user_name || "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.user_name
                    ?.split("_")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "OS"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {loading ? (
                  <>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="mt-1 h-3 w-32 bg-gray-100 animate-pulse rounded" />
                  </>
                ) : (
                  <>
                    <span className="truncate font-semibold text-gray-900">
                      {user?.user_name}
                    </span>
                    <span className="truncate text-xs text-on-surface-variant">
                      {user?.job_title}
                    </span>
                  </>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
}
