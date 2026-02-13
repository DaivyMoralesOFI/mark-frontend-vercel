import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

import {
    type TimePeriod,
    getKpiData,
    getOverviewChartData,
} from "@/domains/dashboard/data/dashboardMockData";

interface OverviewSectionProps {
    timePeriod: TimePeriod;
}

export const OverviewSection = ({ timePeriod }: OverviewSectionProps) => {
    const [selectedMetric, setSelectedMetric] = useState<"followers" | "impressions" | "engagement" | "posts">("followers");
    const kpi = getKpiData(timePeriod);
    const chartData = getOverviewChartData(timePeriod);

    const chartConfig = {
        followers: { label: "Total Followers", color: "#d946ef" },
        impressions: { label: "Impressions", color: "#d946ef" },
        engagement: { label: "Engagement Rate", color: "#d946ef" },
        posts: { label: "Total Posts", color: "#d946ef" },
    } satisfies ChartConfig;

    return (
        <div className="flex flex-col gap-4">
            {/* Dashboard Title & Switcher removed - moved to Page Actions in PageOutletLayout */}

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-outline-variant">
                {[
                    { title: "Total Followers", value: kpi.totalFollowers.value, trend: kpi.totalFollowers.trend },
                    { title: "Impressions", value: kpi.impressions.value, trend: kpi.impressions.trend },
                    { title: "Engagement Rate", value: kpi.engagementRate.value, trend: kpi.engagementRate.trend },
                    { title: "Total Posts", value: kpi.totalPosts.value, trend: kpi.totalPosts.trend },
                ].map((item) => (
                    <div key={item.title} className="px-4 first:pl-0 last:pr-0 py-5">
                        <p className="text-[11px] font-normal uppercase tracking-wider text-on-surface-variant mb-1">
                            {item.title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-medium text-on-surface">{item.value}</span>
                            {item.trend !== undefined && (
                                <span
                                    className={`flex items-center gap-0.5 text-xs font-medium ${item.trend > 0 ? "text-emerald-500" : item.trend < 0 ? "text-red-500" : "text-gray-400"
                                        }`}
                                >
                                    {item.trend > 0 ? <ArrowUp className="w-3 h-3" /> : item.trend < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                                    {Math.abs(item.trend)}%
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Row */}
            <div className="grid gap-4 md:grid-cols-1">
                {/* Chart Column */}
                <div className="border-y border-outline-variant py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-on-surface">Overview</h3>
                        <Select
                            value={selectedMetric}
                            onValueChange={(v) => setSelectedMetric(v as any)}
                        >
                            <SelectTrigger className="w-[180px] bg-surface border-outline-variant">
                                <SelectValue placeholder="Metric" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="followers">Total Followers</SelectItem>
                                <SelectItem value="impressions">Impressions</SelectItem>
                                <SelectItem value="engagement">Engagement Rate</SelectItem>
                                <SelectItem value="posts">Total Posts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 0,
                                top: 10,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={`var(--color-${selectedMetric})`} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={`var(--color-${selectedMetric})`} stopOpacity={0.01} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                horizontal={true}
                                strokeDasharray="3 3"
                                stroke="var(--outline-variant)"
                                strokeOpacity={0.2}
                            />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval="preserveStartEnd"
                                minTickGap={60}
                                tickFormatter={(value) => value}
                                tick={{ fontSize: 12, fill: "var(--on-surface-variant)" }}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                width={35}
                                tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                width={35}
                                tick={{ fontSize: 11, fill: "var(--on-surface-variant)" }}
                            />
                            <ChartTooltip
                                cursor={{ stroke: "var(--on-surface)", strokeDasharray: "4 4", strokeWidth: 1 }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Area
                                yAxisId="left"
                                dataKey={selectedMetric}
                                type="linear"
                                fill="url(#fillMetric)"
                                fillOpacity={0.4}
                                stroke="#d946ef"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#d946ef" }}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};
