import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mic2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

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
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Card className="w-80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-primary">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-secondary" />
            Voice
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm uppercase text-outline font-bold">
                Tone of Voice
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.tone_of_voice?.slice(0, 4).map((tone, i) => (
                <Badge key={i} variant="secondary">
                  {tone}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="uppercase text-outline font-bold">
                Target Audience
              </span>
            </div>
            <p className="text-on-surface line-clamp-2 leading-relaxed italic">
              "{data.target_audience || "N/A"}"
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="uppercase text-outline font-bold">
              Communication Style
            </span>
            <p className="font-medium">{data.communication_style || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
