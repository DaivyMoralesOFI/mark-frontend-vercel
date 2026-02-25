import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Area, AreaChart } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { TikTokIcon } from "@/shared/components/icons/TikTokIcon";
import { FacebookIcon } from "@/shared/components/icons/FacebookIcon";
import { LinkedInIcon } from "@/shared/components/icons/LinkedInIcon";
import { ArrowUp, ArrowDown } from "lucide-react";
import { type TimePeriod, getSocialData } from "@/modules/dashboard/data/dashboardMockData";

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
    Instagram: InstagramIcon,
    TikTok: TikTokIcon,
    Facebook: FacebookIcon,
    LinkedIn: LinkedInIcon,
};

const SmallChartCard = ({
    name,
    data,
    total,
    trend,
}: {
    name: string;
    data: any[];
    total: string;
    trend?: number;
}) => {
    // Chart color based on trend direction
    const chartColor = trend !== undefined && trend > 0
        ? "#10b981"  // emerald-500
        : trend !== undefined && trend < 0
            ? "#ef4444"  // red-500
            : "#a65698"; // primary purple

    const chartConfig = {
        value: {
            label: name,
            color: chartColor,
        },
    } satisfies ChartConfig;

    const IconComp = platformIcons[name];

    return (
        <div className="bg-surface rounded-xl border-[1px] border-outline-variant p-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-md">
            {/* Title row with icon */}
            <div className="flex items-center gap-1.5">
                {IconComp && <IconComp className="w-4 h-4" />}
                <p className="text-[11px] font-normal uppercase tracking-wider text-on-surface-variant">
                    {name}
                </p>
            </div>

            {/* Value + Trend */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium text-on-surface tabular-nums">{total}</span>
                {trend !== undefined && (
                    <span
                        className={`flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? "text-emerald-500" : trend < 0 ? "text-red-500" : "text-gray-400"
                            }`}
                    >
                        {trend > 0 ? <ArrowUp className="w-3 h-3" /> : trend < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>

            {/* Sparkline */}
            <div className="h-[50px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart
                        data={data}
                        margin={{ top: 2, bottom: 0, left: 0, right: 0 }}
                    >
                        <defs>
                            <linearGradient id={`fill-${name}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={chartColor} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Area
                            dataKey="value"
                            type="monotone"
                            fill={`url(#fill-${name})`}
                            fillOpacity={1}
                            stroke={chartColor}
                            strokeWidth={1.5}
                            isAnimationActive={true}
                            animationDuration={600}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
};

interface SocialPerformanceSectionProps {
    timePeriod: TimePeriod;
}

export const SocialPerformanceSection = ({ timePeriod }: SocialPerformanceSectionProps) => {
    const [selectedMetric, setSelectedMetric] = useState<string>("engagement");
    const networks = getSocialData(timePeriod, selectedMetric);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Performance by Social Network</h2>
                <Select
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}
                >
                    <SelectTrigger className="w-[180px] bg-surface border-outline-variant">
                        <SelectValue placeholder="Metric" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="followers">Followers</SelectItem>
                        <SelectItem value="impressions">Impressions</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {networks.map((network) => (
                    <SmallChartCard
                        key={network.name}
                        name={network.name}
                        data={network.data}
                        total={network.total}
                        trend={network.trend}
                    />
                ))}
            </div>
        </div>
    );
};
