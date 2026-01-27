// dashboard-layout.tsx
//
// This file defines the DashboardLayout component, which provides the main layout for dashboard pages.
// It includes the sidebar, header, and a content outlet area, and manages sidebar open/close state.

import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Sidebar } from "@/shared/components/sidebar/Sidebar";
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
    <div className="dashboard-layout text-on-surface max-w-screen min-h-screen bg-surface relative">
      <SidebarProvider
        open={isOpen}
        onOpenChange={setIsOpen}
        className="relative "
      >
        <Sidebar />
        {/*  <Toaster /> */}
        <div className="w-screen h-full ">
          <AppHeader />
          <SidebarInset>
            <div className="outlet-container overflow-hidden border border-outline-variant bg-surface-container rounded-lg max-h-[calc(100vh-5px)]  md:max-h-[calc(100vh-5em)]">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
