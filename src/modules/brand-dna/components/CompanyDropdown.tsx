import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Building2, ChevronDown, CheckCircle2, Loader2 } from "lucide-react"
import { useCompanies } from "../hooks/useCompanies"
import { Company } from "../types/brandDnaTypes"
import { getCompanyInitials } from "../utils/companyUtils"

// Component to handle company logo with fallback to initials
function CompanyLogo({ name, logo, size = "sm" }: { name: string; logo: string; size?: "sm" | "md" }) {
  const [imageError, setImageError] = useState(false);
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  if (!logo || imageError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${textSize} font-semibold text-muted-foreground`}>
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

interface CompanyDropdownProps {
  selectedCompany: Company
  onSelectCompany: (company: Company) => void
  onViewAll: () => void
}

export function CompanyDropdown({ selectedCompany, onSelectCompany, onViewAll }: CompanyDropdownProps) {
  const { companies, loading } = useCompanies()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-auto py-2 px-3 bg-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              <CompanyLogo name={selectedCompany.name} logo={selectedCompany.logo} size="sm" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">{selectedCompany.name}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          companies.map((company) => (
            <DropdownMenuItem
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <CompanyLogo name={company.name} logo={company.logo} size="sm" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{company.name}</div>
              </div>
              {selectedCompany.id === company.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onViewAll} className="cursor-pointer">
          <Building2 className="h-4 w-4 mr-2" />
          View All Companies
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
