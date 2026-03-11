import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/Card";
import { Palette } from "lucide-react";

interface ColorRole {
  hex: string;
}

interface ColorNodeProps {
  data: {
    roles: {
      primary: ColorRole;
      secondary: ColorRole;
      tertiary: ColorRole;
      surface: ColorRole;
      outline: ColorRole;
    };
    label: string;
  };
}

export const ColorNode = ({ data }: ColorNodeProps) => {
  const colors = [
    { label: "Primary", hex: data.roles?.primary?.hex, size: "h-10 w-full" },
    { label: "Secondary", hex: data.roles?.secondary?.hex, size: "h-8 w-1/2" },
    { label: "Tertiary", hex: data.roles?.tertiary?.hex, size: "h-8 w-1/2" },
  ];

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Card className="w-80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-primary">
        <CardHeader>
          <CardTitle className="font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color System
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Key Palette
            </span>
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 flex-1 min-w-[60px]"
                >
                  <div
                    className="h-10 rounded-md border border-outline-variant/30 shadow-sm"
                    style={{ backgroundColor: c.hex || "#cccccc" }}
                  />
                  <span className="text-[9px] text-center font-medium text-on-surface-variant truncate">
                    {c.hex || "#---"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span>Surface</span>
              <div
                className="w-12 h-10 rounded-md border border-outline"
                style={{ backgroundColor: data.roles?.surface?.hex || "#fff" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Outline</span>
              <div
                className="w-12 h-10 rounded-md border border-outline"
                style={{ backgroundColor: data.roles?.outline?.hex || "#000" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
