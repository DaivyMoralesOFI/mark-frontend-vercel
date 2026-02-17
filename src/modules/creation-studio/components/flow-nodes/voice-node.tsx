import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mic2, MessageSquare, Target } from "lucide-react";

interface VoiceNodeProps {
  data: {
    tone_of_voice: string[];
    communication_style: string;
    target_audience: string;
    positioning_statement: string;
    label: string;
  };
}

export const VoiceNode = ({ data }: VoiceNodeProps) => {
  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
      <Card className="w-80 border-secondary/20 bg-surface-container-lowest/80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-secondary/50">
        <CardHeader className="p-3 border-b border-outline-variant/30 bg-secondary/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-secondary" />
            {data.label || "Brand Voice"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3 text-secondary/70" />
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">
                Tone of Voice
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.tone_of_voice?.slice(0, 4).map((tone, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded-full"
                >
                  {tone}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-secondary/70" />
              <span className="text-[10px] uppercase text-on-surface-variant font-bold">
                Target Audience
              </span>
            </div>
            <p className="text-xs text-on-surface line-clamp-2 leading-relaxed italic">
              "{data.target_audience || "N/A"}"
            </p>
          </div>

          <div className="pt-2 border-t border-outline-variant/20">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Communication Style
            </span>
            <p className="text-xs text-on-surface mt-1 font-medium">
              {data.communication_style || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
