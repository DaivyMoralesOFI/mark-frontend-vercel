import { useState } from "react";
import { OverviewSection } from "../components/dashboard-view/overview/OverviewSection";
import { SocialPerformanceSection } from "../components/dashboard-view/social/SocialPerformanceSection";
import { BestPostsSection } from "../components/dashboard-view/posts/BestPostsSection";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus } from "lucide-react";
import { useModals } from "@/shared/hooks/useModals";
import { CreatePostModal } from "@/domains/creation-studio/post-creator/components/CreatePostModal";
import { Actions } from "@/shared/types/types";
import { useSearchParams } from "react-router-dom";
import { SocialNetworkPage } from "@/domains/social-network/page/SocialNetworkPage";
import type { TimePeriod } from "../data/dashboardMockData";

export const DashboardPage = () => {
    const { showCreatePost, openCreatePost, closeCreatePost } = useModals();
    const [searchParams] = useSearchParams();
    const platform = searchParams.get("platform");
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("30days");

    const pageActions: Actions[] = [
        {
            type: "button" as const,
            children: "Create Post",
            icon: Plus,
            onClick: openCreatePost,
            variant: "default" as const,
        },
    ];

    // If a platform is selected, render the social network view
    if (platform) {
        return (
            <>
                <PageOutletLayout<"with-actions">
                    pageTitle={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Analytics`}
                    actions={pageActions}
                    className="px-6 py-6 gap-6"
                    outerClassName="bg-white"
                >
                    <div className="col-span-12">
                        <SocialNetworkPage />
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
                outerClassName="bg-white"
            >
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left column: KPIs + Social Performance */}
                    <div className="lg:col-span-7 flex flex-col gap-6 lg:border-r lg:border-gray-200 lg:pr-6">
                        <OverviewSection
                            timePeriod={timePeriod}
                            onTimePeriodChange={setTimePeriod}
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
