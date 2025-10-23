// app-header.tsx
//
// This file defines the AppHeader component, which renders the main application header bar.
// It includes search, assistant, notifications, theme toggle, filters, and user profile actions, styled with Tailwind CSS.

import { Bell, Filter, Search, Store } from "lucide-react";
import { AvatarDropdown, ToggleTheme, TooltipHover } from "@/shared/router";
import { Button } from "@/shared/components/ui/button";

/**
 * AppHeader
 *
 * Renders the main application header bar, including:
 * - Search and assistant buttons
 * - Marketplace, notifications, theme toggle, filters, and user profile actions
 * - Responsive and styled for a modern UI
 */
export default function AppHeader() {
  return (
    <header className="bg-background group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full transition-[width,height] ease-linear">
      <div className="flex flex-row items-center justify-between px-3 py-2 w-auto max-w-svw">
        {/* Search and assistant section */}
        <div className="command-container flex-2 flex flex-row justify-center items-center">
          <TooltipHover
            title="Search something"
            content=""
            className="hidden md:inline-flex"
          >
            <Button
              variant="outline"
              size="icon"
              className="w-auto min-w-[400px] justify-start cursor-pointer p-0 px-3 h-7 border-r-0 rounded-none rounded-tl-sm rounded-bl-sm hover:bg-background"
            >
              <Search strokeWidth={2} size={16} />
              <span className="font-light">Search</span>
            </Button>
          </TooltipHover>
          <TooltipHover
            title="use SOFIA Assistent"
            content=""
            className="hidden md:inline-flex"
          >
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer p-0 px-0 h-7 border-l-0 rounded-none rounded-tr-sm rounded-br-sm hover:bg-surface-container"
            >
              <span>✨</span>
            </Button>
          </TooltipHover>
        </div>
        {/* Actions section: marketplace, notifications, theme, filters, profile */}
        <div className="appbar-cta flex items-center justify-between gap-2">
          <TooltipHover
            title="Integrate new agents"
            content=""
            className=""
          >
            <Button
              variant="default"
              size="icon"
              className="cursor-pointer pr-3 pl-2 py-1 border-1 border-secondary w-auto h-7 rounded-sm bg-linear-to-r/oklab from-pink-300 to-purple-300 text-on-secondary"
            >
              <Store strokeWidth={2} size={16} />
              <span>Agents MarketPlace</span>
            </Button>
          </TooltipHover>
          <TooltipHover
            title="Notifications"
            content=""
            className="hidden md:inline-flex"
          >
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer p-0 px-0 h-7"
            >
              <Bell className="cursor-pointer" strokeWidth={2} size={12} />
            </Button>
          </TooltipHover>
          <TooltipHover
            title="Theme"
            content=""
            className="hidden md:inline-flex"
          >
            <ToggleTheme />
          </TooltipHover>
          <Button variant="default" className="inline-flex md:hidden rounded-sm h-7" size="sm">
            <Filter />
            <span> Filters</span>
          </Button>
          <TooltipHover title="Profile" content="" className="">
            <AvatarDropdown
              avatarSrc="https://i.pravatar.cc/150?img=8"
              onSignOut={() => {}}
              userEmail="demo@sofiatech.com"
              userName="MARK Demo"
            />
          </TooltipHover>
        </div>
      </div>
    </header>
  );
}
