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
        className="bg-surface dark:bg-[#0F0F0F]"
      >
        <Sidebar />
        <SidebarInset className="flex-1 h-screen overflow-auto bg-surface dark:bg-[#0F0F0F]">
          <main className="h-full w-full overflow-auto p-0">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default CreationStudioLayout;

