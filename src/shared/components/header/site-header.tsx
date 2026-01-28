import { SidebarTrigger } from "../ui/sidebar";
import { Actions } from "@/shared/types/types";
import { AppHeaderActions } from "@/shared/router";
import DynamicBradcrumbs from "@/shared/components/breadcrumbs/breadcrumb-router";

interface SiteHeaderProps {
  title: string;
  actions?: Actions[];
}

const SiteHeader = ({ title, actions }: SiteHeaderProps) => {
  return (
    <div className="page-header w-full min-h-10 h-fit flex flex-col md:flex-row items-start md:items-end justify-between gap-2 py-2 px-4 bg-surface-container-lowest border-b border-outline-variant">
      <div className="title-content flex flex-row lg:flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <SidebarTrigger />
          <DynamicBradcrumbs />
        </div>
        <h1 className=" text-2xl font-bold">{title}</h1>
      </div>
      <div className="cta-header-actions flex flex-row gap-2 overflow-x-auto md:overflow-x-visible scrollbar-hide pb-2 md:pb-0">
        {actions && <AppHeaderActions actions={actions} />}
      </div>
    </div>
  );
};

export default SiteHeader;
