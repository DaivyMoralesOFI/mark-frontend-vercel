import { ChartPoint } from "../data/mockData";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/shared/components/ui/card";
import { useState } from "react";

const chartConfig = {
    followers: {
        label: "Followers",
        color: "#5b74ad",
    },
    engagement: {
        label: "Engagement",
        color: "#c3658f",
    },
} satisfies ChartConfig;

const timeRanges = ["D", "M", "Y", "All", "Custom"] as const;

interface PerformanceChartProps {
    data: ChartPoint[];
    platformName: string;
}

export const PerformanceChart = ({ data, platformName }: PerformanceChartProps) => {
    const [activeRange, setActiveRange] = useState<string>("All");

    return (
        <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-gray-900">
                            Consolidated Performance
                        </CardTitle>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#5b74ad]" />
                                <span className="text-gray-500">Followers</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#c3658f]" />
                                <span className="text-gray-500">Engagement</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Range Selector */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                            {timeRanges.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setActiveRange(range)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${activeRange === range
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4 px-4">
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={`fillFollowers-${platformName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5b74ad" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5b74ad" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id={`fillEngagement-${platformName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c3658f" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#c3658f" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                            stroke="#f3f4f6"
                        />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            tickFormatter={(value) =>
                                value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
                            }
                        />
                        <ChartTooltip
                            cursor={{ stroke: "#d1d5db", strokeDasharray: "4 4" }}
                            content={<ChartTooltipContent />}
                        />
                        <Area
                            dataKey="followers"
                            type="monotone"
                            fill={`url(#fillFollowers-${platformName})`}
                            stroke="#5b74ad"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, fill: "#5b74ad", stroke: "#fff", strokeWidth: 2 }}
                        />
                        <Area
                            dataKey="engagement"
                            type="monotone"
                            fill={`url(#fillEngagement-${platformName})`}
                            stroke="#c3658f"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, fill: "#c3658f", stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
