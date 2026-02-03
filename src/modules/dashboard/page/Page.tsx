import { useState } from "react";
import { MetricsGrid } from "@/modules/dashboard/MetricsGrid";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { PerformanceChart } from "@/modules/dashboard/PerformaceChart";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus, Mail, Video, MessageCircle, ImageIcon } from "lucide-react";
import { CreatePostModal } from "@/modules/create-post/components/CreatePostModal";
import { CreateVideoModal } from "@/modules/create-video/createVideoModal";
import { AiChatModal } from "@/modules/chat-coach-modal/page/AiChatModal";
import { SendEmailModal } from "@/modules/send-email/SendEmail";
import EditImageModal from "@/modules/edit-image-modal/EditImageModal";
import { Actions } from "@/shared/types/types";

export default function Dashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [showAskMark, setShowAskMark] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);

  const pageActions: Actions[] = [
    {
      children: "Create Post",
      icon: Plus,
      onClick: () => setShowCreatePost(true),
      variant: "default",
      type: "button",
    },
    {
      children: "Create Video",
      icon: Video,
      onClick: () => setShowCreateVideo(true),
      variant: "default",
      type: "button",
    },
    {
      children: "Edit Image",
      icon: ImageIcon,
      onClick: () => setShowEditImage(true),
      variant: "default",
      type: "button",
    },
  ];

  return (
    <>
      <PageOutletLayout<"with-actions">
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
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      <CreateVideoModal
        isOpen={showCreateVideo}
        onClose={() => setShowCreateVideo(false)}
      />
      <EditImageModal
        isOpen={showEditImage}
        onClose={() => setShowEditImage(false)}
      />
      <SendEmailModal
        isOpen={showSendEmail}
        onClose={() => setShowSendEmail(false)}
      />
      <AiChatModal isOpen={showAskMark} onClose={() => setShowAskMark(false)} />
    </>
  );
}
