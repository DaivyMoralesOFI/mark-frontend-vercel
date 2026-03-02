import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { Palette } from "lucide-react";

const BrandColorSystemNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { source_palette, roles } = brand.color_system;

    // Get the primary key colors for the palette display
    const keyColors = source_palette.slice(0, 3);

    return (
        <div className="relative flex justify-center items-center">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-lg min-w-[240px] max-w-[280px] bg-surface-container-lowest rounded-2xl">
                {/* Title */}
                <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Color System</span>
                </div>

                {/* Key Palette */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        KEY PALETTE
                    </span>
                    <div className="flex gap-2 items-center">
                        {keyColors.map((color, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div
                                    className="w-12 h-12 rounded-lg shadow-sm"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[8px] text-muted-foreground uppercase font-mono">
                                    {color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Surface & Outline */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Surface</span>
                        <div className="flex items-center gap-1">
                            <div
                                className="w-full h-2 rounded-full min-w-[60px]"
                                style={{ backgroundColor: roles.surface.hex }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Outline</span>
                        <div className="flex items-center gap-1">
                            <div
                                className="w-full h-2 rounded-full min-w-[60px]"
                                style={{ backgroundColor: roles.outline.hex }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandColorSystemNode;
