import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { User } from "lucide-react";

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
      <Handle type="target" position={Position.Right} className="w-3 h-3" />
      <Card className="w-72 h-fit bg-surface-container-lowest backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-primary">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" />
            Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm  uppercase text-outline font-bold">
              Brand Name
            </span>
            <span className="font-semibold">{data.name || "Not found"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase text-outline font-bold">Archetype</span>

            <span className="font-medium">{data.brand_archetype || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="uppercase text-outline font-bold">Industry</span>

            <span className="font-medium">{data.industry || "N/A"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
