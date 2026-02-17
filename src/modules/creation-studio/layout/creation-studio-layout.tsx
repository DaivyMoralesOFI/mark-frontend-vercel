import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Sidebar } from "@/shared/components/sidebar/Sidebar";
import AppHeader from "@/shared/components/header/app-header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const CreationStudioLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-w-screen min-h-screen max-w-screen max-h-screen h-screen w-screen relative p-0 m-0 overflow-hidden bg-surface">
      <SidebarProvider
        open={isOpen}
        onOpenChange={setIsOpen}
        className="relative"
      >
        <Sidebar />
        <div className="w-screen h-full px-3 flex flex-col">
          <AppHeader />
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="relative h-full w-full overflow-hidden border border-outline-variant bg-surface-container rounded-lg">
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

