import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";
import { Actions, Trigger } from "@/shared/types/types";
import { useEffect } from "react";
import { cn } from "@/core/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { AppHeaderActions, SiteHeader } from "../router";

type PageProps<T extends string | undefined = undefined> = {
  pageTitle: string;
  title?: string;
  className?: string;
  layout?: "flex" | "grid";
} & (T extends `${string}with-tabs${string}` | "with-tabs"
  ? {
      triggers: Trigger[];
      tabsContent: React.ReactNode[];
      defaultTrigger: string;
      tabActions?: Actions[];
      children?: never;
    }
  : {
      triggers?: never;
      tabsContent?: never;
      defaultTrigger?: never;
      tabActions?: never;
      children: React.ReactNode;
    }) &
  (T extends `${string}with-actions${string}` | "with-actions"
    ? {
        actions: Actions[];
      }
    : { actions?: never }) &
  (T extends `${string}with-SEO${string}` | "with-SEO"
    ? {
        description: string;
        content: string;
      }
    : { description?: never; content?: never });

const PageOutletLayout = <T extends string | undefined = undefined>({
  pageTitle,
  title,
  children,
  actions,
  triggers,
  tabsContent,
  defaultTrigger,
  tabActions,
  description,
  content,
  className,
  layout = "grid",
}: PageProps<T>) => {
  // Update document title when component mounts or pageTitle changes
  useEffect(() => {
    document.title = `${pageTitle} | HR-Agent | SOFIA Tech`;

    // Optional: Set meta description if provided
    if (description && content) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", `${description}: ${content}`);
    }
  }, [pageTitle, description, content]);

  // Validación: triggers y tabsContent deben tener el mismo tamaño
  if (triggers && tabsContent) {
    if (triggers.length !== tabsContent.length) {
      console.error(
        `Error: triggers (${triggers.length}) and tabsContent (${tabsContent.length}) must have the same length`,
      );
      return null;
    }
    return (
      <div className="h-full w-full max-w-full flex flex-col bg-surface-container text-on-surface px-0 overflow-hidden">
        <Tabs defaultValue={defaultTrigger} className="w-full p-0">
          {actions && <SiteHeader title={title || ""} actions={actions} />}
          <TabsList className="h-12 w-full flex justify-between items-center bg-surface border-b-1 border-outline-variant pr-4">
            <div className="w-full max-w-1/2 flex items-start h-full">
              {triggers.map((trigger, index) => (
                <TabsTrigger
                  key={index}
                  value={trigger.slug}
                  className="capitalize flex flex-row items-center"
                >
                  <trigger.icon />
                  <p>{trigger.label}</p>
                </TabsTrigger>
              ))}
            </div>
            {tabActions && <AppHeaderActions actions={tabActions} />}
          </TabsList>
          {tabsContent.map((content, index) => (
            <TabsContent key={index} value={triggers[index].slug}>
              <div
                className={cn(
                  `main-content w-full h-full min-h-[calc(100svh-13em)] overflow-auto  ${className}`,
                  "max-sm:px-2",
                )}
              >
                <div
                  className={cn(
                    "wrapper-layout gap-2 h-full",
                    layout === "flex" ? "flex flex-col" : "grid grid-cols-12",
                    className,
                  )}
                >
                  {content}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-surface-container text-on-surface px-0">
      <SiteHeader title={title || ""} actions={actions} />
      <div className="relative w-full">
        <ScrollArea
          className={cn(
            title ? "h-[calc(100svh-10em)] " : "h-[calc(100svh-8em)] ",
            "w-full ",
          )}
        >
          <div
            className={cn(
              "wrapper-layout gap-2 pt-4 min-h-[calc(100svh-10em-0.1em)]",
              layout === "flex" ? "flex flex-col" : "grid grid-cols-12",
              className,
            )}
          >
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default PageOutletLayout;
