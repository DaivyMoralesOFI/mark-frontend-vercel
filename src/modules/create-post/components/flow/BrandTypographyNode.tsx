import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { Type } from "lucide-react";

const BrandTypographyNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { headings, body } = brand.typography;

    return (
        <div className="relative flex justify-center items-center">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-lg min-w-[220px] max-w-[260px] bg-surface-container-lowest rounded-2xl">
                {/* Title */}
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Typography</span>
                </div>

                {/* Headings */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        HEADINGS
                    </span>
                    <span className="text-base font-bold text-foreground">
                        {headings.font_family}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[9px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full uppercase font-medium">
                            {headings.classification}
                        </span>
                        <span className="text-[9px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full lowercase font-medium">
                            {headings.personality_signal}
                        </span>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        BODY CONTENT
                    </span>
                    <span className="text-sm text-foreground">
                        {body.font_family}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[9px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full uppercase font-medium">
                            {body.classification}
                        </span>
                        <span className="text-[9px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full lowercase font-medium">
                            {body.personality_signal}
                        </span>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Top} className="opacity-0" />
        </div>
    );
};

export default BrandTypographyNode;
