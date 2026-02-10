import { OverviewSection } from "../components/dashboard-view/overview/OverviewSection";
import { SocialPerformanceSection } from "../components/dashboard-view/social/SocialPerformanceSection";
import { BestPostsSection } from "../components/dashboard-view/posts/BestPostsSection";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus } from "lucide-react";
import { useModals } from "@/shared/hooks/useModals";
import { CreatePostModal } from "@/domains/creation-studio/post-creator/components/CreatePostModal";
import { Actions } from "@/shared/types/types";

export const DashboardPage = () => {
    const { showCreatePost, openCreatePost, closeCreatePost } = useModals();

    const pageActions: Actions[] = [
        {
            type: "button" as const,
            children: "Create Post",
            icon: Plus,
            onClick: openCreatePost,
            variant: "default" as const,
        },
    ];

    return (
        <>
            <PageOutletLayout<"with-actions">
                pageTitle="Dashboard"
                actions={pageActions}
                className="px-6 py-6 gap-6"
                outerClassName="bg-gray-50/50"
            >
                <div className="col-span-12">
                    <OverviewSection />
                </div>
                <div className="col-span-12">
                    <SocialPerformanceSection />
                </div>
                <div className="col-span-12">
                    <BestPostsSection />
                </div>
            </PageOutletLayout>
            <CreatePostModal isOpen={showCreatePost} onClose={closeCreatePost} />
        </>
    );
};

export default DashboardPage;
