// Sidebar.tsx
//
// This file defines the Sidebar component, which renders the main navigation sidebar for the application.
// It includes navigation links, an AI assistant section, settings, and a user/company profile card, all styled with Tailwind CSS.

import { BarChart3, FileText, Home, Settings, TrendingUp, Bot } from "lucide-react"
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
} from "@/shared/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Link } from "react-router-dom"

// Navigation items for the main sidebar menu
const navigationItems = [
  { title: "Dashboard", icon: Home, isActive: false, to: "/dashboard" },
  { title: "Analytics", icon: BarChart3, isActive: false, to: "/analytics" },
  { title: "Content", icon: FileText, isActive: false, to: "/content" },
  { title: "Campaigns", icon: TrendingUp, isActive: false, to: "/campaigns" }
]

/**
 * Sidebar
 *
 * Renders the main navigation sidebar for the application, including:
 * - Navigation links (Dashboard, Analytics, Content, Campaigns)
 * - AI Assistant section (Chat with Mark)
 * - Settings and user/company profile card
 * - Responsive and styled for a modern UI
 */
export function Sidebar() {
  return (
    <SidebarComponent className="border-r border-border" variant="sidebar" collapsible="icon">
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[var(--sidebar-accent)]"
            >
              <div
                className="flex aspect-square header-gradient size-8 items-center justify-center rounded-lg border border-sidebar-accent"
              >
                <img src="/mark-new.png" alt="Mark" className="w-6 h-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className="truncate font-semibold text-sidebar-foreground"
                >
                  Mark AI
                </span>
                <span
                  className="truncate text-xs text-sidebar-accent-foreground"
                >
                  Marketing Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main navigation group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.to ? (
                    <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                      <Link to={item.to}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
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
        <div className=" bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/150?img=8" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Ofi Services</p>
              <p className="text-xs text-gray-500 truncate">Marketing Manager</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  )
}