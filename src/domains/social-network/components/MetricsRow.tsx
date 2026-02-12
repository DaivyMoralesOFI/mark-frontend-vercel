import { KPIMetric } from "../data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsRowProps {
    metrics: KPIMetric[];
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => {
    return (
        <div className="flex items-center w-full">
            {metrics.map((metric, index) => {
                const isPositive = metric.trend >= 0;

                return (
                    <div key={metric.title} className="flex items-center flex-1">
                        {/* KPI Item */}
                        <div className="flex items-center justify-center gap-3 flex-1 py-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    {metric.title}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {metric.value}
                                    </span>
                                    <div
                                        className={`flex items-center gap-1 text-sm font-medium ${isPositive
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                        <span>
                                            {isPositive ? "+" : ""}
                                            {metric.trend}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pipe separator (not after last item) */}
                        {index < metrics.length - 1 && (
                            <div className="h-12 w-px bg-gray-200 shrink-0" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
