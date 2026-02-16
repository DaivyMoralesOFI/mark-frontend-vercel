import { Link } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppHeader } from "@/core/router/router";
import { useState } from "react";

export default function NotFoundPage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="dashboard-layout bg-surface-container text-on-surface min-w-screen min-h-screen max-w-svw">
      <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col w-full max-h-svh h-full overflow-hidden">
          <AppHeader />
          <SidebarInset className="px-2">
            <div className="outlet-container border border-outline rounded-sm bg-surface min-h-[calc(100svh-60px)] max-h-[calc(100svh-60px)] w-full h-full overflow-hidden">
              <main className="main-content max-w-full w-full max-h-full h-full overflow-hidden p-0 m-0 relative">
                <div className="relative z-10 flex flex-col items-center justify-center h-screen text-on-surface">

                  <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                  <p className="mt-4 text-lg">
                    Sorry, the page you are looking for does not exist.
                  </p>
                  <Link
                    to="/"
                    className="mt-6 bg-secondary-container text-on-secondary-container rounded-md px-8 py-1 cursor-pointer"
                  >
                    <span>Go Back</span>
                  </Link>
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
