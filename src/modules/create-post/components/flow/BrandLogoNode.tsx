import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";

const BrandLogoNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const logoUrl = brand.brand_identity.logo.url;
    const format = brand.brand_identity.logo.format?.toUpperCase() || "PNG";

    return (
        <div className="relative flex justify-center items-center">
            <Card className="p-5 flex flex-col items-center gap-3 border border-outline-variant/20 shadow-lg min-w-[200px] max-w-[240px] bg-white rounded-2xl">
                {/* Title */}
                <div className="flex items-center gap-2 self-start">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm font-semibold text-foreground">Brand Logo</span>
                </div>

                {/* Logo Image */}
                <div className="w-full flex justify-center py-4">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={brand.brand_identity.name}
                            className="h-20 w-auto object-contain"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-outline-variant/10 rounded-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No Logo</span>
                        </div>
                    )}
                </div>

                {/* Format */}
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    FORMAT: {format}
                </span>
            </Card>

            {/* Handles for edges */}
            <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
            <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
            <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
        </div>
    );
};

export default BrandLogoNode;
