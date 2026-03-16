// dashboard-layout.tsx
//
// This file defines the DashboardLayout component, which provides the main layout for dashboard pages.
// It includes the sidebar and a content outlet area, and manages sidebar open/close state.

import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar";
import { Sidebar } from "@/shared/components/sidebar/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

/**
 * DashboardLayout
 *
 * Provides the main layout for dashboard pages, including:
 * - Sidebar navigation (collapsible)
 * - Main content outlet (renders child routes)
 *
 * Manages sidebar open/close state and applies responsive styling.
 */
const DashboardLayout = () => {
  // State for sidebar open/close
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="dashboard-layout text-on-surface w-full min-h-screen relative">
      <SidebarProvider
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-neutral-200/50 dark:bg-[#1C1C1C]"
      >
        <Sidebar />
        {/*  <Toaster /> */}
        <SidebarInset className="flex-1 h-screen overflow-auto bg-surface dark:bg-[#1c1a14]">
          <div className="h-full w-full p-4 lg:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
