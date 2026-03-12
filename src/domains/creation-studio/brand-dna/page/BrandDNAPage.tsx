import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrandProfileProgress } from "../components/BrandProfileProgress";
import { LogoSection } from "../components/LogoSection";
import { ColorPaletteSection } from "../components/ColorPaletteSection";
import { TypographySection } from "../components/TypographySection";
import { BrandToneSection } from "../components/BrandToneSection";
import { UsageFeaturesSection } from "../components/UsageFeaturesSection";
import { CompanySelectorModal } from "../components/CompanySelectorModal";
import { useBrandDna } from "../hooks/useBrandDna";
import PageOutletLayout from "@/shared/layout/PageOutletLayout";
import { Actions } from "@/shared/types/Types";
import { Sparkles } from "lucide-react";

export function BrandDashboard() {
  const { selectedCompany, selectCompany, selectedBrandId } = useBrandDna();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Open modal if no company is selected when component mounts
    if (!selectedCompany) {
      setIsModalOpen(true);
    }
  }, [selectedCompany]);

  const handleSelectCompany = (
    company: Parameters<typeof selectCompany>[0],
  ) => {
    selectCompany(company);
    setIsModalOpen(false);
  };

  const pageActions: Actions[] = [
    {
      children: "Extractor",
      icon: Sparkles,
      onClick: () => navigate("/app/creation-studio/extractor"),
      variant: "default",
      type: "button",
    },
  ];

  return (
    <>
      <PageOutletLayout<"with-actions">
        pageTitle="Brand DNA"
        actions={pageActions}
        className="px-8 max-sm:px-4 gap-6 py-6"
      >
        {!selectedCompany ? (
          // Empty state when no company is selected
          <div className="col-span-12 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">
                No company selected
              </p>
              <p className="text-sm text-muted-foreground">
                Please select a company to view its Brand DNA
              </p>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </PageOutletLayout>
      <CompanySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCompany={handleSelectCompany}
        selectedCompanyId={selectedBrandId ?? selectedCompany?.uuid}
      />
    </>
  );
}
