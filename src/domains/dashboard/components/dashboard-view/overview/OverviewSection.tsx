

import { KPICard } from "@/core/router/router";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Area, AreaChart, XAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";

const chartData = [
    { date: "2024-04-01", desktop: 222 },
    { date: "2024-04-02", desktop: 97 },
    { date: "2024-04-03", desktop: 167 },
    { date: "2024-04-04", desktop: 242 },
    { date: "2024-04-05", desktop: 373 },
    { date: "2024-04-06", desktop: 301 },
    { date: "2024-04-07", desktop: 245 },
    { date: "2024-04-08", desktop: 409 },
    { date: "2024-04-09", desktop: 59 },
    { date: "2024-04-10", desktop: 261 },
    { date: "2024-04-11", desktop: 327 },
    { date: "2024-04-12", desktop: 292 },
    { date: "2024-04-13", desktop: 342 },
    { date: "2024-04-14", desktop: 137 },
    { date: "2024-04-15", desktop: 120 },
    { date: "2024-04-16", desktop: 138 },
    { date: "2024-04-17", desktop: 446 },
    { date: "2024-04-18", desktop: 364 },
    { date: "2024-04-19", desktop: 243 },
    { date: "2024-04-20", desktop: 89 },
    { date: "2024-04-21", desktop: 137 },
    { date: "2024-04-22", desktop: 224 },
    { date: "2024-04-23", desktop: 138 },
    { date: "2024-04-24", desktop: 387 },
    { date: "2024-04-25", desktop: 215 },
    { date: "2024-04-26", desktop: 75 },
    { date: "2024-04-27", desktop: 383 },
    { date: "2024-04-28", desktop: 122 },
    { date: "2024-04-29", desktop: 315 },
    { date: "2024-04-30", desktop: 454 },
];

const chartConfig = {
    desktop: {
        label: "Reach",
        color: "#8884d8", // Purple
    },
} satisfies ChartConfig;

export const OverviewSection = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                    <Select defaultValue="30days">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Revenue"
                    value="$78,259"
                    trend={10.5}
                    trendLabel="from last month"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    className="bg-white shadow-sm"
                />
                <KPICard
                    title="Customers"
                    value="+1,567"
                    trend={21}
                    trendLabel="from last month"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    className="bg-white shadow-sm"
                />
                <KPICard
                    title="Total Sales"
                    value="+2,354"
                    trend={10.5}
                    trendLabel="from last month"
                    icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    className="bg-white shadow-sm"
                />
                <KPICard
                    title="Active Now"
                    value="+573"
                    trend={2.5}
                    trendLabel="from last hour"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    className="bg-white shadow-sm"
                />
            </div>

            {/* Content Row */}
            <div className="grid gap-4 md:grid-cols-1">
                {/* Chart Column */}
                <Card className="bg-white shadow-sm border-none">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={chartConfig} className="h-[350px] w-full">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <defs>
                                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(8, 10)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="url(#fillDesktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
