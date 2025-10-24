import { useState } from "react";
import { MetricsGrid } from "@/modules/dashboard/MetricsGrid";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { PerformanceChart } from "@/modules/dashboard/PerformaceChart";
import { AppHeaderActions } from "@/shared/types/types";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus,  Mail, Video, MessageCircle } from "lucide-react";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { CreateVideoModal } from "@/modules/create-video/createVideoModal";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";
import { SendEmailModal } from "@/modules/send-email/SendEmail";

export default function Dashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);

  const pageActions: AppHeaderActions[] = [
    {
      label: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
    },
    {
      label: "Create Video",
      icon: Video,
      onClick: () => setShowCreateVideo(true),
      variant: "default",
    },
    {
      label: "Send Email",
      icon: Mail,
      onClick: () => setShowSendEmail(true),
      variant: "default",
    },
    {
      label: "Ask Mark",
      icon: MessageCircle,
      onClick: () => setShowAskMark(true),
      variant: "secondary",
    },
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
      <CreateVideoModal isOpen={showCreateVideo} onClose={() => setShowCreateVideo(false)} />
      <SendEmailModal isOpen={showSendEmail} onClose={() => setShowSendEmail(false)} />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
      
    </>
  );
}
