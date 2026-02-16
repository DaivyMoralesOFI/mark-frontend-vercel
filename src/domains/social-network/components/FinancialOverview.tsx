"use client"

import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/shared/components/ui/chart"

const radialChartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "#d946ef",
    },
} satisfies ChartConfig

const barChartConfig = {
    desktop: {
        label: "Desktop",
        color: "#d946ef",
    },
    mobile: {
        label: "Mobile",
        color: "var(--secondary)",
    },
} satisfies ChartConfig

import { VisitorStat, TrafficData } from "../data/mockData"

interface FinancialOverviewProps {
    visitorStats: VisitorStat[];
    visitorTrend: number;
    trafficSources: TrafficData[];
    trafficTrend: number;
    timePeriod: string;
}

export function ChartRadialText({ data, trend, timePeriod }: { data: VisitorStat[], trend: number, timePeriod: string }) {
    const periodLabel = timePeriod === "7days" ? "Last 7 days" :
        timePeriod === "30days" ? "Last 30 days" :
            timePeriod === "90days" ? "Last 90 days" : "Custom Range";

    const trendPeriod = timePeriod === "7days" ? "this week" :
        timePeriod === "30days" ? "this month" :
            timePeriod === "90days" ? "this quarter" : "this period";

    return (
        <Card className="flex flex-col border-none shadow-none bg-transparent gap-0">
            <CardHeader className="items-start pb-0 px-0">
                <CardTitle className="text-xl font-medium tracking-tight">Visitor Stats</CardTitle>
                <CardDescription className="text-xs text-on-surface-variant/70 font-medium">{periodLabel}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 px-0">
                <ChartContainer
                    config={radialChartConfig}
                    className="mx-auto h-[180px] w-full"
                >
                    <RadialBarChart
                        data={data}
                        startAngle={0}
                        endAngle={250}
                        innerRadius={60}
                        outerRadius={90}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-surface-container-high last:fill-surface"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="visitors" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-on-surface text-3xl font-normal"
                                                >
                                                    {data[0].visitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-on-surface-variant text-sm font-normal"
                                                >
                                                    Visitors
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm px-0 items-start">
                <div className="flex items-center gap-2 leading-none font-medium text-emerald-600 dark:text-emerald-400">
                    Trending up by {trend.toFixed(1)}% {trendPeriod} <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}



export function ChartBarStacked({ data, trend, timePeriod }: { data: TrafficData[], trend: number, timePeriod: string }) {
    const periodLabel = timePeriod === "7days" ? "Last 7 days" :
        timePeriod === "30days" ? "Last 30 days" :
            timePeriod === "90days" ? "Last 90 days" : "Custom Range";

    const trendPeriod = timePeriod === "7days" ? "this week" :
        timePeriod === "30days" ? "this month" :
            timePeriod === "90days" ? "this quarter" : "this period";

    return (
        <Card className="border-none shadow-none bg-transparent gap-0">
            <CardHeader className="px-0">
                <CardTitle className="text-xl font-medium tracking-tight">Traffic Sources</CardTitle>
                <CardDescription className="text-xs text-on-surface-variant/70 font-medium">{periodLabel}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 h-[180px]">
                <ChartContainer config={barChartConfig} className="h-full w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} stroke="var(--outline-variant)" opacity={0.4} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tick={{ fill: "var(--on-surface-variant)", fontSize: 12 }}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="desktop"
                            stackId="a"
                            fill="#d946ef"
                            radius={[0, 0, 4, 4]}
                            barSize={32}
                        />
                        <Bar
                            dataKey="mobile"
                            stackId="a"
                            fill="var(--secondary)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm px-0 border-none">
                <div className="flex gap-2 leading-none font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                    Trending up by {trend.toFixed(1)}% {trendPeriod} <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}

export const FinancialOverview = ({ visitorStats, visitorTrend, trafficSources, trafficTrend, timePeriod }: FinancialOverviewProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 pt-6">
            <ChartRadialText data={visitorStats} trend={visitorTrend} timePeriod={timePeriod} />
            <div className="md:border-l md:border-outline-variant md:pl-12">
                <ChartBarStacked data={trafficSources} trend={trafficTrend} timePeriod={timePeriod} />
            </div>
        </div>
    );
};
