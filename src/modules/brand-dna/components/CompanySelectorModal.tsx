import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/Input"
import { Search, Building2, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/core/lib/utils"
import { useCompanies } from "../hooks/useCompanies"
import { Company } from "../types/brandDnaTypes"
import { getCompanyInitials } from "../utils/companyUtils"

// Component to handle company logo with fallback to initials
function CompanyLogo({ name, logo }: { name: string; logo: string }) {
  const [imageError, setImageError] = useState(false);

  if (!logo || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
        {getCompanyInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface CompanySelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCompany: (company: Company) => void
  selectedCompanyId?: string
}

export function CompanySelectorModal({
  isOpen,
  onClose,
  onSelectCompany,
  selectedCompanyId,
}: CompanySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { companies, loading, error } = useCompanies()

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectCompany = (company: Company) => {
    onSelectCompany(company)
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select Company</DialogTitle>
          <DialogDescription>Choose a company to view and manage its brand DNA</DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-12 w-12 mb-3 animate-spin opacity-50" />
              <p>Loading companies...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-destructive">{typeof error === 'string' ? error : 'An error occurred'}</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mb-3 opacity-50" />
              <p>No companies found</p>
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-lg border transition-all hover:border-primary hover:bg-accent/50",
                  selectedCompanyId === company.id ? "border-primary bg-accent/50" : "border-border bg-card",
                )}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <CompanyLogo name={company.name} logo={company.logo} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{company.name}</h3>
                    {selectedCompanyId === company.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
