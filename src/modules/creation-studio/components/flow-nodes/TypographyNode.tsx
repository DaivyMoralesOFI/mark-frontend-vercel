import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { Type } from "lucide-react";
import { useGoogleFonts } from "@/shared/hooks/useGoogleFonts";

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
  useGoogleFonts([data.headings.font_family, data.body.font_family]);

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Right} className="w-3 h-3" />
      <Card className="w-80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-primary">
        <CardHeader>
          <CardTitle className="font-medium flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm uppercase text-outline font-bold">
                Headings
              </span>
            </div>
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm uppercase text-outline font-bold">
                Body Content
              </span>
            </div>
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
