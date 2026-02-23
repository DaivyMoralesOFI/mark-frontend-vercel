
import { Actions } from "@/shared/types/types";
import { AppHeaderActions } from "@/core/router/router";
import DynamicBradcrumbs from "@/shared/components/breadcrumbs/breadcrumb-router";
import {
  Bell,
  Store,
  MessageCircle,
} from "lucide-react";
import { ToggleTheme, TooltipHover } from "@/core/router/router";
import { Button } from "@/shared/components/ui/button";
import AccountSelector from "../dropdown/account-selector";

interface SiteHeaderProps {
  title: string;
  actions?: Actions[];
}

const SiteHeader = ({ title, actions }: SiteHeaderProps) => {
  return (
    <div className="page-header w-full min-h-10 h-fit flex flex-col md:flex-row items-start md:items-end justify-between gap-2 py-2 px-4">
      <div className="title-content flex flex-row lg:flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <DynamicBradcrumbs />
        </div>
        <h1 className=" text-2xl font-bold">{title}</h1>
      </div>
      <div className="cta-header-actions flex flex-row items-center gap-2 overflow-x-auto md:overflow-x-visible scrollbar-hide pb-2 md:pb-0">
        {actions && <AppHeaderActions actions={actions} />}

        {/* Global actions moved from AppHeader */}
        <div className="appbar-cta flex items-center justify-between gap-2 ml-2 pl-2 border-l border-outline-variant">
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
    </div>
  );
};

export default SiteHeader;
