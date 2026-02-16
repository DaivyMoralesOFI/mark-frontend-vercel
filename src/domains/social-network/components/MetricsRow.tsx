import { KPIMetric } from "../data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsRowProps {
    metrics: KPIMetric[];
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-outline-variant">
            {metrics.map((metric) => {
                const isPositive = metric.trend >= 0;

                return (
                    <div key={metric.title} className="px-4 first:pl-0 last:pr-0 py-2">
                        <p className="text-[11px] font-normal uppercase tracking-wider text-on-surface-variant mb-1">
                            {metric.title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-medium text-on-surface">
                                {metric.value}
                            </span>
                            <div
                                className={`flex items-center gap-0.5 text-xs font-medium ${isPositive
                                    ? "text-emerald-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {isPositive ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}
                                <span>
                                    {Math.abs(metric.trend)}%
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
