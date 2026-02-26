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
        className="relative bg-neutral-200/50"
      >
        <Sidebar />
        {/*  <Toaster /> */}
        <div className="flex-1 h-screen flex flex-col p-1 pr-1 md:py-2 md:pr-2 overflow-hidden">
          <SidebarInset className="flex-1 overflow-hidden rounded-2xl border-[1px] border-neutral-300 bg-surface dark:bg-[#1c1a14] relative">
            <div className="outlet-container h-full w-full overflow-hidden relative rounded-2xl p-4 lg:p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
