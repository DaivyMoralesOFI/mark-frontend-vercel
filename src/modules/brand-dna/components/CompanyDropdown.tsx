import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Building2, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { useBrands } from "@/core/hooks/useBrands";
import { Brand } from "@/core/schemas/brand-schema";
import { BrandLogo } from "@/shared/components/brand/BrandLogo";

interface CompanyDropdownProps {
  selectedCompany: Brand;
  onSelectCompany: (company: Brand) => void;
  onViewAll: () => void;
}

export function CompanyDropdown({
  selectedCompany,
  onSelectCompany,
  onViewAll,
}: CompanyDropdownProps) {
  const { brands, loading } = useBrands();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 h-auto py-2 px-3 bg-transparent"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              <BrandLogo
                name={selectedCompany.identity.name}
                logo={selectedCompany.identity.logo_url}
                size="sm"
              />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">
                {selectedCompany.identity.name}
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem
            disabled
            className="flex items-center justify-center py-4"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          brands?.map((brand) => (
            <DropdownMenuItem
              key={brand.uuid}
              onClick={() => onSelectCompany(brand)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <BrandLogo
                  name={brand.identity.name}
                  logo={brand.identity.logo_url}
                  size="sm"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{brand.identity.name}</div>
              </div>
              {selectedCompany.uuid === brand.uuid && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
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
  );
}
