
import { Button } from "@/shared/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { ChevronDown, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { useBrands } from "@/shared/hooks/useBrands";
import { CompanyBrand } from "../types/BrandDnaTypes";
import { BrandLogo } from "@/shared/components/brand/BrandLogo";


interface CompanyDropdownProps {
  selectedCompany: CompanyBrand | null;
  onSelectCompany: (company: CompanyBrand) => void;
}

export function CompanyDropdown({
  selectedCompany,
  onSelectCompany,
}: CompanyDropdownProps) {
  const { brands, loading, error } = useBrands();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 h-auto py-3 px-4 bg-card hover:bg-accent/50 border-input"
        >
          {selectedCompany ? (
            <div className="flex items-center gap-3 text-left overflow-hidden">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                <BrandLogo
                  name={selectedCompany.name}
                  logo={selectedCompany.logo || ""}
                  size="sm"
                />
              </div>
              <span className="truncate font-medium">
                {selectedCompany.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a company</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[300px] max-h-[300px] overflow-y-auto"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-6 w-6 mb-2 animate-spin opacity-50" />
            <span className="text-xs">Loading companies...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-destructive">
            <Building2 className="h-6 w-6 mb-2 opacity-50" />
            <span className="text-xs">Error loading companies</span>
          </div>
        ) : (
          brands?.map((brand) => (
            <DropdownMenuItem
              key={brand.url}
              onClick={() => onSelectCompany(brand)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                <BrandLogo
                  name={brand.name}
                  logo={brand.logo || ""}
                  size="sm"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-sm truncate">
                  {brand.name}
                </div>
              </div>
              {selectedCompany?.url === brand.url && (
                <CheckCircle2 className="h-4 w-4 text-primary ml-auto flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
