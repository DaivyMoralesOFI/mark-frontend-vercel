import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { User, Briefcase, Landmark } from "lucide-react";

interface IdentityNodeProps {
  data: {
    name: string;
    brand_archetype: string;
    industry: string;
    label: string;
  };
}

export const IdentityNode = ({ data }: IdentityNodeProps) => {
  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
      <Card className="w-64 border-secondary/20 bg-surface-container-lowest/80 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-secondary/50">
        <CardHeader className="p-3 border-b border-outline-variant/30 bg-secondary/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" />
            {data.label || "Brand Identity"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Brand Name
            </span>
            <span className="text-sm font-semibold text-on-surface">
              {data.name || "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Archetype
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Landmark className="w-3 h-3 text-secondary" />
              <span className="text-xs text-on-surface">
                {data.brand_archetype || "N/A"}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold">
              Industry
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Briefcase className="w-3 h-3 text-secondary" />
              <span className="text-xs text-on-surface">
                {data.industry || "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
