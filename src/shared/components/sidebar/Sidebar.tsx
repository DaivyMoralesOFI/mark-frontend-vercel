import {
  BarChart3,

  Home,
  Settings,
  TrendingUp,
  Bot,
  Dna,
  User,
  CirclePlus,
  Calendar,
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
} from "@/shared/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import MarkLogo from "@/assets/logos/mark-colored.svg";
import { cn } from "@/core/lib/utils";
import { useUser } from "@/core/hooks/useUser";

// Navigation items for the main sidebar menu
const navigationItems = [
  { title: "Dashboard", icon: Home, isActive: false, to: "/dashboard" },
  { title: "Analytics", icon: BarChart3, isActive: false, to: "/analytics" },
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
  const { user, loading } = useUser("bb355aba-a0e9-4431-9ea9-e94080d85ac2"); // Using the ID from the screenshot

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
                <SidebarMenuItem key={item.title}>
                  {item.to ? (
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.to}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
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
                  {user?.user_name?.split("_").map((n: string) => n[0]).join("").toUpperCase() || "OS"}
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
