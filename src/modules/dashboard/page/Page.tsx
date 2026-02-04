import { useState } from "react";
import { MetricsGrid } from "@/modules/dashboard/MetricsGrid";
import { RecentActivity } from "@/modules/dashboard/RecentActivity";
import { PerformanceChart } from "@/modules/dashboard/PerformaceChart";
import { LastPostCard } from "@/modules/dashboard/LastPostCard";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Plus, Video, MessageCircle, ImageIcon } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 col-span-12 mb-4">
          <div className="lg:col-span-1 h-full">
            <LastPostCard />
          </div>
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-12">
          <div>
            <RecentActivity />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg">Need more insights?</h3>
            <p className="text-sm text-gray-500">Ask Mark for personalized advice on your social media strategy.</p>
            <button
              onClick={() => setShowAskMark(true)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Ask Mark
            </button>
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
