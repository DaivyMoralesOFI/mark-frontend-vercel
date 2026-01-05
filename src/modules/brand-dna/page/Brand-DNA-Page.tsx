import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { BrandProfileProgress } from "../components/BrandProfileProgress";
import { LogoSection } from "../components/LogoSection";
import { ColorPaletteSection } from "../components/ColorPaletteSection";
import { TypographySection } from "../components/TypographySection";
import { BrandToneSection } from "../components/BrandToneSection";
import { UsageFeaturesSection } from "../components/UsageFeaturesSection";
import { CompanySelectorModal } from "../components/CompanySelectorModal";
import { CompanyDropdown } from "../components/CompanyDropdown";
import { useBrandDna } from "../hooks/useBrandDna";
import PageOutletLayout from "@/shared/layout/page-outlet-layout";
import { Button } from "@/shared/components/ui/button";

export function BrandDashboard() {
  const { selectedCompany, selectCompany } = useBrandDna();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Open modal if no company is selected when component mounts
    if (!selectedCompany) {
      setIsModalOpen(true);
    }
  }, [selectedCompany]);

  const handleSelectCompany = (company: Parameters<typeof selectCompany>[0]) => {
    selectCompany(company);
    setIsModalOpen(false);
  };

  const handleViewAll = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <PageOutletLayout 
        pageTitle="Brand DNA" 
        actions={[]}
        headerContent={
          selectedCompany ? (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/brand-dna-extractor')}
              >
                Extractor
              </Button>
              <CompanyDropdown
                selectedCompany={selectedCompany}
                onSelectCompany={handleSelectCompany}
                onViewAll={handleViewAll}
              />
            </div>
          ) : null
        }
      >
        {!selectedCompany ? (
          // Empty state when no company is selected
          <div className="col-span-12 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">No company selected</p>
              <p className="text-sm text-muted-foreground">Please select a company to view its Brand DNA</p>
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
        selectedCompanyId={selectedCompany?.id}
      />
    </>
  )
}
