import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown, Dna, Loader2, AlertCircle, Check } from "lucide-react";
import { useBrands } from "@/modules/create-post/hooks/use-brands";
import { BrandExtractor } from "@/modules/create-post/schemas/brand-schema";
import { cn } from "@/shared/utils/utils";

interface BrandDnaSelectorProps {
    value: string | null;
    onChange: (brandId: string | null, brand: BrandExtractor | null) => void;
}

const BrandDnaSelector = ({ value, onChange }: BrandDnaSelectorProps) => {
    const { data: brands, isLoading, isError } = useBrands();

    const selectedBrand = brands?.find(
        (b) => b.brand_identity.name === value
    );

    const displayName = selectedBrand?.brand_identity.name ?? "Brand";
    const primaryColor =
        selectedBrand?.color_system?.roles?.primary?.hex ?? undefined;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                        "border transition-all duration-200",
                        selectedBrand
                            ? "bg-primary/8 border-primary/25 text-primary hover:bg-primary/12"
                            : "bg-surface-container-low/60 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:border-outline-variant/40"
                    )}
                >
                    {selectedBrand ? (
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-black/5"
                            style={{ backgroundColor: primaryColor }}
                        />
                    ) : (
                        <Dna className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    <span className="max-w-[90px] truncate">{displayName}</span>
                    <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="z-[99999] min-w-[220px] max-w-[300px] p-1"
                align="start"
                sideOffset={8}
            >
                <div className="px-2 py-1.5 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        Select Brand DNA
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Loading brands...</span>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Failed to load brands</span>
                    </div>
                ) : !brands || brands.length === 0 ? (
                    <div className="py-6 px-3 text-center text-muted-foreground text-xs">
                        No brands found. Extract a Brand DNA first.
                    </div>
                ) : (
                    <DropdownMenuGroup>
                        {brands.map((brand) => {
                            const brandPrimary =
                                brand.color_system?.roles?.primary?.hex ?? "#888";
                            const isSelected = brand.brand_identity.name === value;
                            return (
                                <DropdownMenuItem
                                    key={brand._meta.uuid}
                                    onClick={() =>
                                        onChange(brand.brand_identity.name, brand)
                                    }
                                    className={cn(
                                        "flex items-center gap-3 py-2.5 px-2.5 rounded-lg cursor-pointer",
                                        "transition-colors duration-150",
                                        isSelected && "bg-primary/8"
                                    )}
                                >
                                    {/* Brand color + logo indicator */}
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-black/5"
                                        style={{ backgroundColor: brandPrimary + "18" }}
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: brandPrimary }}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-medium truncate leading-tight">
                                            {brand.brand_identity.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/70 truncate leading-tight">
                                            {brand.brand_identity.industry}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                            onClick={() => onChange(null, null)}
                            className="text-xs text-muted-foreground/60 justify-center py-2 rounded-lg"
                        >
                            Clear selection
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BrandDnaSelector;
