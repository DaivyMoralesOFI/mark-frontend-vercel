import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";

const BrandResultNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;

    if (!brand) return null;

    // Let's get the first 5 colors
    const colorRoles = Object.entries(brand.color_system.roles).slice(0, 5);

    return (
        <div className="relative p-0 flex justify-center items-center">
            <Card className="p-6 gap-6 flex flex-col items-center border border-primary/50 shadow-2xl min-w-[350px] max-w-[400px] bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl">

                {/* Header - Identity */}
                <div className="flex flex-col items-center gap-3 w-full border-b border-outline-variant/30 pb-4">
                    {brand.brand_identity.logo.url ? (
                        <img
                            src={brand.brand_identity.logo.url}
                            alt={brand.brand_identity.name}
                            className="h-16 w-auto object-contain"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-outline-variant/20 rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-muted-foreground text-center">No Logo</span>
                        </div>
                    )}
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-xl font-bold">{brand.brand_identity.name}</h2>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                {brand.brand_identity.industry.split(' ')[0] || "Brand"}
                            </span>
                            <span className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                {brand.brand_identity.brand_archetype}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className="w-full flex flex-col gap-2 relative">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground w-full text-center">Primary Colors</span>
                    <div className="flex gap-2 justify-center w-full">
                        {colorRoles.map(([role, color]) => (
                            <div
                                key={role}
                                className="w-10 h-10 rounded-full border border-outline/20 shadow-sm"
                                style={{ backgroundColor: color.hex }}
                                title={`${role}: ${color.hex}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Fonts */}
                <div className="w-full grid grid-cols-2 gap-3 text-sm text-center">
                    <div className="flex flex-col border border-outline/10 p-2 rounded-xl bg-surface-container-low/50">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Headings</span>
                        <span className="font-medium truncate text-xs">{brand.typography.headings.font_family}</span>
                        <span className="text-[9px] text-muted-foreground truncate">{brand.typography.headings.classification}</span>
                    </div>
                    <div className="flex flex-col border border-outline/10 p-2 rounded-xl bg-surface-container-low/50">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Body text</span>
                        <span className="font-medium truncate text-xs">{brand.typography.body.font_family}</span>
                        <span className="text-[9px] text-muted-foreground truncate">{brand.typography.body.classification}</span>
                    </div>
                </div>

            </Card>

            {/* Invisible handles to satisfy ReactFlow connection mechanics if ever needed */}
            <Handle type="source" position={Position.Right} className="opacity-0" />
            <Handle type="target" position={Position.Left} className="opacity-0" />
        </div>
    );
};

export default BrandResultNode;
