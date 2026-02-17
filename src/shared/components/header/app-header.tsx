// app-header.tsx
//
// This file defines the AppHeader component, which renders the main application header bar.
// It includes search, assistant, notifications, theme toggle, filters, and user profile actions, styled with Tailwind CSS.

import {
  Bell,
  Store,
  MessageCircle,
} from "lucide-react";
import { ToggleTheme, TooltipHover } from "@/core/router/router";
import { Button } from "@/shared/components/ui/button";
import AccountSelector from "../dropdown/account-selector";


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
    <header className="bg-surface group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full transition-[width,height] ease-linear">
      <div className="flex flex-row items-center justify-between px-3 py-2 w-auto max-w-svw">
        <div className="navbar-brand min-w-[200px] 2xl:min-w-[300px] min-h-8 h-full flex flex-row justify-start items-center relative">
          {/* Brand logo and name removed as requested */}
        </div>
        {/* Actions section: marketplace, notifications, theme, filters, profile */}
        <div className="appbar-cta flex items-center justify-between gap-2">
          <TooltipHover title="Explore AI Agents" content="" className="">
            <Button
              variant="default"
              size="sm"
              className="group cursor-pointer border-primary/20 hover:border-primary/50 transition-colors shadow-none bg-surface-container-low"
            >
              <div className="flex items-center gap-2">
                <Store size={16} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium text-[12px]">Agents Marketplace</span>
              </div>
            </Button>
          </TooltipHover>

          <TooltipHover
            title="Chat with Mark"
            content=""
            className="hidden md:inline-flex"
          >
            <Button
              variant="default"
              size="sm"
              className="group cursor-pointer border-primary/20 hover:border-primary/50 transition-colors shadow-none bg-surface-container-low"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium text-[12px]">Ask Mark</span>
              </div>
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
          <AccountSelector />
        </div>
      </div>
    </header>
  );
}
