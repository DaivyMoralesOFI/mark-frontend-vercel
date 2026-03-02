import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { User, Compass, Building2 } from "lucide-react";

const BrandIdentityNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { name, brand_archetype, industry } = brand.brand_identity;

    return (
        <div className="relative flex justify-center items-center">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-lg min-w-[200px] max-w-[240px] bg-surface-container-lowest rounded-2xl">
                {/* Title */}
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Identity</span>
                </div>

                {/* Brand Name */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        BRAND NAME
                    </span>
                    <span className="text-base font-bold text-foreground">{name}</span>
                </div>

                {/* Archetype */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        ARCHETYPE
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{brand_archetype}</span>
                    </div>
                </div>

                {/* Industry */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        INDUSTRY
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{industry}</span>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandIdentityNode;
