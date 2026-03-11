import { ChartPoint } from "../data/mockData";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import {
    ChartConfig,
    ChartContainer,
} from "@/shared/components/ui/Chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/Select";
import { useState } from "react";
import { cn } from "@/shared/utils/utils";

import type { TimePeriod } from "@/modules/dashboard/data/dashboardMockData";

const chartConfig = {
    followers: {
        label: "Followers",
        color: "#0ea5e9", // Blue
    },
    engagement: {
        label: "Engagement",
        color: "#f43f5e", // Red/Pink
    },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-surface-container-highest border border-outline-variant rounded-xl shadow-2xl p-4 min-w-[240px] animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-normal text-on-surface">{label}</span>
                    <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        +14.2%
                    </div>
                </div>

                <div className="space-y-3">
                    {payload.map((entry: any, index: number) => {
                        const isFollowers = entry.dataKey === "followers";
                        const change = isFollowers ? "+1,240" : "-412";
                        const percent = isFollowers ? "+8.5%" : "-2.1%";
                        const color = entry.color;

                        return (
                            <div key={index} className="flex flex-col gap-1">
                                {index > 0 && <div className="border-t border-outline-variant/50 my-2 border-dashed" />}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                                                {entry.name}
                                            </span>
                                            <span className="text-lg font-medium text-on-surface">
                                                {entry.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={cn(
                                            "text-xs font-normal",
                                            percent.startsWith("+") ? "text-emerald-500" : "text-red-500"
                                        )}>
                                            {percent}
                                        </span>
                                        <span className="text-[10px] text-on-surface-variant">
                                            {change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
};

interface PerformanceChartProps {
    data: ChartPoint[];
    platformName: string;
    timePeriod: TimePeriod;
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
    const [viewMode, setViewMode] = useState<"dual" | "followers" | "engagement">("dual");

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-on-surface">Performance analytics</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-sky-500" />
                            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
                            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Engagement</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        value={viewMode}
                        onValueChange={(v) => setViewMode(v as any)}
                    >
                        <SelectTrigger className="w-[140px] bg-surface-container-low dark:bg-transparent border-outline-variant h-9 text-xs">
                            <SelectValue placeholder="View Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dual">Dual View</SelectItem>
                            <SelectItem value="followers">Followers Only</SelectItem>
                            <SelectItem value="engagement">Engagement Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="relative h-[380px] w-full mt-4">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart
                        data={data}
                        margin={{ left: 0, right: 10, top: 20, bottom: 40 }}
                    >
                        <defs>
                            <linearGradient id="fillFollowers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.005} />
                            </linearGradient>
                            <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#d946ef" stopOpacity={0.005} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            horizontal={true}
                            strokeDasharray="2 2"
                            stroke="var(--outline-variant)"
                            strokeOpacity={0.1}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={30}
                            tick={{ fontSize: 10, fill: "var(--on-surface-variant)" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={40}
                            tick={{ fontSize: 10, fill: "var(--on-surface-variant)" }}
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'var(--on-surface)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />

                        {(viewMode === "dual" || viewMode === "followers") && (
                            <Area
                                name="Followers"
                                dataKey="followers"
                                type="linear"
                                fill="url(#fillFollowers)"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#0ea5e9" }}
                            />
                        )}

                        {(viewMode === "dual" || viewMode === "engagement") && (
                            <Area
                                name="Engagement"
                                dataKey="engagement"
                                type="linear"
                                fill="url(#fillEngagement)"
                                stroke="#d946ef"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#d946ef" }}
                            />
                        )}
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
};
