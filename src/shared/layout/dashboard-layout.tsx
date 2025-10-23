// dashboard-layout.tsx
//
// This file defines the DashboardLayout component, which provides the main layout for dashboard pages.
// It includes the sidebar, header, and a content outlet area, and manages sidebar open/close state.

import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Sidebar } from "@/shared/components/Sidebar";
import { AppHeader } from "@/shared/router";
import { useState } from "react";
import { Outlet } from "react-router-dom";

/**
 * DashboardLayout
 *
 * Provides the main layout for dashboard pages, including:
 * - Sidebar navigation (collapsible)
 * - App header
 * - Main content outlet (renders child routes)
 *
 * Manages sidebar open/close state and applies responsive styling.
 */
const DashboardLayout = () => {
  // State for sidebar open/close
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="dashboard-layout bg-background text-foreground min-w-screen min-h-screen max-w-svw">
      <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
        <Sidebar />
        <div className="flex flex-row w-full max-h-svh h-full overflow-hidden">
          <div className="flex flex-col w-full">
            <AppHeader />
            <SidebarInset className="px-2">
              <div className="outlet-container border border-border rounded-sm bg-background min-h-[calc(100svh-60px)] max-h-[calc(100svh-60px)] w-full h-full">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
