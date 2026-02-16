import { cn } from "@/shared/utils/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

const KPICard = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  className,
}: KPICardProps) => {
  const isTrendPositive = trend && trend > 0;
  const isTrendNegative = trend && trend < 0;
  const trendIcon = isTrendPositive ? (
    <ArrowUp className="h-3 w-3" />
  ) : isTrendNegative ? (
    <ArrowDown className="h-3 w-3" />
  ) : null;

  return (
    <Card className={cn("flex flex-col h-full w-full", className)}>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-on-surface">{title}</span>
            {icon && <div className="text-brand">{icon}</div>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-1">{value}</div>
      </CardContent>
      <CardFooter>
        {trend !== undefined && (
          <div
            className={cn(
              "text-xs flex items-center mt-auto",
              isTrendPositive
                ? "text-success"
                : isTrendNegative
                  ? "text-danger"
                  : "text-on-surface-variant"
            )}
          >
            {trendIcon}
            <span className="ml-1">
              {Math.abs(trend)}% {trendLabel || "vs last period"}
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default KPICard;
