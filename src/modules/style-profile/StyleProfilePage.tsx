import { useState } from "react";
import { StylePreferences } from "./StylePreferences"
import { FeedbackOverview } from "./FeedbackOverview"
import { LearningProgress } from "./LearningProgress"
import { LearningSettings } from "./LearningSettings"
import { RecentFeedback } from "./RecentFeedback"
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { AppHeaderActions } from "@/shared/types/types";
import { GraduationCap } from "lucide-react";
import { TrainModelModal } from "@/modules/train-model-modal/TrainModelModal";

export function StyleProfilePage() {
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);

  const pageActions: AppHeaderActions[] = [
    {
      label: "Train",
      icon: GraduationCap,
      onClick: () => setIsTrainModalOpen(true),
      variant: "default",
    },
  ];

  return (
    <>
      <PageOutletLayout pageTitle="Style Profile" actions={pageActions}>
        {/* First Row - Key Metrics */}
        <div className="col-span-12 md:col-span-6">
          <FeedbackOverview />
        </div>
        <div className="col-span-12 md:col-span-6">
          <LearningProgress />
        </div>

        {/* Second Row - Style Preferences and Learning Settings */}
        <div className="col-span-12 md:col-span-8">
          <StylePreferences />
        </div>
        <div className="col-span-12 md:col-span-4">
          <LearningSettings />
        </div>

        {/* Third Row - Recent Feedback Full Width */}
        <div className="col-span-12">
          <RecentFeedback />
        </div>
      </PageOutletLayout>
      <TrainModelModal isOpen={isTrainModalOpen} onClose={() => setIsTrainModalOpen(false)} />
    </>
  )
}
