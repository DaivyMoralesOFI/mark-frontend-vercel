import { Card } from "@/shared/components/ui/Card";
import { Handle, Position } from "reactflow";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { MessageCircle, Target, Megaphone } from "lucide-react";

const BrandVoiceNode = ({ data }: { data: { brand: BrandExtractor } }) => {
    const brand = data?.brand;
    if (!brand) return null;

    const { tone_of_voice, target_audience, communication_style } = brand.brand_voice;

    return (
        <div className="relative flex justify-center items-center text-foreground font-sans">
            <Card className="p-5 flex flex-col gap-4 border border-outline-variant/30 shadow-xl min-w-[240px] max-w-[280px] bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl transition-all hover:border-primary/20">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                    <Megaphone className="w-4 h-4 text-purple-500" strokeWidth={2.5} />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Brand Voice</span>
                </div>

                {/* Tone of Voice */}
                <div className="flex flex-col gap-2 bg-white/5 dark:bg-white/[0.02] p-3 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3 h-3 text-purple-400" />
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            TONE OF VOICE
                        </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {tone_of_voice.slice(0, 3).map((tone, i) => (
                            <span
                                key={i}
                                className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg font-bold border border-purple-500/10"
                            >
                                {tone}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Grid for details */}
                <div className="grid grid-cols-1 gap-4 px-1">
                    {/* Communication Style */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                            COMMUNICATION STYLE
                        </span>
                        <span className="text-sm font-semibold text-foreground/90 italic leading-snug">
                            {communication_style}
                        </span>
                    </div>

                    {/* Target Audience */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-[9px] uppercase font-bold text-muted-foreground/50 tracking-wider">
                                TARGET AUDIENCE
                            </span>
                        </div>
                        <p className="text-xs text-on-surface-variant/80 leading-relaxed font-medium bg-muted/30 p-2 rounded-xl border border-outline-variant/5">
                            "{target_audience}"
                        </p>
                    </div>
                </div>
            </Card>

            <Handle type="target" position={Position.Left} className="opacity-0" />
        </div>
    );
};

export default BrandVoiceNode;
