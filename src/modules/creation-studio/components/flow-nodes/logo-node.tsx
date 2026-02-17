import { Handle, Position } from "reactflow";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { motion } from "framer-motion";

interface LogoNodeProps {
  data: {
    url: string;
    format: string;
    label: string;
  };
}

export const LogoNode = ({ data }: LogoNodeProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <Card className="w-64 overflow-hidden border-primary/20 bg-surface-container-lowest/80 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/10">
        <CardHeader className="p-3 border-b border-outline-variant/30 bg-primary/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {data.label || "Logo"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[120px]">
          {data.url ? (
            <img
              src={data.url}
              alt="Brand Logo"
              className="max-w-full max-h-24 object-contain drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/200x100?text=Logo+Not+Found";
              }}
            />
          ) : (
            <div className="w-full h-24 bg-surface-container-low rounded-lg flex items-center justify-center text-on-surface-variant italic text-xs">
              No logo detected
            </div>
          )}
          <div className="mt-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
            Format: {data.format || "PNG"}
          </div>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </motion.div>
  );
};
