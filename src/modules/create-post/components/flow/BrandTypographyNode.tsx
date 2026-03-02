import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { Type } from "lucide-react";

const BrandTypographyNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { headings, body } = brand.typography;

    return (
        <div className="relative flex justify-center items-center text-foreground font-sans">
            <Card className="p-5 flex flex-col gap-5 border border-outline-variant/30 shadow-xl min-w-[240px] max-w-[280px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all hover:border-primary/20">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                    <Type className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Typography</span>
                </div>

                {/* Headings */}
                <div className="flex flex-col gap-2 bg-white/5 dark:bg-white/[0.02] p-4 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-baseline justify-between w-full">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            HEADINGS
                        </span>
                        <div className="flex gap-1">
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold border border-emerald-500/10">
                                {headings.classification}
                            </span>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-foreground leading-tight tracking-tight">
                        {headings.font_family}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-medium italic">
                        {headings.personality_signal}
                    </span>
                </div>

                {/* Body Content */}
                <div className="flex flex-col gap-2 px-1">
                    <div className="flex items-baseline justify-between w-full">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            BODY CONTENT
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-foreground/90">
                            {body.font_family}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                            <span className="text-[9px] text-muted-foreground/60 font-medium">
                                {body.classification}
                            </span>
                            <span className="text-[9px] text-muted-foreground/30 font-medium">·</span>
                            <span className="text-[9px] text-muted-foreground/60 font-medium italic">
                                {body.personality_signal}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandTypographyNode;
