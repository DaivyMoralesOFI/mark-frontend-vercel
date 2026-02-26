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
          <SidebarInset className="flex-1 overflow-hidden rounded-2xl border border-sidebar-border bg-surface dark:bg-[#1c1a14] relative">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-surface-container">
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                    linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 0",
                  maskImage: `
                    repeating-linear-gradient(
                      to right,
                      black 0px,
                      black 3px,
                      transparent 3px,
                      transparent 8px
                    ),
                    repeating-linear-gradient(
                      to bottom,
                      black 0px,
                      black 3px,
                      transparent 3px,
                      transparent 8px
                    )
                  `,
                  WebkitMaskImage: `
                    repeating-linear-gradient(
                      to right,
                      black 0px,
                      black 3px,
                      transparent 3px,
                      transparent 8px
                    ),
                    repeating-linear-gradient(
                      to bottom,
                      black 0px,
                      black 3px,
                      transparent 3px,
                      transparent 8px
                    )
                  `,
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
              />
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

