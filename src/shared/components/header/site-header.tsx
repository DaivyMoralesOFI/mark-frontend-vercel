// site-header.tsx
//
// This file defines the SiteHeader component, which renders the main site header with a sidebar toggle, title, and action buttons.
// It supports navigation, custom actions, and responsive design, styled with Tailwind CSS.

import { Link } from "react-router-dom";
import { SidebarIcon } from "lucide-react";
import { AppHeaderActions } from "@/shared/types/types";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";

/**
 * Props for SiteHeader
 * @property {string} title - The title to display in the header
 * @property {AppHeaderActions[]} actions - Array of action button definitions
 * @property {React.ReactNode} headerContent - Optional custom content to render in the header
 */
interface SiteHeaderProps {
  title: string;
  actions: AppHeaderActions[];
  headerContent?: React.ReactNode;
}

/**
 * SiteHeader
 *
 * Renders the main site header with a sidebar toggle, title, and action buttons.
 * - Supports navigation links and custom actions
 * - Responsive design for desktop and mobile
 */
const SiteHeader = ({ title, actions, headerContent }: SiteHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="page-hader w-full flex flex-row justify-between items-end py-2 pr-4 pl-2 border-b border-border">
      <div className="title-content flex flex-row">
        {/* Sidebar toggle button */}
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        {/* Page title */}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {/* Action buttons (links or custom actions) */}
      <div className="cta-header-actions hidden md:inline-flex flex-row gap-2 items-center">
        {/* Custom header content (e.g., CompanyDropdown) */}
        {headerContent}
        {actions.map((action, index) => {
          const Icon = action.icon;
          const type = action.type;
          const buttonProps = {
            variant: action.variant || "default",
            className:
              action.className || "pl-1 pr-2 py-1 text-[12px] font-medium",
            onClick: action.onClick,
          };

          if (type == "link") {
            return (
              <Link key={`action-link-${index}`} to={action.href ?? "/"}>
                <Button {...buttonProps}>
                  <Icon className="h-4 w-4 mr-1" />
                  <span>{action.label}</span>
                </Button>
              </Link>
            );
          }

          return (
            <Button key={`action-link-${index}`} {...buttonProps}>
              <Icon className="h-4 w-4 mr-1" />
              <p>{action.label}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SiteHeader;
