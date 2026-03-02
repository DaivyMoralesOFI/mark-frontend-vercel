import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { MessageCircle, Target, Megaphone } from "lucide-react";

const BrandVoiceNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { tone_of_voice, target_audience, communication_style } = brand.brand_voice;

    return (
        <div className="relative flex justify-center items-center">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-lg min-w-[220px] max-w-[260px] bg-surface-container-lowest rounded-2xl">
                {/* Title */}
                <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Brand Voice</span>
                </div>

                {/* Tone of Voice */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            TONE OF VOICE
                        </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {tone_of_voice.slice(0, 3).map((tone, i) => (
                            <span
                                key={i}
                                className="text-[9px] bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full font-medium italic"
                            >
                                {tone}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Target Audience */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            TARGET AUDIENCE
                        </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                        "{target_audience}"
                    </p>
                </div>

                {/* Communication Style */}
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        COMMUNICATION STYLE
                    </span>
                    <span className="text-sm text-foreground italic">{communication_style}</span>
                </div>
            </Card>

            <Handle type="target" position={Position.Left} className="opacity-0" />
        </div>
    );
};

export default BrandVoiceNode;
