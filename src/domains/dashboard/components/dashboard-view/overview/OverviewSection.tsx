

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { ArrowUp, ArrowDown } from "lucide-react";

import {
    type TimePeriod,
    getKpiData,
    getOverviewChartData,
    getPeriodLabel,
} from "@/domains/dashboard/data/dashboardMockData";

const chartConfig = {
    desktop: {
        label: "Reach",
        color: "#8884d8", // Purple
    },
} satisfies ChartConfig;

interface OverviewSectionProps {
    timePeriod: TimePeriod;
    onTimePeriodChange: (value: TimePeriod) => void;
}

export const OverviewSection = ({ timePeriod, onTimePeriodChange }: OverviewSectionProps) => {
    const kpi = getKpiData(timePeriod);
    const chartData = getOverviewChartData(timePeriod);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-medium tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{getPeriodLabel(timePeriod)}</span>
                    <Select value={timePeriod} onValueChange={(v) => onTimePeriodChange(v as TimePeriod)}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 3 months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">
                {[
                    { title: "Total Followers", value: kpi.totalFollowers.value, trend: kpi.totalFollowers.trend },
                    { title: "Impressions", value: kpi.impressions.value, trend: kpi.impressions.trend },
                    { title: "Engagement Rate", value: kpi.engagementRate.value, trend: kpi.engagementRate.trend },
                    { title: "Total Posts", value: kpi.totalPosts.value, trend: kpi.totalPosts.trend },
                ].map((item) => (
                    <div key={item.title} className="px-4 first:pl-0 last:pr-0 py-5">
                        <p className="text-[11px] font-normal uppercase tracking-wider text-gray-500 mb-1">
                            {item.title}
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-medium text-gray-900">{item.value}</span>
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
                <div className="border-y border-gray-200 py-4">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={true}
                                horizontal={true}
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.7}
                            />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval="preserveStartEnd"
                                minTickGap={40}
                                tickFormatter={(value) => {
                                    const d = new Date(value);
                                    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                }}
                                tick={{ fontSize: 12, fill: "#9ca3af" }}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                width={35}
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                width={35}
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                            />
                            <ChartTooltip
                                cursor={{ stroke: "#6b7280", strokeDasharray: "4 4", strokeWidth: 1 }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Area
                                yAxisId="left"
                                dataKey="desktop"
                                type="natural"
                                fill="url(#fillDesktop)"
                                fillOpacity={0.4}
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};
