import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Type } from "lucide-react";

interface FontData {
  font_family: string;
  classification: string;
  personality_signal: string;
}

interface TypographyNodeProps {
  data: {
    headings: FontData;
    body: FontData;
    label: string;
  };
}

export const TypographyNode = ({ data }: TypographyNodeProps) => {
  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
      <Card className="w-72 border-tertiary/20 bg-surface-container-lowest/80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-tertiary/50">
        <CardHeader className="p-3 border-b border-outline-variant/30 bg-tertiary/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4 text-tertiary" />
            {data.label || "Typography"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Headings */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Headings
            </span>
            <div className="bg-surface-container-low p-2 rounded-md">
              <p
                className="text-sm font-bold truncate"
                style={{ fontFamily: data.headings.font_family }}
              >
                {data.headings.font_family || "Sans Serif"}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 bg-tertiary/10 text-tertiary rounded uppercase">
                  {data.headings.classification}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-on-surface/5 text-on-surface-variant rounded italic">
                  {data.headings.personality_signal}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Body Content
            </span>
            <div className="bg-surface-container-low p-2 rounded-md">
              <p
                className="text-sm truncate"
                style={{ fontFamily: data.body.font_family }}
              >
                {data.body.font_family || "Roboto"}
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 bg-tertiary/10 text-tertiary rounded uppercase">
                  {data.body.classification}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-on-surface/5 text-on-surface-variant rounded italic">
                  {data.body.personality_signal}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
