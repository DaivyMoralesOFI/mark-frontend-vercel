import { SidebarInset, SidebarProvider } from "@/shared/components/ui/Sidebar";
import { Sidebar } from "@/shared/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const CreationStudioLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="dashboard-layout text-on-surface w-full min-h-screen relative">
      <SidebarProvider
        open={isOpen}
        onOpenChange={setIsOpen}
        className="relative bg-transparent"
      >
        <Sidebar />
        <div className="flex-1 h-screen flex flex-col p-1 pr-1 md:py-2 md:pr-2 overflow-hidden">
          <SidebarInset className="flex-1 overflow-hidden rounded-2xl border border-sidebar-border bg-surface dark:bg-[#0F0F0F] relative">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface-container dark:bg-[#0F0F0F]">
              <main className="h-full w-full overflow-auto relative z-10 p-0">
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CreationStudioLayout;

