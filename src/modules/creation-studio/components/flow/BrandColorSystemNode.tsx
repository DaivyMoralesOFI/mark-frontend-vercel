import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { Palette } from "lucide-react";

const BrandColorSystemNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { source_palette, roles } = brand.color_system;

    // Get the primary key colors for the palette display
    const keyColors = source_palette.slice(0, 3);

    return (
        <div className="relative flex justify-center items-center text-foreground font-sans">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/30 shadow-xl min-w-[260px] max-w-[300px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all hover:border-primary/20">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-pink-500" strokeWidth={2.5} />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Color System</span>
                </div>

                {/* Key Palette */}
                <div className="flex flex-col gap-3 bg-white/5 dark:bg-white/[0.02] p-4 rounded-2xl border border-outline-variant/5">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                        KEY PALETTE
                    </span>
                    <div className="flex gap-3 items-center">
                        {keyColors.map((color, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                                <div
                                    className="w-full aspect-square rounded-xl shadow-md border border-white/10 transition-transform hover:scale-110 duration-300"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[9px] text-muted-foreground/50 uppercase font-mono font-bold tracking-tighter">
                                    {color}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles List */}
                <div className="flex flex-col gap-3 px-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Surface</span>
                            <span className="text-[10px] font-mono text-muted-foreground/30">{roles.surface.hex}</span>
                        </div>
                        <div
                            className="w-20 h-3 rounded-full border border-outline-variant/10 shadow-inner"
                            style={{ backgroundColor: roles.surface.hex }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase">Outline</span>
                            <span className="text-[10px] font-mono text-muted-foreground/30">{roles.outline.hex}</span>
                        </div>
                        <div
                            className="w-20 h-3 rounded-full border border-outline-variant/10 shadow-inner"
                            style={{ backgroundColor: roles.outline.hex }}
                        />
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandColorSystemNode;
