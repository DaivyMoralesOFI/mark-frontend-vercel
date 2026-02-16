// app-header.tsx
//
// This file defines the AppHeader component, which renders the main application header bar.
// It includes search, assistant, notifications, theme toggle, filters, and user profile actions, styled with Tailwind CSS.

import { useState } from "react";
import {
  Bell,
  Store,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { ToggleTheme, TooltipHover } from "@/core/router/router";
import { Button } from "@/shared/components/ui/button";
import { TrainModelModal } from "@/domains/creation-studio/brand-dna/train-model-modal/TrainModelModal";
import AccountSelector from "../dropdown/account-selector";
import OFILogoHDark from "@/assets/logos/ofi-dark.webp";
import OFILogoHLight from "@/assets/logos/ofi-white.webp";

/**
 * AppHeader
 *
 * Renders the main application header bar, including:
 * - Search and assistant buttons
 * - Marketplace, notifications, theme toggle, filters, and user profile actions
 * - Responsive and styled for a modern UI
 */
export default function AppHeader() {
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  return (
    <header className="bg-sidebar group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full transition-[width,height] ease-linear">
      <div className="flex flex-row items-center justify-between px-3 py-2 w-auto max-w-svw">
        <div className="navbar-brand min-w-[200px] 2xl::min-w-[300px] min-h-8 h-full flex flex-row justify-start items-center relative">
          <div className="flex flex-row justify-start items-center relative">
            <picture className="absolute h-full -top-3 -left-1 inline-flex dark:hidden">
              <source src={OFILogoHLight} />
              <img
                src={OFILogoHLight}
                alt="SOFIA Technology logo concept"
                className="w-10 h-10"
              />
            </picture>
            <picture className="absolute h-full -top-3 -left-1 hidden dark:inline-flex">
              <source src={OFILogoHDark} />
              <img
                src={OFILogoHDark}
                alt="SOFIA Technology logo concept"
                className="w-10 h-10"
              />
            </picture>
            <p className="navbar-brand pl-10 font-bold">SERVICES</p>
          </div>
        </div>
        {/* Actions section: marketplace, notifications, theme, filters, profile */}
        <div className="appbar-cta flex items-center justify-between gap-2">
          <TooltipHover title="Train your AI model" content="" className="">
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsTrainModalOpen(true)}
              className="cursor-pointer pr-3 pl-2 py-1 border-1 border-secondary w-auto h-7 rounded-sm"
            >
              <GraduationCap strokeWidth={2} size={16} />
              <span>Train</span>
            </Button>
          </TooltipHover>
          <TooltipHover title="Integrate new agents" content="" className="">
            <Button
              variant="default"
              size="icon"
              className="cursor-pointer pr-3 pl-2 py-1 border-0 w-auto h-7 rounded-sm bg-linear-to-r/oklab from-pink-300 to-purple-300 text-on-secondary"
            >
              <Store strokeWidth={2} size={16} />
              <span>Agents MarketPlace</span>
            </Button>
          </TooltipHover>
          <TooltipHover
            title="Ask Mark"
            content=""
            className="hidden md:inline-flex"
          >
            <Button variant="secondary">
              <MessageCircle strokeWidth={2} size={16} />
              <span>Ask Mark</span>
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
      <TrainModelModal
        isOpen={isTrainModalOpen}
        onClose={() => setIsTrainModalOpen(false)}
      />
    </header>
  );
}
