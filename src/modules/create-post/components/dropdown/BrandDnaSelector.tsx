import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/DropdownMenu";
import { ChevronDown, Dna, Loader2, AlertCircle, Check } from "lucide-react";
import { useBrands } from "@/modules/create-post/hooks/useBrands";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
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
                        "group flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                        "text-xs font-medium transition-all duration-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-[#D946EF]/30",
                        selectedBrand
                            ? "bg-[#D946EF]/10 border border-[#D946EF]/25 text-[#D946EF] hover:bg-[#D946EF]/15 hover:border-[#D946EF]/40"
                            : "bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.10] dark:border-white/[0.08] text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.09] hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:text-neutral-900 dark:hover:text-white data-[state=open]:bg-black/[0.08] dark:data-[state=open]:bg-white/[0.09] data-[state=open]:border-black/[0.15] dark:data-[state=open]:border-white/[0.15] data-[state=open]:text-neutral-900 dark:data-[state=open]:text-white"
                    )}
                >
                    {selectedBrand ? (
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-black/5"
                            style={{ backgroundColor: primaryColor }}
                        />
                    ) : (
                        <Dna className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                    <span className="max-w-[90px] truncate">{displayName}</span>
                    <ChevronDown className={cn(
                        "w-3 h-3 flex-shrink-0 transition-all duration-200 group-data-[state=open]:rotate-180",
                        selectedBrand ? "opacity-60 group-hover:opacity-90" : "opacity-40 group-hover:opacity-70"
                    )} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="z-[99999] min-w-[220px] max-w-[300px] p-1"
                align="start"
                sideOffset={8}
            >
                <div className="px-2.5 py-1.5 mb-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                        Brand DNA
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-neutral-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Loading brands...</span>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-6 gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">Failed to load brands</span>
                    </div>
                ) : !brands || brands.length === 0 ? (
                    <div className="py-6 px-3 text-center text-neutral-500 text-xs">
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
                                        "flex items-center gap-2.5 py-2 px-2.5 rounded-lg mx-0.5 my-px cursor-pointer",
                                        "text-xs font-medium transition-colors duration-150",
                                        isSelected
                                            ? "bg-[#D946EF]/10 text-[#D946EF] focus:bg-[#D946EF]/15"
                                            : "text-neutral-700 dark:text-neutral-300"
                                    )}
                                >
                                    <div
                                        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ring-1 ring-black/[0.04]"
                                        style={{ backgroundColor: brandPrimary + "18" }}
                                    >
                                        <div
                                            className="w-3.5 h-3.5 rounded-full"
                                            style={{ backgroundColor: brandPrimary }}
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-medium truncate leading-tight">
                                            {brand.brand_identity.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/60 truncate leading-tight">
                                            {brand.brand_identity.industry}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                            onClick={() => onChange(null, null)}
                            className="text-[10px] text-neutral-500 justify-center py-2 rounded-lg mx-0.5 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.04]"
                        >
                            Clear selection
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    );
};

export default BrandDnaSelector;
