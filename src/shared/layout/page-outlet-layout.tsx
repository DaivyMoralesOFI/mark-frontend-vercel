// page-outlet-layout.tsx
//
// This file defines the PageOutletLayout component, which provides a reusable layout for content pages.
// It includes a site header with actions, a scrollable main area, and a grid wrapper for children.

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { AppHeaderActions } from "@/shared/types/types";
import { SiteHeader } from "../router";

/**
 * Props for PageOutletLayout
 */
interface PageOutletLayoutProps {
  pageTitle: string;
  children: React.ReactNode;
  actions: AppHeaderActions[];
  className?: string;
  headerContent?: React.ReactNode;
}

/**
 * PageOutletLayout
 *
 * Provides a reusable layout for content pages, including:
 * - Site header with title and actions
 * - Scrollable main content area
 * - Responsive grid wrapper for children
 *
 * @param pageTitle Title to display in the header
 * @param actions List of header actions
 * @param className Optional additional class names for the main area
 * @param children Content to render inside the layout
 */
const PageOutletLayout: React.FC<PageOutletLayoutProps> = ({
  pageTitle,
  children,
  actions,
  className,
  headerContent,
}) => {
  return (
    <div className="h-full w-full flex flex-col">
      <SiteHeader actions={actions} title={pageTitle} headerContent={headerContent} />
      <main className={`main-content w-full py-2 px-4 max-sm:px-2 ${className}`}>
        <ScrollArea className="h-[87svh] md:h-[80svh] xl:h-[86svh] w-full">
          <div className="wrapper-main grid grid-cols-12 gap-2">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default PageOutletLayout;
