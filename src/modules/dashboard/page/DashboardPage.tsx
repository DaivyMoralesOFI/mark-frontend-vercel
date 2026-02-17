import { useState } from "react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { OverviewSection } from "../components/dashboard-view/overview/OverviewSection";
import { SocialPerformanceSection } from "../components/dashboard-view/social/SocialPerformanceSection";
import { BestPostsSection } from "../components/dashboard-view/posts/BestPostsSection";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { useModals } from "@/shared/hooks/useModals";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { Actions } from "@/shared/types/types";
import { useSearchParams } from "react-router-dom";
import { SocialNetworkPage } from "@/modules/social-network/page/SocialNetworkPage";
import type { TimePeriod } from "../data/dashboardMockData";
import { DatePickerWithRange } from "../components/dashboard-view/overview/DatePickerWithRange";
import { cn } from "@/shared/utils/utils";
import { getPlatformData } from "@/modules/social-network/data/mockData";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    Facebook: FacebookIcon,
    LinkedIn: LinkedInIcon,
};

export const DashboardPage = () => {
    const { showCreatePost, closeCreatePost } = useModals();
    const [searchParams] = useSearchParams();
    const platform = searchParams.get("platform");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("30days");
    const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

    const pageActions: Actions[] = [];

    // Unified header with title and time switcher
    const renderHeader = (title: React.ReactNode, showSwitcher: boolean = true) => (
        <div className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div className="flex flex-col">
                {typeof title === "string" ? (
                    <h2 className="text-2xl font-medium text-on-surface">{title}</h2>
                ) : (
                    title
                )}
            </div>

            {showSwitcher && (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-surface-container-low border border-outline-variant rounded-xl">
                        {[
                            { label: "D", value: "7days" },
                            { label: "M", value: "30days" },
                            { label: "Y", value: "90days" },
                            { label: "All", value: "all" },
                        ].map((option) => (
                            <button
                                key={option.label}
                                onClick={() => setTimePeriod(option.value as TimePeriod)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium transition-all rounded-lg",
                                    timePeriod === option.value
                                        ? "bg-white dark:bg-surface-bright shadow-sm text-gray-900 dark:text-on-surface"
                                        : "text-on-surface-variant hover:text-on-surface"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}

                        <DatePickerWithRange
                            initialRange={customRange}
                            onSelect={(range) => {
                                setCustomRange(range);
                                setTimePeriod("custom");
                            }}
                            customTrigger={
                                <button
                                    className={cn(
                                        "px-4 py-1.5 text-xs font-medium transition-all rounded-lg whitespace-nowrap",
                                        timePeriod === "custom"
                                            ? "bg-white dark:bg-surface-bright shadow-sm text-gray-900 dark:text-on-surface"
                                            : "text-on-surface-variant hover:text-on-surface"
                                    )}
                                >
                                    {timePeriod === "custom" && customRange?.from ? (
                                        <span className="flex items-center">
                                            {format(customRange.from, "dd MMM")}
                                            {customRange.to && ` - ${format(customRange.to, "dd MMM")}`}
                                        </span>
                                    ) : (
                                        "Custom"
                                    )}
                                </button>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );

    // If a platform is selected, render the social network view
    if (platform) {
        const data = getPlatformData(platform, timePeriod);
        const Icon = data ? platformIcons[data.profile.name] : null;

        const richTitle = data ? (
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant shadow-sm">
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-on-surface tracking-tight leading-tight">{data.profile.name}</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Connected</span>
                    </div>
                </div>
            </div>
        ) : `${platform.charAt(0).toUpperCase() + platform.slice(1)} Analytics`;

        return (
            <>
                <PageOutletLayout<"with-actions">
                    pageTitle={data ? data.profile.name : "Analytics"}
                    actions={pageActions}
                    className="px-6 pt-6 pb-6 gap-0 h-full overflow-hidden"
                    outerClassName="bg-surface"
                >
                    {renderHeader(richTitle)}
                    <div className="col-span-12 mt-4 h-[calc(100vh-200px)]">
                        <SocialNetworkPage timePeriod={timePeriod} />
                    </div>
                </PageOutletLayout>
                <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
            </>
        );
    }

    return (
        <>
            <PageOutletLayout<"with-actions">
                pageTitle="Dashboard"
                actions={pageActions}
                className="px-6 py-6 gap-6"
                outerClassName="bg-surface"
            >
                {renderHeader("Overview")}
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left column: KPIs + Social Performance */}
                    <div className="lg:col-span-7 flex flex-col gap-6 lg:border-r lg:border-outline-variant lg:pr-6">
                        <OverviewSection
                            timePeriod={timePeriod}
                        />
                        <SocialPerformanceSection timePeriod={timePeriod} />
                    </div>
                    {/* Right column: Best Posts */}
                    <div className="lg:col-span-5">
                        <BestPostsSection timePeriod={timePeriod} />
                    </div>
                </div>
            </PageOutletLayout>
            <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
        </>
    );
};

export default DashboardPage;
