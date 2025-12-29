import { useState } from "react";
import { BrandProfileProgress } from "../components/BrandProfileProgress";
import { LogoSection } from "../components/LogoSection";
import { ColorPaletteSection } from "../components/ColorPaletteSection";
import { TypographySection } from "../components/TypographySection";
import { BrandToneSection } from "../components/BrandToneSection";
import { UsageFeaturesSection } from "../components/UsageFeaturesSection";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { AppHeaderActions } from "@/shared/types/types";
import { GraduationCap } from "lucide-react";
import { TrainModelModal } from "@/modules/train-model-modal/TrainModelModal";

export function BrandDashboard() {
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
    <PageOutletLayout pageTitle="Brand DNA" actions={pageActions}>
      {/* Brand Profile Progress - Full width */}
      <div className="col-span-12">
        <BrandProfileProgress />
      </div>

      {/* Logo and Color Palette - Half width each on desktop */}
      <div className="col-span-12 md:col-span-6 flex">
        <LogoSection />
      </div>
      <div className="col-span-12 md:col-span-6 flex">
        <ColorPaletteSection />
      </div>

      {/* Typography and Brand Tone - Half width each on desktop */}
      <div className="col-span-12 md:col-span-6 flex">
        <TypographySection />
      </div>
      <div className="col-span-12 md:col-span-6 flex">
        <BrandToneSection />
      </div>

      {/* Usage Features - Full width */}
      <div className="col-span-12">
        <UsageFeaturesSection />
      </div>
      <TrainModelModal isOpen={isTrainModalOpen} onClose={() => setIsTrainModalOpen(false)} />
    </PageOutletLayout>
  )
}
