import { useState } from "react";
import { MetricsGrid } from "@/modules/dashboard/MetricsGrid";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { PerformanceChart } from "@/modules/dashboard/PerformaceChart";
import { AppHeaderActions } from "@/shared/types/types";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus, Bot } from "lucide-react";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";

export default function Dashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);

  const pageActions: AppHeaderActions[] = [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
    },
    {
      label: "Ask Mark",
      icon: Bot,
      onClick: () => setShowAskMark(true),
      variant: "secondary",
    }
  ];

  return (
    <>
      <PageOutletLayout
        pageTitle="Dashboard"
        actions={pageActions}
      >
        <div className="global-card-content col-span-12 mb-4">
          <MetricsGrid />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-12">
          <div>
            <PerformanceChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </PageOutletLayout>
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
    </>
  );
}
