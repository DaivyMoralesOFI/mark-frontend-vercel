import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { User, Compass, Building2 } from "lucide-react";

const BrandIdentityNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { name, brand_archetype, industry } = brand.brand_identity;

    return (
        <div className="relative flex justify-center items-center text-foreground font-sans">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/30 shadow-xl min-w-[220px] max-w-[260px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all hover:border-primary/20">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-primary" strokeWidth={2.5} />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Identity</span>
                </div>

                {/* Brand Name */}
                <div className="flex flex-col gap-1 bg-white/5 dark:bg-white/[0.02] p-3 rounded-2xl border border-outline-variant/5">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                        BRAND NAME
                    </span>
                    <span className="text-base font-bold text-foreground leading-tight">{name}</span>
                </div>

                {/* Grid for details */}
                <div className="grid grid-cols-1 gap-3 px-1">
                    {/* Archetype */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            ARCHETYPE
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-orange-500/10">
                                <Compass className="w-3.5 h-3.5 text-orange-500" />
                            </div>
                            <span className="text-sm font-semibold text-foreground/90">{brand_archetype}</span>
                        </div>
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            INDUSTRY
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-md bg-blue-500/10">
                                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <span className="text-sm font-semibold text-foreground/90">{industry}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandIdentityNode;
